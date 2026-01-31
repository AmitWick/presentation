import { useEffect, useRef } from "react";

type Hotkey = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  func: (e: KeyboardEvent) => void;
};

const useHotkeys = () => {
  const keyAndFuncRef = useRef<Hotkey[]>([]);

  const registerHotkey = (hotkey: Hotkey) => {
    keyAndFuncRef.current = [
      ...keyAndFuncRef.current.filter((h) => h.key !== hotkey.key),
      hotkey,
    ];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const match = keyAndFuncRef.current.find(
        (h) => h.key.toLowerCase() === key,
      );

      if (match) {
        e.preventDefault();
        match.func(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { registerHotkey };
};

export default useHotkeys;
