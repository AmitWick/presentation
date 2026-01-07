import React, { useEffect, useRef, useState } from "react";

const LearnCanvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<"default" | "pen" | "eraser">("pen");
  const [color, setColor] = useState("#c4e21cff");
  const [size, setSize] = useState(10);
  const isDrawing = useRef(false);
  const lastPressure = useRef(1);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const start = (e: React.PointerEvent) => {
    if (tool === "default") return;

    isDrawing.current = true;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.setPointerCapture(e.pointerId);

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    lastPoint.current = { x, y };

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing.current || tool === "default") return;

    const ctx = canvasRef.current!.getContext("2d")!;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    let pressure = e.pressure;
    pressure = Math.min(Math.max(pressure, 0.2), 1);
    // pressure = Math.max(0.3, pressure);

    if (pressure === 0) {
      pressure = lastPressure.current;
    } else {
      lastPressure.current = pressure;
    }

    ctx.lineWidth = size * pressure;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    const prev = lastPoint.current;
    if (!prev) return;

    // 🧠 Smooth curve
    const midX = (prev.x + x) / 2;
    const midY = (prev.y + y) / 2;

    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
    ctx.stroke();

    lastPoint.current = { x, y };
  };

  const stop = (e: React.PointerEvent) => {
    isDrawing.current = false;
    lastPressure.current = 1;
    lastPoint.current = null;

    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
  };

  return (
    <>
      <div>
        <canvas
          ref={canvasRef}
          className={`learn-canvas cursor-${tool}`}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={stop}
          onPointerLeave={stop}
        />
      </div>
      <div className="canvas-toolbar">
        <button
          onClick={() =>
            setTool((prev) => (prev === "pen" ? "default" : "pen"))
          }
        >
          Pen
        </button>
        <button
          onClick={() =>
            setTool((prev) => (prev === "eraser" ? "default" : "eraser"))
          }
        >
          Eraser
        </button>
      </div>
    </>
  );
};

export default LearnCanvas;
