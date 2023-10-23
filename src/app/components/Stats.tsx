"use client";

import { useQuery } from "../hooks/useQuery";

export default function Stats() {
  const { data } = useQuery();

  return (
    <div>
      Total: <b>{data.length}</b>
    </div>
  );
}
