"use client";

import { useListPokemon } from "../hooks/useListPokemon";

export default function List() {
  const { data, status, errorMsg } = useListPokemon();

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
