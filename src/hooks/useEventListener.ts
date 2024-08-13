import { useEffect, useRef } from "react";

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = any,
>(
  type: K,
  listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  const ref = useRef<T>();

  useEffect(() => {
    const current = ref.current;

    current?.addEventListener(type, listener as any, options);

    return () => {
      current?.removeEventListener(type, listener as any, options);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, options]);

  return ref;
}
