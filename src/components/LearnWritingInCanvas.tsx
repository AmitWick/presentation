import { useEffect, useState, type ChangeEvent } from "react";
import usePenCanvas from "../hooks/usePenCanvas";

type Props = {
  setTool: (tool: "pen" | "laser") => void;
  // tool: "pen" | "laser";
  defaultStrokeColor?: string;
  drawings?: Record<number, ImageData>;
  saveDrawing?: (index: number, data: ImageData) => void;
  currentSlide: number;
};

const LearnWritingInCanvas = ({
  setTool,
  defaultStrokeColor = "#000000",
  drawings,
  saveDrawing,
  currentSlide,
}: Props) => {
  const [strokeColor, setStrokeColor] = useState(defaultStrokeColor);
  const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);
  };

  const penCanvas = usePenCanvas(strokeColor);

  useEffect(() => {
    if (!drawings) return;

    penCanvas.clearCanvas();

    const saved = drawings[currentSlide];
    if (saved) {
      penCanvas.restoreImageData(saved);
    }
  }, []);

  useEffect(() => {
    if (!drawings) return;

    penCanvas.clearCanvas();

    const saved = drawings[currentSlide];
    if (saved) {
      penCanvas.restoreImageData(saved);
    }
  }, [currentSlide]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <canvas
        ref={penCanvas.canvasRef}
        style={penCanvas.styleObject}
        onPointerDown={penCanvas.onPointerDown}
        onPointerMove={penCanvas.onPointerMove}
        onPointerUp={(e) => {
          penCanvas.onPointerUp(e);
          if (saveDrawing) {
            const data = penCanvas.getImageData();
            saveDrawing(currentSlide, data);
          }
        }}
        onPointerLeave={(e) => {
          penCanvas.onPointerUp(e);
        }}
        onPointerCancel={(e) => penCanvas.onPointerUp(e)}
      />

      <div
        style={{
          position: "absolute",
          left: penCanvas.cursorPos.x,
          top: penCanvas.cursorPos.y,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999,
          width: penCanvas.isEraser.current ? 24 : 6,
          height: penCanvas.isEraser.current ? 24 : 6,
          borderRadius: "50%",
          border: penCanvas.isEraser.current
            ? "2px solid red"
            : `2px solid ${strokeColor}`,
          background: penCanvas.isEraser.current
            ? "rgba(255,0,0,0.2)"
            : strokeColor,
        }}
      />
      {/* Toolbar */}

      <div className="canvas-toolbar">
        <input
          type="color"
          value={strokeColor}
          onChange={handleStrokeColorChange}
        />
        <button
          onClick={() => {
            setTool("pen");
            penCanvas.enablePen();
          }}
        >
          Pen
        </button>
        <button onClick={() => setTool("laser")}>Laser</button>

        <button onClick={penCanvas.enableEraser}>Eraser</button>
        <button onClick={penCanvas.clearCanvas}>Clear</button>
      </div>
    </div>
  );
};

export default LearnWritingInCanvas;
