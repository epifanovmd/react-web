import { useEffect, useRef } from "react";

export const useOutsideClick = (
  callback: (event: MouseEvent | TouchEvent, ref?: HTMLElement) => void,
) => {
  const ref = useRef<HTMLDivElement>(null);

  const listener = (e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref?.current.contains(e.target as any)) {
      callback(e, ref.current);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  });

  return ref;
};
