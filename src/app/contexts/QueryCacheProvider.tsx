import {
  createContext,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";

type Query = {
  data: { name: string }[];
  status: "loading" | "success" | "error";
  errorMsg: string;
};

type Queries = {
  [queryKey: string]: Query;
};

type QueriesFetching = {
  [queryKey: string]: boolean;
};

type QueryCache = {
  queries: Queries;
  fetch: (
    queryKey: string,
    queryFn: () => Promise<{ name: string }[]>
  ) => Promise<void>;
};

export const QueryCacheContext = createContext<QueryCache | undefined>(
  undefined
);

export const QueryCacheProvider = ({ children }: PropsWithChildren) => {
  const [queries, setQueries] = useState<Queries>({});

  const queriesFetchingRef = useRef<QueriesFetching>({});

  const fetch = useCallback(
    async (queryKey: string, queryFn: () => Promise<{ name: string }[]>) => {
      const isFetching = queriesFetchingRef.current[queryKey];

      if (!isFetching) {
        queriesFetchingRef.current[queryKey] = true;

        setQueries((prevCache) => ({
          ...prevCache,
          [queryKey]: {
            data: [],
            status: "loading",
            errorMsg: "",
          },
        }));

        try {
          const data = await queryFn();

          setQueries((prevCache) => ({
            ...prevCache,
            [queryKey]: {
              data,
              status: "success",
              errorMsg: "",
            },
          }));
        } catch (error) {
          setQueries((prevCache) => ({
            ...prevCache,
            [queryKey]: {
              data: [],
              status: "error",
              errorMsg: "Internal Error",
            },
          }));
        } finally {
          queriesFetchingRef.current[queryKey] = false;
        }
      }
    },
    []
  );

  return (
    <QueryCacheContext.Provider value={{ queries, fetch }}>
      {children}
    </QueryCacheContext.Provider>
  );
};
