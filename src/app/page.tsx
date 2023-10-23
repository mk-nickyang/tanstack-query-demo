"use client";

import List from "./components/List";
import Header from "./components/Header";
import { QueryCacheProvider } from "./contexts/QueryCacheProvider";

export default function App() {
  return (
    <QueryCacheProvider>
      <main className="mx-16 my-8">
        <Header />
        <List />
      </main>
    </QueryCacheProvider>
  );
}
