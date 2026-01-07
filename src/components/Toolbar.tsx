type ToolbarProps = {
  tool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
};

export default function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <button onClick={() => setTool("pen")}>✏ Pen</button>
      <button onClick={() => setTool("eraser")}>🧽 Eraser</button>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="range"
        min="1"
        max="20"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      <button onClick={() => document.documentElement.requestFullscreen()}>
        ⛶ Fullscreen
      </button>
    </div>
  );
}
