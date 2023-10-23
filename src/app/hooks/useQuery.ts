import { useContext, useEffect } from "react";

import { QueryCacheContext } from "../contexts/QueryCacheProvider";
import { useEvent } from "./useEvent";

export const useQuery = (
  queryKey: string,
  queryFn: () => Promise<{ name: string }[]>
) => {
  const queryCache = useContext(QueryCacheContext);

  if (!queryCache) {
    throw new Error("No QueryCache set, use QueryCacheProvider to set one");
  }

  const { queries, fetch } = queryCache;

  const stableQueryFn = useEvent(queryFn);

  useEffect(() => {
    fetch(queryKey, stableQueryFn);
  }, [fetch, queryKey, stableQueryFn]);

  const query = queries[queryKey] || {
    data: [],
    status: "loading",
    errorMsg: "",
  };

  return query;
};
