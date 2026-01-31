import React, { useEffect, useLayoutEffect, useRef } from "react";

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

  // const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const laserStrokesRef = useRef<LaserStroke[]>([]);
  const currentStrokeRef = useRef<LaserStroke | null>(null);

  const LASER_LIFETIME = 3000;
  const MIN_VISIBLE_TIME = 80; // ms

  const cursorRef = useRef<HTMLDivElement>(null);

  // ✅ setup canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;
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

  // ✅ Ultra-smooth render loop
  useEffect(() => {
    let raf = 0;

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const now = performance.now();
      if (laserStrokesRef.current.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      // prune expired strokes
      laserStrokesRef.current = laserStrokesRef.current.filter((stroke) => {
        if (stroke.endTime === null) return true;
        return now - stroke.endTime < LASER_LIFETIME;
      });

      for (const stroke of laserStrokesRef.current) {
        const pts = stroke.points;
        // if (pts.length < 2) continue;
        if (pts.length === 1) {
          ctx.beginPath();
          ctx.arc(pts[0].x, pts[0].y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "red";
          ctx.fill();
          continue;
        }

        let alpha = 1;
        if (stroke.endTime !== null) {
          // alpha = 1 - (now - stroke.endTime) / LASER_LIFETIME;

          const age = now - stroke.endTime;

          if (age < MIN_VISIBLE_TIME) {
            alpha = 1;
          } else {
            alpha = 1 - (age - MIN_VISIBLE_TIME) / LASER_LIFETIME;
          }
        }

        ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
        ctx.lineWidth = 4 * alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "red";

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 1; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
        }

        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);

        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  // useEffect(() => {
  //   let raf: number;

  //   const drawLaser = () => {
  //     const canvas = canvasRef.current!;
  //     const ctx = ctxRef.current!;
  //     const now = performance.now();

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     laserStrokesRef.current = laserStrokesRef.current.filter((stroke) => {
  //       // keep strokes that are still drawing
  //       if (stroke.endTime === null) return true;

  //       return now - stroke.endTime < LASER_LIFETIME;
  //     });

  //     for (const stroke of laserStrokesRef.current) {
  //       const pts = stroke.points;
  //       if (pts.length < 2) continue;

  //       let alpha = 1;
  //       if (stroke.endTime !== null) {
  //         alpha = 1 - (now - stroke.endTime) / LASER_LIFETIME;
  //       }

  //       ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
  //       ctx.lineWidth = 4 * alpha;
  //       ctx.lineCap = "round";
  //       ctx.lineJoin = "round";
  //       ctx.shadowBlur = 10;
  //       ctx.shadowColor = "red";

  //       ctx.beginPath();

  //       // move to first point
  //       ctx.moveTo(pts[0].x, pts[0].y);

  //       if (pts.length === 2) {
  //         // just a line if only 2 points
  //         ctx.lineTo(pts[1].x, pts[1].y);
  //       } else {
  //         for (let i = 1; i < pts.length - 1; i++) {
  //           // const p0 = pts[i - 1];
  //           const p1 = pts[i];
  //           const p2 = pts[i + 1];

  //           const midX = (p1.x + p2.x) / 2;
  //           const midY = (p1.y + p2.y) / 2;

  //           ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
  //         }

  //         // ensure last segment is drawn
  //         const last = pts[pts.length - 1];
  //         ctx.lineTo(last.x, last.y);
  //       }

  //       ctx.stroke();
  //     }

  //     //   for (const stroke of laserStrokesRef.current) {
  //     //     let alpha = 1;

  //     //     if (stroke.endTime !== null) {
  //     //       alpha = 1 - (now - stroke.endTime) / LASER_LIFETIME;
  //     //     }

  //     //     ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
  //     //     ctx.lineWidth = 6 * alpha;
  //     //     ctx.lineCap = "round";
  //     //     ctx.lineJoin = "round";

  //     //     const pts = stroke.points;
  //     //     if (pts.length < 2) continue;

  //     //     ctx.beginPath();
  //     //     ctx.moveTo(pts[0].x, pts[0].y);

  //     //     for (let i = 1; i < pts.length; i++) {
  //     //       ctx.lineTo(pts[i].x, pts[i].y);
  //     //     }

  //     //     ctx.stroke();
  //     //   }

  //     raf = requestAnimationFrame(drawLaser);
  //   };

  //   raf = requestAnimationFrame(drawLaser);
  //   return () => cancelAnimationFrame(raf);
  // }, []);

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

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // ✅ Move cursor WITHOUT React render
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
    // setCursorPos({
    //   x,
    //   y,
    // });

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
      //   currentStrokeRef.current.endTime = performance.now();
      //   currentStrokeRef.current = null;

      if (currentStrokeRef.current?.points.length < 2) {
        // keep it alive briefly
        currentStrokeRef.current.endTime = performance.now() + 60;
      } else {
        currentStrokeRef.current.endTime = performance.now();
      }
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

  const cursorStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "rgba(255,0,0,0.9)",
    boxShadow: "0 0 12px red",
    pointerEvents: "none",
    transform: "translate(-9999px, -9999px)",
    zIndex: 999,
  };

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
    cursorRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    cursorStyle,
    styleObject,
    clearLaser,
  };
};

export default useLaserCanvas;
