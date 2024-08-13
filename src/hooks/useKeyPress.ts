import { useEffect, useState } from "react";

export const useKeyPress = (targetKey: string, callback?: () => void) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  function downHandler({ key }: KeyboardEvent) {
    if (key === targetKey) {
      setKeyPressed(true);
      callback?.();
    }
  }

  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    if (typeof window === "object") {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }

    return () => {};
    // eslint-disable-next-line
  }, []);

  return keyPressed;
};
