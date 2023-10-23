import { useEffect, useState } from "react";
import axios from "axios";

const getPokemonData = async () => {
  const res = await axios.get<{ results: { name: string }[] }>(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  return res.data.results;
};

export const useQuery = () => {
  const [data, setData] = useState<{ name: string }[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");

        const data = await getPokemonData();

        setData(data);
        setErrorMsg("");
        setStatus("success");
      } catch (error) {
        setErrorMsg("Internal Error");
        setStatus("error");
      }
    };

    fetchData();
  }, []);

  return { data, status, errorMsg };
};
