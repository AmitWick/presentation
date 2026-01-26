const Hotkeys = () => {
  return (
    <section>
      <p>HotKeys</p>
      <div>
        <label htmlFor="fullScreenImage" style={{ marginRight: "5px" }}>
          Full Screen (Image) :{" "}
        </label>
        <input
          type="text"
          id="fullScreenImage"
          name="fullScreenImage"
          style={{ border: "1px solid black", borderRadius: "2px" }}
        />
      </div>
    </section>
  );
};

export default Hotkeys;
