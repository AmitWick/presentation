import { useDispatch, useSelector } from "react-redux";
import {
  initialColorState,
  setStrokeSize,
} from "../../redux/slice/initialColorSlice";

const PenSize = () => {
  const { strokeSize } = useSelector(initialColorState);
  const dispatch = useDispatch();

  return (
    <section style={{ padding: "20px", display: "flex" }}>
      <div style={{ flex: "1" }}>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            margin: 0,
            borderBottom: "2px solid black",
            width: "fit-content",
          }}
        >
          Pen Stroke Size
        </p>
        <div>
          <p style={{ fontWeight: "bold" }}>{strokeSize.penStrokeSize}px</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="penStrokeSize">Size : </label>
            <input
              type="range"
              id="penStrokeSize"
              name="penStrokeSize"
              min={1}
              max={20}
              step={1}
              value={strokeSize.penStrokeSize}
              onChange={(e) =>
                dispatch(
                  setStrokeSize({ penStrokeSize: parseInt(e.target.value) })
                )
              }
            />
          </div>
        </div>
      </div>
      <div style={{ flex: "1" }}>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            margin: 0,
            borderBottom: "2px solid black",
            width: "fit-content",
          }}
        >
          Laser Stroke Size
        </p>
        <div>
          <p style={{ fontWeight: "bold" }}>{strokeSize.laserStrokeSize}px</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="laserStrokeSize">Size : </label>
            <input
              type="range"
              id="laserStrokeSize"
              name="laserStrokeSize"
              min={1}
              max={20}
              step={1}
              value={strokeSize.laserStrokeSize}
              onChange={(e) =>
                dispatch(
                  setStrokeSize({ laserStrokeSize: parseInt(e.target.value) })
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PenSize;
