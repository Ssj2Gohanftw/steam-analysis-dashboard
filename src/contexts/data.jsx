"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Papa from "papaparse";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/games.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const validRows = results.data.filter(
          (row) => row && Object.keys(row).length > 1
        );
        setData(validRows);
        setColumns(Object.keys(validRows[0] || {}));
        setLoading(false);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        setLoading(false);
      },
    });
  }, []);

  return (
    <DataContext.Provider value={{ data, columns, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
