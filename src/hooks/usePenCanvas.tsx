import React, { useEffect, useLayoutEffect, useRef } from "react";
type Point = {
  x: number;
  y: number;
  pressure: number;
};

export type Stroke = {
  color: string;
  points: Point[];
  eraser?: boolean;
};

const usePenCanvas = (strokeColor: string = "#000000") => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const isEraser = useRef(false);
  // const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const cursorRef = useRef<HTMLDivElement>(null);

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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

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
      ctx.lineWidth = 20; // eraser size
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeColor;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // const rect = e.currentTarget.getBoundingClientRect();
    // setCursorPos({
    //   x: e.clientX - rect.left,
    //   y: e.clientY - rect.top,
    // });

    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;

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
    pointsRef.current = [];

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    console.log("pointsRef.current", pointsRef.current);

    // pointsRef.current = [];

    const ctx = ctxRef.current!;
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over"; // reset
  };

  const clearCanvas = () => {
    // slideStrokesRef.current = [];

    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const enableEraser = () => (isEraser.current = true);

  const enablePen = () => (isEraser.current = false);

  const CursorComponent = () => (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 1000,
        width: isEraser.current ? 24 : 6,
        height: isEraser.current ? 24 : 6,
        borderRadius: "50%",
        border: isEraser.current ? "2px solid red" : `2px solid ${strokeColor}`,
        background: isEraser.current ? "rgba(255,0,0,0.2)" : strokeColor,
      }}
    />
  );

  const cursorStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    // transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    zIndex: 999,
    width: isEraser.current ? 24 : 6,
    height: isEraser.current ? 24 : 6,
    borderRadius: "50%",
    border: isEraser.current ? "2px solid red" : `2px solid ${strokeColor}`,
    background: isEraser.current ? "rgba(255,0,0,0.2)" : strokeColor,
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
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
    }

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

  const getImageData = () => {
    // const canvas = canvasRef.current!;
    // const ctx = ctxRef.current!;
    // return ctx.getImageData(0, 0, canvas.width, canvas.height);

    console.log("points", pointsRef.current);

    // SAVE FULL STROKE
    if (pointsRef.current.length > 1) {
      slideStrokesRef.current.push({
        color: strokeColor,
        points: [...pointsRef.current],
        eraser: isEraser.current,
      });
    }

    // const stroke: Stroke = {
    //   color: strokeColor,
    //   points: [...pointsRef.current],
    //   eraser: isEraser.current,
    // };

    // console.log("stroke", stroke);

    // slideStrokes.push(stroke);

    // console.log("slideStrokes", slideStrokes);

    console.log("slideStrokesRef.current", slideStrokesRef.current);

    return slideStrokesRef.current;
  };

  const restoreImageData = (strokes: Stroke[]) => {
    // const ctx = ctxRef.current!;
    clearCanvas();

    // slideStrokesRef.current = strokes;

    // strokes.forEach((stroke) => drawStroke(ctx, stroke));

    // const ctx = ctxRef.current!;
    // ctx.putImageData(data, 0, 0);
    strokes.forEach((stroke) => drawStroke(stroke));
  };

  return {
    canvasRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    clearCanvas,
    // cursorPos,
    CursorComponent,
    styleObject,
    enableEraser,
    enablePen,
    isEraser,
    getImageData,
    restoreImageData,
    cursorStyle,
    cursorRef,
  };
};

export default usePenCanvas;
