"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data";

export default function CorrelationHeatmapPage() {
  const { data, columns, loading } = useData();

  const correlationData = useMemo(() => {
    if (loading || data.length === 0) return null;

    const numericCols = [
      "Peak CCU",
      "Price",
      "User score",
      "Positive",
      "Negative",
      "Recommendations",
      "Average playtime forever",
      "Average playtime two weeks",
      "Median playtime forever",
      "Median playtime two weeks",
      "Achievements",
    ];

    const availableCols = numericCols.filter((col) => columns.includes(col));
    if (availableCols.length < 2) return null;

    const corr = (x, y) => {
      const n = x.length;
      const meanX = x.reduce((a, b) => a + b, 0) / n;
      const meanY = y.reduce((a, b) => a + b, 0) / n;
      const numerator = x.reduce(
        (sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY),
        0
      );
      const denominator = Math.sqrt(
        x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
          y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
      );
      return denominator === 0 ? 0 : numerator / denominator;
    };

    const matrix = availableCols.map((colX) =>
      availableCols.map((colY) => {
        const x = data.map((r) => parseFloat(r[colX]) || 0);
        const y = data.map((r) => parseFloat(r[colY]) || 0);
        return corr(x, y);
      })
    );

    return { labels: availableCols, matrix };
  }, [data, columns, loading]);

  return (
    <div className="p-8 space-y-12 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        🔥 Correlation Heatmap of Key Numerical Features
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : correlationData === null ? (
        <p className="text-gray-400">
          ⚠️ Not enough numeric columns available to plot correlation heatmap.
        </p>
      ) : (
        <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-inner">
          <table className="min-w-full text-sm text-gray-300 border-collapse">
            <thead className="bg-gray-800 text-blue-400 border-b border-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 border-r border-gray-700"></th>
                {correlationData.labels.map((label) => (
                  <th
                    key={label}
                    className="px-4 py-2 border-r border-gray-700 text-center whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationData.labels.map((rowLabel, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-gray-900"
                      : "bg-gray-800 hover:bg-gray-700"
                  }
                >
                  <td className="px-4 py-2 border-r border-gray-800 text-blue-300 font-semibold whitespace-nowrap">
                    {rowLabel}
                  </td>
                  {correlationData.matrix[i].map((value, j) => {
                    const color =
                      value > 0.6
                        ? "bg-green-800/50"
                        : value < -0.6
                        ? "bg-red-800/50"
                        : "bg-gray-800";
                    return (
                      <td
                        key={j}
                        className={`px-4 py-2 border-r border-gray-800 text-center ${color}`}
                      >
                        {value.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
