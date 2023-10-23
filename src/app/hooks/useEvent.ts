"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

type EventHandler = (...args: never[]) => unknown;

export const useEvent = <T extends EventHandler>(handler: T): T => {
  const handlerRef = useRef<T>(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Parameters<T>) => {
    const fn = handlerRef.current;
    return fn(...args);
  }, []) as T;
};
