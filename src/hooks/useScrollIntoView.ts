import type { MutableRefObject } from "react";
import { useCallback } from "react";

type TUseScrollIntoView = <T extends HTMLElement = HTMLElement>(
  ref: MutableRefObject<T | null>,
) => (options: ScrollIntoViewOptions) => void;

export const useScrollIntoView: TUseScrollIntoView = ref => {
  return useCallback(
    options => {
      ref?.current?.scrollIntoView(options);
    },
    [ref],
  );
};
