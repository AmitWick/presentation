import { useLayoutEffect } from "react";

const useCanvasSize = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement!;
      const rect = parent.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    return () => ro.disconnect();
  }, []);
};

export default useCanvasSize;
