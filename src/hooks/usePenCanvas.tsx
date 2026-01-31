import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
  pressure: number;
};

export type Stroke = {
  id: string;
  color: string;
  width: number;
  points: Point[];
  eraser: boolean;
};

const usePenCanvas = (
  strokeColor: string = "#000000",
  penWidth: number = 4,
  eraserWidth: number = 20,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const isEraser = useRef(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const [eraserUI, setEraserUI] = useState(false);

  const slideStrokesRef = useRef<Stroke[]>([]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;

    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    })!;

    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = penWidth;

    // background
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;

    if (!isEraser.current) {
      ctxRef.current.strokeStyle = strokeColor;
    }
  }, [strokeColor]);

  useEffect(() => {
    if (!ctxRef.current) return;

    if (!isEraser.current) {
      ctxRef.current.lineWidth = penWidth;
    }
  }, [penWidth]);

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();

    // 🔒 CAPTURE POINTER
    e.currentTarget.setPointerCapture(e.pointerId);

    drawing.current = true;
    pointsRef.current = [];

    const { x, y } = getPos(e);
    pointsRef.current.push({ x, y, pressure: e.pressure || 0.5 });

    const ctx = ctxRef.current!;

    if (isEraser.current) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = eraserWidth;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeColor;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { x, y } = getPos(e);

    // ✅ Move cursor WITHOUT React render
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    if (!drawing.current) return;

    const pressure = e.pressure || 0.5;

    const ctx = ctxRef.current!;

    // ERASER MODE (simple + fast)
    if (isEraser.current) {
      pointsRef.current.push({ x, y, pressure });
      ctx.lineTo(x, y);
      ctx.stroke();
      return;
    }

    const points = pointsRef.current;
    points.push({ x, y, pressure });

    if (points.length < 3) return;

    const p0 = points[points.length - 3];
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];

    const mid1 = {
      x: (p0.x + p1.x) / 2,
      y: (p0.y + p1.y) / 2,
    };

    const mid2 = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };

    // pressure smoothing
    ctx.lineWidth = 2 + ((p0.pressure + p1.pressure) / 2) * 8;

    ctx.beginPath();
    ctx.moveTo(mid1.x, mid1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
    ctx.stroke();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    drawing.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (pointsRef.current.length < 2) {
      pointsRef.current = [];
      return;
    }

    // const ctx = ctxRef.current!;

    // SAVE FULL STROKE
    if (pointsRef.current.length > 1) {
      slideStrokesRef.current.push({
        id: crypto.randomUUID(),
        color: strokeColor,
        width: isEraser.current ? eraserWidth : penWidth,
        points: [...pointsRef.current],
        eraser: isEraser.current,
      });
    }

    pointsRef.current = [];
    // ctx.closePath();
    // ctx.globalCompositeOperation = "source-over";
  };

  const clearCanvas = () => {
    slideStrokesRef.current = [];

    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const cursorStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    pointerEvents: "none",
    zIndex: 999,
    width: eraserUI ? 24 : 6,
    height: eraserUI ? 24 : 6,
    borderRadius: "50%",
    border: eraserUI ? "2px solid red" : `2px solid ${strokeColor}`,
    background: eraserUI ? "rgba(255,0,0,0.2)" : strokeColor,
  };

  const styleObject: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    display: "block",
    touchAction: "none",
    userSelect: "none",
    cursor: "none",
  };

  const drawStroke = (stroke: Stroke) => {
    const ctx = ctxRef.current!;

    const points = stroke.points;

    if (points.length < 2) return;

    ctx.save();

    // Handle eraser mode
    if (stroke.eraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const p0 = points[0];

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);

      for (let i = 1; i < points.length; i++) {
        const { x, y } = points[i];

        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.restore();
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 2; i < points.length; i++) {
      const p0 = points[i - 2];
      const p1 = points[i - 1];
      const p2 = points[i];

      const mid1 = {
        x: (p0.x + p1.x) / 2,
        y: (p0.y + p1.y) / 2,
      };

      const mid2 = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };

      // Pressure smoothing
      ctx.lineWidth = 2 + ((p0.pressure + p1.pressure) / 2) * 8;

      ctx.beginPath();
      ctx.moveTo(mid1.x, mid1.y);
      ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
      ctx.stroke();
    }

    ctx.restore();
  };

  return {
    canvasRef,
    cursorRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    clearCanvas,
    cursorStyle,
    styleObject,
    enableEraser: () => {
      isEraser.current = true;
      setEraserUI(true);
    },
    enablePen: () => {
      isEraser.current = false;
      setEraserUI(false);
    },
    isEraser,
    getStrokes: () => slideStrokesRef.current,
    loadStrokes: (s: Stroke[]) => {
      clearCanvas();
      s.forEach(drawStroke);
    },
  };
};

export default usePenCanvas;
