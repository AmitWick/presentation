import { useRef, useState } from "react";
import "./App.css";
import ImageViewer from "./components/ImageViewer";
import ReactCanvas from "./components/ReactCanvas";
import CustomizeSetup from "./components/customizeSetup/CustomizeSetup";
import type { Stroke } from "./hooks/usePenCanvas";

export type BoardType = "noType" | "image" | "blackboard" | "whiteboard";
export type ToolType = "pen" | "laser";

function App() {
  const [slides, setSlides] = useState<string[]>(() => {
    return localStorage.getItem("slides")
      ? JSON.parse(localStorage.getItem("slides")!)
      : [];
  });
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [boardType, setBoardType] = useState<BoardType>("noType");

  let drawings = useRef<Record<number, Stroke[]>>({});

  const [openOptionComponent, setOpenOptionComponent] = useState(false);

  const [tool, setTool] = useState<ToolType>("laser");
  const [blackBoardTool, setBlackBoardTool] = useState<ToolType>("laser");
  const [whiteBoardTool, setWhiteBoardTool] = useState<ToolType>("laser");

  const clearSlide = (index: number) => {
    const previousData = { ...drawings.current };
    delete previousData[index];

    drawings.current = previousData;
  };

  const saveDrawing = (
    index: number,
    data: Stroke[],
    clear: boolean = false,
  ) => {
    if (clear && index !== null) {
      clearSlide(index);
      return;
    }

    const previousData = drawings.current?.[index] || [];

    drawings.current = {
      ...drawings.current,
      [index]: [...previousData, ...data],
    };
  };

  return (
    <>
      <ImageViewer
        containerRef={containerRef}
        slides={slides}
        setSlides={setSlides}
        setCurrent={setCurrent}
        setIsFullScreen={setIsFullScreen}
        isFullScreen={isFullScreen}
        setBoardType={setBoardType}
        setOpenOptionComponent={setOpenOptionComponent}
      />

      {slides.length > 0 && (
        <div ref={containerRef} className={"presenter"}>
          {boardType === "image" && (
            <>
              <img src={slides[current]} className="slide" />
              {isFullScreen && (
                <section
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                  }}
                >
                  <ReactCanvas
                    currentSlide={current}
                    defaultTool="laser"
                    drawings={drawings.current}
                    saveDrawing={saveDrawing}
                    tool={tool}
                    setTool={setTool}
                  />
                </section>
              )}
            </>
          )}
          {boardType === "blackboard" && (
            <>
              {/* <div className="blackboard">BlackBoard</div> */}
              {isFullScreen && (
                <section
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                  }}
                >
                  <ReactCanvas
                    currentSlide={current}
                    defaultTool="pen"
                    defaultStrokeColor="#fff"
                    tool={blackBoardTool}
                    setTool={setBlackBoardTool}
                  />
                </section>
              )}
            </>
          )}
          {boardType === "whiteboard" && (
            <>
              {/* <div className="whiteboard">WhiteBoard</div> */}
              {isFullScreen && (
                <section
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                  }}
                >
                  <ReactCanvas
                    currentSlide={current}
                    defaultTool="pen"
                    defaultStrokeColor="#000"
                    tool={whiteBoardTool}
                    setTool={setWhiteBoardTool}
                  />
                </section>
              )}
            </>
          )}
        </div>
      )}
      {openOptionComponent && (
        <CustomizeSetup setOpenOptionComponent={setOpenOptionComponent} />
      )}
    </>
  );
}

export default App;
