"use client";

import { useQuery } from "../hooks/useQuery";

export default function List() {
  const { data, status, errorMsg } = useQuery();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "error") return <p>Error: {errorMsg}</p>;

  return (
    <ol className="list-decimal">
      {data.map((item) => (
        <li key={item.name} className="capitalize">
          {item.name}
        </li>
      ))}
    </ol>
  );
}
