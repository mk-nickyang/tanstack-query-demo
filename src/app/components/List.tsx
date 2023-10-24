"use client";

import { useListPokemon } from "../hooks/useListPokemon";
import { useRenderCheck } from "../hooks/useRenderCheck";

export default function List() {
  const { data, status, errorMsg } = useListPokemon();

  useRenderCheck("List");

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
