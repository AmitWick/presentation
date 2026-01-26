import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type LaserPoint = {
  x: number;
  y: number;
};

type LaserStroke = {
  points: LaserPoint[];
  endTime: number | null; // null = still drawing
};

const useLaserCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const isPointerDown = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const laserStrokesRef = useRef<LaserStroke[]>([]);
  const currentStrokeRef = useRef<LaserStroke | null>(null);
  const LASER_LIFETIME = 3000;

  // ✅ setup canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();

    // const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // ctx.scale(dpr, dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    let raf: number;

    const drawLaser = () => {
      const canvas = canvasRef.current!;
      const ctx = ctxRef.current!;
      const now = performance.now();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      laserStrokesRef.current = laserStrokesRef.current.filter((stroke) => {
        // keep strokes that are still drawing
        if (stroke.endTime === null) return true;

        return now - stroke.endTime < LASER_LIFETIME;
      });

      for (const stroke of laserStrokesRef.current) {
        const pts = stroke.points;
        if (pts.length < 2) continue;

        let alpha = 1;
        if (stroke.endTime !== null) {
          alpha = 1 - (now - stroke.endTime) / LASER_LIFETIME;
        }

        ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
        ctx.lineWidth = 4 * alpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "red";

        ctx.beginPath();

        // move to first point
        ctx.moveTo(pts[0].x, pts[0].y);

        if (pts.length === 2) {
          // just a line if only 2 points
          ctx.lineTo(pts[1].x, pts[1].y);
        } else {
          for (let i = 1; i < pts.length - 1; i++) {
            // const p0 = pts[i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          }

          // ensure last segment is drawn
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);
        }

        ctx.stroke();
      }

      //   for (const stroke of laserStrokesRef.current) {
      //     let alpha = 1;

      //     if (stroke.endTime !== null) {
      //       alpha = 1 - (now - stroke.endTime) / LASER_LIFETIME;
      //     }

      //     ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
      //     ctx.lineWidth = 6 * alpha;
      //     ctx.lineCap = "round";
      //     ctx.lineJoin = "round";

      //     const pts = stroke.points;
      //     if (pts.length < 2) continue;

      //     ctx.beginPath();
      //     ctx.moveTo(pts[0].x, pts[0].y);

      //     for (let i = 1; i < pts.length; i++) {
      //       ctx.lineTo(pts[i].x, pts[i].y);
      //     }

      //     ctx.stroke();
      //   }

      raf = requestAnimationFrame(drawLaser);
    };

    raf = requestAnimationFrame(drawLaser);
    return () => cancelAnimationFrame(raf);
  }, []);

  //   useEffect(() => {
  //     let raf: number;

  //     const drawLaser = () => {
  //       const canvas = canvasRef.current!;
  //       const ctx = ctxRef.current!;
  //       const now = performance.now();

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);

  //       laserStrokesRef.current = laserStrokesRef.current.filter((stroke) => {
  //         stroke.points = stroke.points.filter(
  //           (p) => now - p.time < LASER_LIFETIME
  //         );

  //         return stroke.points.length > 0;
  //       });

  //       for (const stroke of laserStrokesRef.current) {
  //         const pts = stroke.points;

  //         for (let i = 1; i < pts.length; i++) {
  //           const age = now - pts[i].time;
  //           const alpha = 1 - age / LASER_LIFETIME;

  //           ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
  //           ctx.lineWidth = 6 * alpha;

  //           ctx.beginPath();
  //           ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
  //           ctx.lineTo(pts[i].x, pts[i].y);
  //           ctx.stroke();
  //         }
  //       }

  //       raf = requestAnimationFrame(drawLaser);
  //     };

  //     raf = requestAnimationFrame(drawLaser);
  //     return () => cancelAnimationFrame(raf);
  //   }, []);

  // ✅ laser render loop
  //   useEffect(() => {
  //     let raf: number;

  //     const drawLaser = () => {
  //       const canvas = canvasRef.current;
  //       const ctx = ctxRef.current;
  //       if (!canvas || !ctx) {
  //         raf = requestAnimationFrame(drawLaser);
  //         return;
  //       }

  //       const now = performance.now();
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);

  //       laserPointsRef.current = laserPointsRef.current.filter(
  //         (p) => now - p.time < LASER_LIFETIME
  //       );

  //       const pts = laserPointsRef.current;

  //       for (let i = 1; i < pts.length; i++) {
  //         const age = now - pts[i].time;
  //         const alpha = 1 - age / LASER_LIFETIME;

  //         ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
  //         ctx.lineWidth = 6 * alpha;

  //         ctx.beginPath();
  //         ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
  //         ctx.lineTo(pts[i].x, pts[i].y);
  //         ctx.stroke();
  //       }

  //       raf = requestAnimationFrame(drawLaser);
  //     };

  //     raf = requestAnimationFrame(drawLaser);
  //     return () => cancelAnimationFrame(raf);
  //   }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isPointerDown.current = true;
    activePointerId.current = e.pointerId;

    const rect = canvasRef.current!.getBoundingClientRect();

    // const rect = e.currentTarget.getBoundingClientRect();

    const stroke: LaserStroke = {
      points: [
        {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      ],
      endTime: null, // still drawing
    };

    laserStrokesRef.current.push(stroke);
    currentStrokeRef.current = stroke;
  };

  //   // ✅ pointer handlers
  //   const onPointerDown = (e: React.PointerEvent) => {
  //     isPointerDown.current = true;
  //     activePointerId.current = e.pointerId;

  //     const rect = e.currentTarget.getBoundingClientRect();
  //     const now = performance.now();

  //     const stroke: LaserStroke = {
  //       id: now,
  //       points: [
  //         {
  //           x: e.clientX - rect.left,
  //           y: e.clientY - rect.top,
  //           time: now,
  //         },
  //       ],
  //     };

  //     laserStrokesRef.current.push(stroke);
  //     currentStrokeRef.current = stroke;
  //   };

  //   const onPointerDown = (e: React.PointerEvent) => {
  //     isPointerDown.current = true;
  //     activePointerId.current = e.pointerId;
  //     laserPointsRef.current = [];

  //     const rect = e.currentTarget.getBoundingClientRect();
  //     laserPointsRef.current.push({
  //       x: e.clientX - rect.left,
  //       y: e.clientY - rect.top,
  //       time: performance.now(),
  //     });
  //   };
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();

    // const rect = e.currentTarget.getBoundingClientRect();

    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    if (!isPointerDown.current) return;
    if (e.pointerId !== activePointerId.current) return;
    if (!currentStrokeRef.current) return;

    currentStrokeRef.current.points.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  //   const onPointerMove = (e: React.PointerEvent) => {
  //     if (!isPointerDown.current) return;
  //     if (e.pointerId !== activePointerId.current) return;
  //     if (!currentStrokeRef.current) return;

  //     const rect = e.currentTarget.getBoundingClientRect();

  //     currentStrokeRef.current.points.push({
  //       x: e.clientX - rect.left,
  //       y: e.clientY - rect.top,
  //       time: performance.now(),
  //     });
  //   };

  //   const onPointerMove = (e: React.PointerEvent) => {
  //     if (!isPointerDown.current) return;
  //     if (e.pointerId !== activePointerId.current) return;

  //     const rect = e.currentTarget.getBoundingClientRect();
  //     laserPointsRef.current.push({
  //       x: e.clientX - rect.left,
  //       y: e.clientY - rect.top,
  //       time: performance.now(),
  //     });
  //   };

  const onPointerUp = (e: React.PointerEvent) => {
    isPointerDown.current = false;
    activePointerId.current = null;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (currentStrokeRef.current) {
      currentStrokeRef.current.endTime = performance.now();
      currentStrokeRef.current = null;
    }
  };

  //   const onPointerUp = () => {
  //     isPointerDown.current = false;
  //     activePointerId.current = null;
  //     currentStrokeRef.current = null;
  //   };

  //   const onPointerUp = () => {
  //     isPointerDown.current = false;
  //     activePointerId.current = null;
  //   };

  const CursorComponent = () => (
    <div
      style={{
        position: "absolute",
        left: cursorPos.x,
        top: cursorPos.y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: "rgba(255,0,0,0.8)",
        boxShadow: "0 0 12px red",
        zIndex: 1000,
      }}
    />
  );

  const styleObject: React.CSSProperties = {
    touchAction: "none",
    userSelect: "none",
    cursor: "none",
  };

  const clearLaser = () => {
    laserStrokesRef.current = [];
    currentStrokeRef.current = null;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return {
    canvasRef,
    cursorPos,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    CursorComponent,
    styleObject,
    clearLaser,
  };
};

export default useLaserCanvas;
