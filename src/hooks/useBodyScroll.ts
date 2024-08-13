import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { RefObject, useCallback, useRef } from "react";

import { useScrollBarWidth } from "./useScrollBarWidth";

export const useBodyScroll = <T = HTMLElement | Element>(): [
  RefObject<T>,
  () => void,
  () => void,
] => {
  const width = useScrollBarWidth();

  const ref = useRef<T>(null);

  const lockScroll = useCallback(() => {
    if (ref.current) {
      disableBodyScroll(ref.current as any);
    }

    if (typeof document === "object") {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = (width || 0) + "px";
    }
  }, [width]);

  const unlockScroll = useCallback(() => {
    if (ref.current) {
      enableBodyScroll(ref.current as any);

      if (typeof document === "object") {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    }
  }, []);

  return [ref, lockScroll, unlockScroll];
};
