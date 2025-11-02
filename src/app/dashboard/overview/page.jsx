"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ use the global dataset context

export default function OverviewPage() {
  const { data, columns, loading } = useData(); // ✅ replaces all CSV logic

  const trimText = (text, limit = 40) =>
    !text ? "" : text.length > limit ? text.slice(0, limit) + "..." : text;

  const { datasetInfo, columnTypes, stats } = useMemo(() => {
    if (loading || data.length === 0) {
      return {
        datasetInfo: { rows: 0, cols: 0 },
        columnTypes: {},
        stats: {},
      };
    }

    const rows = data.length;
    const cols = columns.length;

    const columnTypes = {};
    columns.forEach((col) => {
      const sample = data.find(
        (r) => r[col] !== null && r[col] !== undefined
      )?.[col];
      if (typeof sample === "number") {
        columnTypes[col] = Number.isInteger(sample) ? "int64" : "float64";
      } else if (typeof sample === "boolean") {
        columnTypes[col] = "bool";
      } else if (
        typeof sample === "string" &&
        !isNaN(Date.parse(sample)) &&
        sample.match(/\d{4}-\d{2}-\d{2}|[A-Za-z]{3} \d{1,2}, \d{4}/)
      ) {
        columnTypes[col] = "datetime";
      } else {
        columnTypes[col] = "object";
      }
    });

    const stats = {
      totalGames: rows,
      uniqueDevelopers: new Set(data.map((r) => r.Developers)).size,
      uniquePublishers: new Set(data.map((r) => r.Publishers)).size,
      freeGames: data.filter((r) => r.Price === 0).length,
    };

    return { datasetInfo: { rows, cols }, columnTypes, stats };
  }, [data, columns, loading]);

  return (
    <div className="p-8 space-y-12 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Dataset Overview
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : (
        <>
          {/* Dataset Summary */}
          <div className="text-gray-300 mb-6 space-y-1">
            <p>
              <strong>Shape:</strong> {datasetInfo.rows} rows ×{" "}
              {datasetInfo.cols} columns
            </p>
            <p>Total games: {stats.totalGames}</p>
            <p>Unique developers: {stats.uniqueDevelopers}</p>
            <p>Unique publishers: {stats.uniquePublishers}</p>
            <p>Free games: {stats.freeGames}</p>
          </div>

          {/* Table Preview */}
          <div className="relative overflow-x-auto border border-gray-700 rounded-lg shadow-inner mb-6">
            <table className="min-w-full text-sm text-gray-300 table-fixed border-collapse">
              <thead className="bg-gray-800 text-blue-400 border-b border-gray-700 sticky top-0">
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 border-r border-gray-700 text-left font-mono whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, i) => (
                  <tr
                    key={i}
                    className={
                      i % 2 === 0
                        ? "bg-gray-900"
                        : "bg-gray-800 hover:bg-gray-700"
                    }
                  >
                    {columns.map((col, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 border-r border-gray-800 align-top truncate max-w-[220px]"
                        title={String(row[col])}
                      >
                        {trimText(String(row[col]))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Columns and Data Types */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Columns and Datatypes
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2 px-3">Column</th>
                  <th className="text-left py-2 px-3">Datatype</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(columnTypes).map(([col, type], i) => (
                  <tr
                    key={i}
                    className={
                      i % 2 === 0
                        ? "bg-gray-900"
                        : "bg-gray-800 hover:bg-gray-700"
                    }
                  >
                    <td className="py-2 px-3 border-r border-gray-800">
                      {col}
                    </td>
                    <td className="py-2 px-3 text-gray-400">{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
