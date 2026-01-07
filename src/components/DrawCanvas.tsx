import { useEffect, useRef, useState } from "react";

type Props = {
  slideIndex: number;
  size: number;
  saveDrawing: (index: number, data: ImageData) => void;
  loadDrawing?: ImageData;
};

export default function DrawCanvas({
  slideIndex,
  saveDrawing,
  loadDrawing,
}: Props) {
  const [tool, setTool] = useState<"default" | "pen" | "eraser">("default");
  const [color, setColor] = useState("#ff0000");
  const [size, setSize] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = canvas.parentElement!.clientWidth;
    canvas.height = canvas.parentElement!.clientHeight;

    if (loadDrawing) {
      ctx.putImageData(loadDrawing, 0, 0);
    }
  }, [slideIndex]);

  const start = (e: React.MouseEvent) => {
    if (tool === "default") return;

    isDrawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const stop = () => {
    isDrawing.current = false;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();

    // save drawing when stroke ends
    const imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );
    saveDrawing(slideIndex, imageData);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current || tool === "default") return;

    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.lineWidth = size;
    ctx.lineCap = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`draw-layer cursor-${tool}`}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
      />
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
}
