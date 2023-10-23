import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { EventEmitter } from "../utils/eventEmitter";

type Query = {
  data: { name: string }[];
  status: "loading" | "success" | "error";
  errorMsg: string;
};

type Queries = {
  [queryKey: string]: Query;
};

type QueryCache = {
  queriesRef: MutableRefObject<Queries>;
  queryEventEmitter: EventEmitter;
};

export const QueryCacheContext = createContext<QueryCache | undefined>(
  undefined
);

export const QueryCacheProvider = ({ children }: PropsWithChildren) => {
  const [queryEventEmitter] = useState(new EventEmitter());

  const queriesRef = useRef<Queries>({});

  return (
    <QueryCacheContext.Provider
      value={{ queriesRef: queriesRef, queryEventEmitter }}
    >
      {children}
    </QueryCacheContext.Provider>
  );
};
