import { useEffect, useRef } from "react";

export const useRenderCheck = (tag?: string) => {
  const count = useRef(1);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    // eslint-disable-next-line no-console
    console.log(tag ?? "", "RENDERED:", count.current++);
  });
};
