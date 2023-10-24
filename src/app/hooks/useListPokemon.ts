import axios from "axios";

import { useQuery } from "./useQuery";

const getPokemonData = async () => {
  const res = await axios.get<{ results: { name: string }[] }>(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  return res.data.results;
};

export const useListPokemon = () => {
  return useQuery({
    queryKey: "pokemonList",
    queryFn: getPokemonData,
    refetchInterval: 3000,
  });
};
