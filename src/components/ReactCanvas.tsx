import type { Stroke } from "../hooks/usePenCanvas";
import EphemeralCanvas from "./EphemeralCanvas";
import LearnWritingInCanvas from "./LearnWritingInCanvas";

type Props = {
  currentSlide: number;
  defaultTool?: "pen" | "laser";
  defaultStrokeColor: string;
  drawings?: Record<number, Stroke[]>;
  saveDrawing?: (index: number, data: Stroke[]) => void;
  tool: "pen" | "laser";
  setTool: (key: "pen" | "laser") => void;
};

const ReactCanvas = ({
  currentSlide,
  // defaultTool = "laser",
  defaultStrokeColor,
  drawings,
  saveDrawing,
  tool,
  setTool,
}: Props) => {
  return (
    <>
      {tool === "pen" && (
        <LearnWritingInCanvas
          setTool={setTool}
          defaultStrokeColor={defaultStrokeColor}
          drawings={drawings}
          saveDrawing={saveDrawing}
          currentSlide={currentSlide}
        />
      )}

      {tool === "laser" && (
        <EphemeralCanvas setTool={setTool} currentSlide={currentSlide} />
      )}
    </>
  );
};

export default ReactCanvas;
