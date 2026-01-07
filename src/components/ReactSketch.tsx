import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import LaserCanvas from "./LaserCanvas";
import LearnCanvas from "./LearnCanvas";
import LearnWritingInCanvas from "./LearnWritingInCanvas";

const ReactSketch = () => {
  const canvasRef = useRef<any>(null);
  const [width, setWidth] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser" | "laser">("pen");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const laserTimeoutRef = useRef<number | null>(null);

  const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);
  };

  const exportSVG = async () => {
    const svg = await canvasRef.current.exportSvg();
    console.log(svg);
  };

  const save = async () => {
    const paths = await canvasRef.current.exportPaths();
    localStorage.setItem("page-1", JSON.stringify(paths));
  };

  const load = async () => {
    const paths = JSON.parse(localStorage.getItem("page-1") || "[]");
    canvasRef.current.loadPaths(paths);
  };

  useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (tool === "eraser") {
      canvasRef.current.eraseMode(true);
    } else {
      canvasRef.current.eraseMode(false);
    }
  }, [tool]);

  return (
    <>
      {tool === "laser" && <LearnWritingInCanvas />}

      {tool === "pen" && (
        <>
          <ReactSketchCanvas
            ref={canvasRef}
            style={{
              border: "1px solid rgba(175, 8, 8, 1)",
              width: "100vw",
              height: "100vh",
            }}
            strokeWidth={width}
            strokeColor={strokeColor}
            eraserWidth={20}
            withTimestamp={true}
            allowOnlyPointerType="all"
            onChange={save}
            canvasColor="transparent"
            className={`cursor-${tool}`}
          />
          {/* Toolbar */}
          <div className="canvas-toolbar">
            <input
              type="color"
              value={strokeColor}
              onChange={handleStrokeColorChange}
            />
            <button onClick={() => setTool("pen")}>Pen</button>
            <button onClick={() => setTool("eraser")}>Eraser</button>
            <button onClick={() => setTool("laser")}>Laser</button>
            <button onClick={() => canvasRef.current.undo()}>Undo</button>
            <button onClick={() => canvasRef.current.redo()}>Redo</button>
            <button onClick={() => canvasRef.current.clearCanvas()}>
              Clear
            </button>
            <button onClick={() => canvasRef.current.resetCanvas()}>
              Reset
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ReactSketch;
