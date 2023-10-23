"use client";

import { useListPokemon } from "../hooks/useListPokemon";

export default function Stats() {
  const { data } = useListPokemon();

  return (
    <div>
      Total: <b>{data.length}</b>
    </div>
  );
}
