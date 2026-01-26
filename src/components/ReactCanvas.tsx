import EphemeralCanvas from "./EphemeralCanvas";
import LearnWritingInCanvas from "./LearnWritingInCanvas";

type Props = {
  currentSlide: number;
  defaultTool?: "pen" | "laser";
  defaultStrokeColor?: string;
  drawings?: Record<number, ImageData>;
  saveDrawing?: (index: number, data: ImageData) => void;
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
