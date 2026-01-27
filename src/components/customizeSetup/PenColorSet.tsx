import hexToRGB from "../../utils/javascript/hexToRGB";
import { useDispatch, useSelector } from "react-redux";
import {
  initialColorState,
  setPenColorSet,
} from "../../redux/slice/initialColorSlice";

const PenColorSet = () => {
  const { penColorSet } = useSelector(initialColorState);
  const dispatch = useDispatch();

  return (
    <section
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <p style={{ fontSize: "1rem", fontWeight: "bold", margin: 0 }}>
        Pen Color Set
      </p>
      <div>
        <label htmlFor="penColor">Choose Color : </label>
        <input
          id="penColor"
          type="color"
          name="penColor"
          onChange={(e) =>
            dispatch(setPenColorSet([...penColorSet, e.target.value]))
          }
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "20px",
        }}
      >
        {penColorSet.map((color: string) => {
          return (
            <div
              key={color}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "14px" }}>{hexToRGB(color)}</p>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: color,
                }}
              />

              <div
                style={{
                  position: "relative",
                  height: "30px",
                  width: "30px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  dispatch(
                    setPenColorSet(
                      penColorSet.filter((c: string) => c !== color)
                    )
                  )
                }
              >
                <div
                  style={{
                    position: "absolute",
                    height: "20px",
                    width: "20px",
                    top: "50%",
                    left: "50%",
                    translate: "-50% -50%",
                    border: "1px solid black",
                    borderRadius: "100%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    height: "15px",
                    width: "2px",
                    backgroundColor: "black",
                    top: "50%",
                    left: "50%",
                    translate: "-50% -50%",
                    transform: "rotate(45deg)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    height: "15px",
                    width: "2px",
                    backgroundColor: "black",
                    top: "50%",
                    left: "50%",
                    translate: "-50% -50%",
                    transform: "rotate(-45deg)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PenColorSet;
