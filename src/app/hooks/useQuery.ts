import { useContext, useEffect, useReducer, useState } from "react";

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

  const { queriesRef, queryEventEmitter } = queryCache;

  const [, forceRender] = useReducer((x) => x + 1, 0);

  const stableQueryFn = useEvent(queryFn);

  useEffect(() => {
    queryEventEmitter.addListener(queryKey, forceRender);
    return () => {
      queryEventEmitter.removeListener(queryKey);
    };
  }, [queryKey, queryEventEmitter]);

  useEffect(() => {
    const fetch = async () => {
      const isFetching = queriesRef.current[queryKey]?.status === "loading";

      if (!isFetching) {
        queriesRef.current[queryKey] = {
          data: [],
          status: "loading",
          errorMsg: "",
        };
        queryEventEmitter.emit(queryKey);

        try {
          const data = await stableQueryFn();
          queriesRef.current[queryKey] = {
            data,
            status: "success",
            errorMsg: "",
          };
        } catch (error) {
          queriesRef.current[queryKey] = {
            data: [],
            status: "error",
            errorMsg: "Internal Error",
          };
        } finally {
          queryEventEmitter.emit(queryKey);
        }
      }
    };

    fetch();
  }, [queriesRef, queryEventEmitter, queryKey, stableQueryFn]);

  const query = queriesRef.current[queryKey] || {
    data: [],
    status: "loading",
    errorMsg: "",
  };

  return query;
};
