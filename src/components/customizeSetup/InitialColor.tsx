import { useDispatch, useSelector } from "react-redux";
import {
  initialColorState,
  setInitialColor,
} from "../../redux/slice/initialColorSlice";

const InitialColor = () => {
  const { strokeColor } = useSelector(initialColorState);
  const dispatch = useDispatch();

  const handleStrokeColorChange = (id: string, value: string) => {
    dispatch(setInitialColor({ [id]: value }));
  };

  return (
    <section>
      {/* Initial Color on Image */}
      <article style={{ padding: "10px", borderBottom: "1px solid #000" }}>
        <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
          Initial Color on Image
        </p>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1" }}>
            <label htmlFor="penColorOnImage">Pen Color on Image: </label>
            <input
              type="color"
              id="penColorOnImage"
              name="penColorOnImage"
              value={strokeColor.penColorOnImage}
              onChange={(e) =>
                handleStrokeColorChange("penColorOnImage", e.target.value)
              }
            />
          </div>
          <div style={{ flex: "1" }}>
            <label htmlFor="laserColorOnImage">Laser Color on Image: </label>
            <input
              type="color"
              id="laserColorOnImage"
              name="laserColorOnImage"
              value={strokeColor.laserColorOnImage}
              onChange={(e) =>
                handleStrokeColorChange("laserColorOnImage", e.target.value)
              }
            />
          </div>
        </div>
      </article>

      {/* Initial Color on Whiteboard */}
      <article style={{ padding: "10px", borderBottom: "1px solid #000" }}>
        <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
          Initial Color on Whiteboard
        </p>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1" }}>
            <label htmlFor="penColorOnWhiteboard">
              Pen Color on Whiteboard:{" "}
            </label>
            <input
              type="color"
              id="penColorOnWhiteboard"
              name="penColorOnWhiteboard"
              value={strokeColor.penColorOnWhiteboard}
              onChange={(e) =>
                handleStrokeColorChange("penColorOnWhiteboard", e.target.value)
              }
            />
          </div>
          <div style={{ flex: "1" }}>
            <label htmlFor="laserColorOnWhiteboard">
              Laser Color on Whiteboard:{" "}
            </label>
            <input
              type="color"
              id="laserColorOnWhiteboard"
              name="laserColorOnWhiteboard"
              value={strokeColor.laserColorOnWhiteboard}
              onChange={(e) =>
                handleStrokeColorChange(
                  "laserColorOnWhiteboard",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </article>

      {/* Initial Color on Blackboard */}
      <article style={{ padding: "10px", borderBottom: "1px solid #000" }}>
        <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
          Initial Color on Blackboard
        </p>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1" }}>
            <label htmlFor="penColorOnBlackboard">
              Pen Color on Blackboard:{" "}
            </label>
            <input
              type="color"
              id="penColorOnBlackboard"
              name="penColorOnBlackboard"
              value={strokeColor.penColorOnBlackboard}
              onChange={(e) =>
                handleStrokeColorChange("penColorOnBlackboard", e.target.value)
              }
            />
          </div>
          <div style={{ flex: "1" }}>
            <label htmlFor="laserColorOnBlackboard">
              Laser Color on Blackboard:{" "}
            </label>
            <input
              type="color"
              id="laserColorOnBlackboard"
              name="laserColorOnBlackboard"
              value={strokeColor.laserColorOnBlackboard}
              onChange={(e) =>
                handleStrokeColorChange(
                  "laserColorOnBlackboard",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </article>
    </section>
  );
};

export default InitialColor;
