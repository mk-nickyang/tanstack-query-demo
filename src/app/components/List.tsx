"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const getData = async () => {
  const res = await axios.get<{ results: { name: string }[] }>(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  return res.data.results;
};

export default function List() {
  const [data, setData] = useState<{ name: string }[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");

        const data = await getData();

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

  if (status === "loading") return <p>Loading...</p>;

  if (status === "error") return <p>Error: {errorMsg}</p>;

  return (
    <ol className="list-decimal">
      {data.map((item) => (
        <li key={item.name} className="capitalize">
          {item.name}
        </li>
      ))}
    </ol>
  );
}
