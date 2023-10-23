import {
  createContext,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import axios from "axios";

const getPokemonData = async () => {
  const res = await axios.get<{ results: { name: string }[] }>(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  return res.data.results;
};

type QueryCache = {
  data: { name: string }[];
  status: "loading" | "success" | "error";
  errorMsg: string;
  refetch: () => void;
};

export const QueryCacheContext = createContext<QueryCache | undefined>(
  undefined
);

export const QueryCacheProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<{ name: string }[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isFetchingRef = useRef(false);

  const refetch = useCallback(async () => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;

      try {
        setStatus("loading");

        const data = await getPokemonData();

        setData(data);
        setErrorMsg("");
        setStatus("success");
      } catch (error) {
        setErrorMsg("Internal Error");
        setStatus("error");
      } finally {
        isFetchingRef.current = false;
      }
    }
  }, []);

  return (
    <QueryCacheContext.Provider value={{ data, status, errorMsg, refetch }}>
      {children}
    </QueryCacheContext.Provider>
  );
};
