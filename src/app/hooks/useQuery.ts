import { useContext, useEffect } from "react";
import { QueryCacheContext } from "../contexts/QueryCacheProvider";

export const useQuery = () => {
  const queryCache = useContext(QueryCacheContext);

  if (!queryCache) {
    throw new Error("No QueryCache set, use QueryCacheProvider to set one");
  }

  const { data, status, errorMsg, refetch } = queryCache;

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, status, errorMsg, refetch };
};
