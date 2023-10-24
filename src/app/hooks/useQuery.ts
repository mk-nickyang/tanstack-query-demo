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

  const trackedProps = useRef(new Set<string>());

  const stableQueryFn = useEvent(queryFn);

  useEffect(() => {
    queryEventEmitter.addListener(queryKey, forceRender);
    return () => {
      queryEventEmitter.removeListener(queryKey);
    };
  }, [queryKey, queryEventEmitter]);

  const updateQueryResult = useCallback(
    (newResult: Query) => {
      const trackedResult = {} as Query;

      Object.keys(newResult).forEach((resultKey) => {
        Object.defineProperty(trackedResult, resultKey, {
          configurable: false,
          enumerable: true,
          get: () => {
            if (!resultKey.startsWith("private_")) {
              trackedProps.current.add(resultKey);
            }
            // @ts-ignore
            return newResult[resultKey];
          },
        });
      });

      const prevResult = queriesRef.current[queryKey];

      queriesRef.current[queryKey] = trackedResult;

      let shouldRender = trackedProps.current.size === 0;

      trackedProps.current.forEach((trackedProp) => {
        if (
          !shouldRender &&
          // @ts-ignore
          prevResult[trackedProp] !== newResult[trackedProp]
        ) {
          shouldRender = true;
        }
      });

      if (shouldRender) {
        queryEventEmitter.emit(queryKey);
      }
    },
    [queriesRef, queryEventEmitter, queryKey]
  );

  const fetch = useCallback(async () => {
    if (!queriesRef.current[queryKey]?.private_isFetching) {
      if (queriesRef.current[queryKey]) {
        updateQueryResult({
          data: queriesRef.current[queryKey].data,
          status: queriesRef.current[queryKey].status,
          isFetching: true,
          private_isFetching: true,
          errorMsg: "",
        });
      } else {
        updateQueryResult({
          data: [],
          status: "loading",
          isFetching: true,
          private_isFetching: true,
          errorMsg: "",
        });
      }

      try {
        const data = await stableQueryFn();
        updateQueryResult({
          data,
          status: "success",
          isFetching: false,
          private_isFetching: false,
          errorMsg: "",
        });
      } catch (error) {
        updateQueryResult({
          data: [],
          status: "error",
          isFetching: false,
          private_isFetching: false,
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
