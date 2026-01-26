import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = () => {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const clear = () => {
    sigRef.current?.clear();
  };

  const save = () => {
    if (sigRef.current?.isEmpty()) {
      alert("Please provide a signature first");
      return;
    }

    const dataURL = sigRef.current?.getTrimmedCanvas().toDataURL("image/png");

    console.log(dataURL);
  };

  return (
    <>
      <div
        style={{
          border: "2px dashed #ccc",
          width: 1000,
          height: 200,
        }}
      >
        <SignatureCanvas
          ref={sigRef}
          penColor="#c9c2c2ff"
          minWidth={2}
          maxWidth={2}
          velocityFilterWeight={0.7}
          dotSize={2}
          canvasProps={{ width: 1000, height: 200, className: "sigCanvas" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={clear}>Clear</button>
        <button onClick={save}>Save</button>
      </div>
    </>
  );
};

export default SignaturePad;
