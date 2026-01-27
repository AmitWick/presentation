import { useEffect } from "react";
import useLaserCanvas from "../hooks/useLaserCanvas";
import useHotkeys from "../hooks/useHotkeys";
import { useDispatch, useSelector } from "react-redux";
import { setHideToolbar, toolbarState } from "../redux/slice/toolbarSlice";

type Props = {
  setTool: (tool: "pen" | "laser") => void;
  // tool: "pen" | "laser";
  currentSlide: number;
};

const EphemeralCanvas = ({ setTool, currentSlide }: Props) => {
  const dispatch = useDispatch();
  const laserCanvas = useLaserCanvas();
  const { registerHotkey } = useHotkeys();
  const { hideToolbar } = useSelector(toolbarState);

  useEffect(() => {
    laserCanvas.clearLaser();
  }, [currentSlide]);

  useEffect(() => {
    registerHotkey({
      key: "p",
      func() {
        setTool("pen");
      },
    });

    registerHotkey({
      key: "l",
      func() {
        setTool("laser");
      },
    });

    registerHotkey({
      key: "h",
      func() {
        dispatch(setHideToolbar());
      },
    });
  }, []);

  console.log("hideToolbar", hideToolbar);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <canvas
        ref={laserCanvas.canvasRef}
        style={laserCanvas.styleObject}
        onPointerDown={laserCanvas.onPointerDown}
        onPointerMove={laserCanvas.onPointerMove}
        onPointerUp={laserCanvas.onPointerUp}
        onPointerCancel={laserCanvas.onPointerUp}
      />
      <div
        ref={laserCanvas.cursorRef}
        style={laserCanvas.cursorStyle}
        // style={{
        //   position: "absolute",
        //   left: laserCanvas.cursorPos.x,
        //   top: laserCanvas.cursorPos.y,
        //   transform: "translate(-50%, -50%)",
        //   pointerEvents: "none",
        //   width: 14,
        //   height: 14,
        //   borderRadius: "50%",
        //   background: "rgba(255,0,0,0.8)",
        //   boxShadow: "0 0 12px red",
        //   zIndex: 999,
        // }}
      />

      <div
        className="canvas-toolbar"
        style={{ display: hideToolbar ? "none" : "block" }}
      >
        <button onClick={() => setTool("pen")}>Pen</button>
        <button onClick={() => setTool("laser")}>Laser</button>
      </div>
    </div>
  );
};

export default EphemeralCanvas;
