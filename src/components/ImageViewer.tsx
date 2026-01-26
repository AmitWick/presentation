import React, { useEffect, useState } from "react";
import { pdfToImages } from "../pdfToImages";
import type { BoardType } from "../App";

type Props = {
  slides: string[];
  setSlides: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  isFullScreen: boolean;
  setOpenOptionComponent: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageViewer = ({
  slides,
  setCurrent,
  setSlides,
  containerRef,
  setIsFullScreen,
  setBoardType,
  isFullScreen,
  setOpenOptionComponent,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    const imgs = await pdfToImages(file);
    setSlides(imgs);
    localStorage.setItem("slides", JSON.stringify(imgs));
    setLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);

      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "ArrowRight") {
        setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
      }

      if (e.key === "ArrowLeft") {
        setCurrent((prev) => Math.max(prev - 1, 0));
      }

      if (e.key.toLowerCase() === "f") {
        enterFullscreen("image");
      }

      if (e.key.toLowerCase() === "b") {
        if (!isFullScreen) {
          enterFullscreen("blackboard");
        } else {
          setBoardType((prev) =>
            prev === "blackboard" ? "image" : "blackboard"
          );
        }
      }
      if (e.key.toLowerCase() === "w") {
        if (!isFullScreen) {
          enterFullscreen("whiteboard");
        } else {
          setBoardType((prev) =>
            prev === "whiteboard" ? "image" : "whiteboard"
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  const enterFullscreen = async (boardType: BoardType) => {
    if (!containerRef?.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    }
    setIsFullScreen(true);
    setBoardType(boardType);
  };

  // const exitFullscreen = async (boardType: BoardType) => {
  //   if (document.fullscreenElement) {
  //     await document.exitFullscreen();
  //   }
  //   setIsFullScreen(false);
  //   setBoardType("noType");
  // };

  // const toggleFullscreen = (forwardRef, boardType: BoardType) => {
  //   if (!document.fullscreenElement) {
  //     enterFullscreen(forwardRef, boardType);
  //   } else {
  //     exitFullscreen(boardType);
  //   }
  // };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          alignItems: "center",
          height: "80px",
          borderBottom: "1px solid #ffffff96",
          position: "sticky",
          top: 0,
          backgroundColor: "#111",
          zIndex: 10,
        }}
      >
        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.[0]) {
                handleFile(files[0]);
              }
            }}
          />
        </div>
        <button onClick={() => enterFullscreen("image")}>Full Screen</button>
        <button onClick={() => enterFullscreen("whiteboard")}>
          WhiteBoard
        </button>
        <button onClick={() => enterFullscreen("blackboard")}>
          BlackBoard
        </button>
        <button onClick={() => setOpenOptionComponent(true)}>Option</button>
        {/* <button onClick={() => toggleFullscreen()}>Background</button> */}
      </div>

      {loading && <div className="loading">Loading...</div>}
      <main style={{ display: "flex" }}>
        {/* <aside
          style={{
            flex: "1 0 200px",
            height: "100vh",
            overflowY: "auto",
            borderRight: "1px solid #444",
          }}
        >
          <div style={{ padding: "20px" }}>
            <div
              style={{
                background: "#fff",
                color: "#000",
              }}
            >
              <p>Hello</p>
              <p>World</p>
            </div>
          </div>
        </aside> */}
        <section
          style={{ flex: "1 1 auto", height: "100vh", overflowY: "auto" }}
        >
          <div className="slides">
            {slides.length > 0 &&
              slides.map((slide, index) => {
                return <img src={slide} key={index} />;
              })}
          </div>
        </section>
      </main>
    </>
  );
};

export default ImageViewer;
