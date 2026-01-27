import { useEffect, useState, type ChangeEvent } from "react";
import usePenCanvas, { type Stroke } from "../hooks/usePenCanvas";
import useHotkeys from "../hooks/useHotkeys";
import { useDispatch, useSelector } from "react-redux";
import { setHideToolbar, toolbarState } from "../redux/slice/toolbarSlice";

type Props = {
  setTool: (tool: "pen" | "laser") => void;
  // tool: "pen" | "laser";
  defaultStrokeColor?: string;
  drawings?: Record<number, Stroke[]>;
  saveDrawing?: (index: number, data: Stroke[]) => void;
  currentSlide: number;
};

const LearnWritingInCanvas = ({
  setTool,
  defaultStrokeColor = "#000000",
  drawings,
  saveDrawing,
  currentSlide,
}: Props) => {
  const { registerHotkey } = useHotkeys();
  const dispatch = useDispatch();

  const { hideToolbar } = useSelector(toolbarState);

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

  useEffect(() => {
    registerHotkey({
      key: "p",
      func() {
        setTool("pen");
        penCanvas.enablePen();
      },
    });

    registerHotkey({
      key: "l",
      func() {
        setTool("laser");
      },
    });

    registerHotkey({
      key: "e",
      func() {
        penCanvas.enableEraser();
      },
    });

    registerHotkey({
      key: "c",
      func() {
        penCanvas.clearCanvas();
      },
    });

    registerHotkey({
      key: "h",
      func() {
        dispatch(setHideToolbar());
      },
    });
  }, []);

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
          if (saveDrawing) {
            const data = penCanvas.getImageData();
            saveDrawing(currentSlide, data);
          }
          penCanvas.onPointerUp(e);
        }}
        onPointerLeave={(e) => {
          penCanvas.onPointerUp(e);
        }}
        onPointerCancel={(e) => penCanvas.onPointerUp(e)}
      />

      <div ref={penCanvas.cursorRef} style={penCanvas.cursorStyle} />
      {/* Toolbar */}

      <div className="canvas-toolbar">
        <input
          type="color"
          value={strokeColor}
          onChange={handleStrokeColorChange}
        />
        {!hideToolbar && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default LearnWritingInCanvas;
