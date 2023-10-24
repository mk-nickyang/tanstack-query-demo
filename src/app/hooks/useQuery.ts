import { useCallback, useContext, useEffect, useReducer, useRef } from "react";

import { QueryCacheContext } from "../contexts/QueryCacheProvider";
import { useEvent } from "./useEvent";
import type { Query } from "../types";

type QueryOptions = {
  queryKey: string;
  queryFn: () => Promise<{ name: string }[]>;
  refetchInterval?: number;
};

export const useQuery = (options: QueryOptions) => {
  const { queryKey, queryFn, refetchInterval } = options;

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

  const updateQueryResult = useCallback(
    (newResult: Query) => {
      queriesRef.current[queryKey] = newResult;
      queryEventEmitter.emit(queryKey);
    },
    [queriesRef, queryEventEmitter, queryKey]
  );

  const fetch = useCallback(async () => {
    if (!queriesRef.current[queryKey]?.isFetching) {
      if (queriesRef.current[queryKey]) {
        updateQueryResult({
          ...queriesRef.current[queryKey],
          isFetching: true,
        });
      } else {
        updateQueryResult({
          data: [],
          status: "loading",
          isFetching: true,
          errorMsg: "",
        });
      }

      try {
        const data = await stableQueryFn();
        updateQueryResult({
          data,
          status: "success",
          isFetching: false,
          errorMsg: "",
        });
      } catch (error) {
        updateQueryResult({
          data: [],
          status: "error",
          isFetching: false,
          errorMsg: "Internal Error",
        });
      }
    }
  }, [queriesRef, queryKey, stableQueryFn, updateQueryResult]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (refetchInterval) {
      timeout = setInterval(fetch, refetchInterval);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [fetch, refetchInterval]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const query = queriesRef.current[queryKey] || {
    data: [],
    status: "loading",
    isFetching: true,
    errorMsg: "",
  };

  return query;
};
