import React, { useEffect, useRef, useState } from "react";
import getStroke from "perfect-freehand";

type Point = [number, number, number];

const PerfectFreehand = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const points = useRef<Point[]>([]);

  const [color, setColor] = useState("#c4e21c");
  const [size, setSize] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const getCanvasPoint = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return [
      e.clientX - rect.left,
      e.clientY - rect.top,
      e.pressure || 0.5,
    ] as Point;
  };

  const start = (e: React.PointerEvent) => {
    isDrawing.current = true;
    points.current = [getCanvasPoint(e)];
    canvasRef.current!.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;

    points.current.push(getCanvasPoint(e));
    redraw();
  };

  const stop = () => {
    isDrawing.current = false;
    points.current = [];
  };

  const redraw = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stroke = getStroke(points.current, {
      size,
      thinning: 0.6,
      smoothing: 0.7,
      streamline: 0.6,
      easing: (t) => t,
      simulatePressure: false,
    });

    drawStroke(ctx, stroke, color);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ touchAction: "none", display: "block" }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerLeave={stop}
      />

      <div className="canvas-toolbar">
        <button onClick={() => setSize((s) => s + 2)}>+</button>
        <button onClick={() => setSize((s) => Math.max(2, s - 2))}>-</button>
      </div>
    </>
  );
};

export default PerfectFreehand;

function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: number[][],
  color: string
) {
  if (!stroke.length) return;

  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(stroke[0][0], stroke[0][1]);

  for (let i = 1; i < stroke.length; i++) {
    ctx.lineTo(stroke[i][0], stroke[i][1]);
  }

  ctx.closePath();
  ctx.fill();
}
