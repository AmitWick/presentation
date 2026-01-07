import { useRef, useState } from "react";
import "./App.css";
import ImageViewer from "./components/ImageViewer";
import ReactCanvas from "./components/ReactCanvas";
import CustomizeSetup from "./components/customizeSetup/CustomizeSetup";

function App() {
  const [slides, setSlides] = useState<string[]>(() => {
    return localStorage.getItem("slides")
      ? JSON.parse(localStorage.getItem("slides")!)
      : [];
  });
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [drawings, setDrawings] = useState<Record<number, ImageData>>({});
  const [boardType, setBoardType] = useState<
    "noType" | "image" | "blackboard" | "whiteboard"
  >("noType");

  // const openOptionComponentRef = useRef(false);
  const [openOptionComponent, setOpenOptionComponent] = useState(false);

  const [tool, setTool] = useState<"pen" | "laser">("laser");
  const [blackBoardTool, setBlackBoardTool] = useState<"pen" | "laser">(
    "laser"
  );
  const [whiteBoardTool, setWhiteBoardTool] = useState<"pen" | "laser">(
    "laser"
  );

  const saveDrawing = (index: number, data: ImageData) => {
    setDrawings((prev) => ({ ...prev, [index]: data }));
  };

  console.log({ drawings });

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
                    drawings={drawings}
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
              <div className="blackboard">BlackBoard</div>
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
              <div className="whiteboard">WhiteBoard</div>
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
