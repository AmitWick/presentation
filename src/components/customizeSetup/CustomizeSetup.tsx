import React, { useState } from "react";
import InitialColor from "./InitialColor";
import PenColorSet from "./PenColorSet";
import PenSize from "./PenSize";
import Hotkeys from "./Hotkeys";

const options: OptionType[] = [
  "Initial Color",
  "Pen Color Set",
  "Size",
  "Hotkeys",
  "Toggle Options",
];

type OptionType =
  | "Initial Color"
  | "Pen Color Set"
  | "Size"
  | "Hotkeys"
  | "Toggle Options";

type Props = {
  setOpenOptionComponent: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomizeSetup = ({ setOpenOptionComponent }: Props) => {
  const [activeOption, setActiveOption] = useState<OptionType>("Initial Color");

  return (
    <section
      style={{
        position: "fixed",
        top: "100px",
        left: "50%",
        width: "50vw",
        maxHeight: "500px",
        backgroundColor: "#fff",
        color: "#000",
        transform: "translateX(-50%)",
        zIndex: 100,
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
      }}
    >
      <aside
        style={{
          flex: "0 0 150px",
          borderRight: "1px solid #ccc",
        }}
      >
        {options.map((option, index) => (
          <p
            key={index}
            style={{
              padding: "20px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              margin: 0,
              textAlign: "center",
              fontWeight: activeOption === option ? "bold" : "normal",
            }}
            onClick={() => setActiveOption(option)}
          >
            {option}
          </p>
        ))}
      </aside>
      <div style={{ flex: "1 1 auto", overflowY: "auto" }}>
        {activeOption === "Initial Color" && <InitialColor />}
        {activeOption === "Pen Color Set" && <PenColorSet />}
        {activeOption === "Size" && <PenSize />}
        {activeOption === "Hotkeys" && <Hotkeys />}
      </div>
      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          width: "30px",
          height: "30px",
          border: "1px solid black",
          borderRadius: "100%",
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={() => setOpenOptionComponent(false)}
      >
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
        <div />
      </div>
    </section>
  );
};

export default CustomizeSetup;
