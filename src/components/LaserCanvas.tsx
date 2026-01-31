import { useEffect, useRef, useState } from "react";

// type Point = { x: number; y: number };

type LaserPoint = {
  x: number;
  y: number;
  time: number;
};

const LaserCanvas = () => {
  const laserCanvasRef = useRef<HTMLCanvasElement>(null);
  const laserCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const laserPointsRef = useRef<LaserPoint[]>([]);
  const LASER_LIFETIME = 600; // ms
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);
  const isPointerDown = useRef(false);

  useEffect(() => {
    const canvas = laserCanvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.shadowColor = "red";
    ctx.shadowBlur = 10;

    laserCtxRef.current = ctx;
  }, []);

  const drawLaser = (x: number, y: number) => {
    const ctx = laserCtxRef.current!;
    const now = performance.now();

    laserPointsRef.current.push({ x, y, time: now });

    // remove expired points
    laserPointsRef.current = laserPointsRef.current.filter(
      (p) => now - p.time < LASER_LIFETIME
    );

    ctx.clearRect(
      0,
      0,
      laserCanvasRef.current!.getBoundingClientRect().width,
      laserCanvasRef.current!.getBoundingClientRect().height
    );

    ctx.beginPath();

    laserPointsRef.current.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();
  };

  useEffect(() => {
    let raf: number;

    const fade = () => {
      const ctx = laserCtxRef.current;
      if (!ctx) return;

      const now = performance.now();
      laserPointsRef.current = laserPointsRef.current.filter(
        (p) => now - p.time < LASER_LIFETIME
      );

      ctx.clearRect(
        0,
        0,
        laserCanvasRef.current!.getBoundingClientRect().width,
        laserCanvasRef.current!.getBoundingClientRect().height
      );

      ctx.beginPath();
      laserPointsRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      raf = requestAnimationFrame(fade);
    };

    fade();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        zIndex: 10,
      }}
    >
      <canvas
        ref={laserCanvasRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "none",
          touchAction: "none",
        }}
        onPointerDown={(e) => {
          isPointerDown.current = true;
          activePointerId.current = e.pointerId;
        }}
        onPointerMove={(e) => {
          if (!isPointerDown.current) return;
          if (e.pointerId !== activePointerId.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          setCursorPos({ x, y });

          drawLaser(x, y);
        }}
        onPointerUp={() => {
          laserPointsRef.current = [];
        }}
      />

      <div
        style={{
          position: "fixed",
          left: cursorPos.x,
          top: cursorPos.y,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "rgba(255,0,0,0.8)",
          boxShadow: "0 0 12px red",
          zIndex: 9999,
        }}
      />
    </div>
  );
};

export default LaserCanvas;
