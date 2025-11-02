"use client";
import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ use global dataset
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function UserScoreVsPricePage() {
  const { data, loading } = useData(); // ✅ get dataset & loading state from context

  // 🧮 Filter and prepare clean numeric data
  const chartData = useMemo(() => {
    if (loading || !data || data.length === 0) return [];

    return data
      .filter(
        (r) =>
          typeof r.Price === "number" &&
          typeof r["User score"] === "number" &&
          !isNaN(r.Price) &&
          !isNaN(r["User score"]) &&
          r.Price <= 200 // clip extreme outliers
      )
      .map((r) => ({
        price: r.Price,
        score: r["User score"],
      }));
  }, [data, loading]);

  return (
    <div className="p-8 space-y-12 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        User Score vs Price
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading chart...</span>
        </div>
      ) : chartData.length > 0 ? (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <Plot
            data={[
              {
                x: chartData.map((r) => r.price),
                y: chartData.map((r) => r.score),
                mode: "markers",
                type: "scatter",
                marker: {
                  color: "#3B82F6",
                  opacity: 0.6,
                  size: 6,
                },
              },
            ]}
            layout={{
              title: {
                text: "Relationship Between Price and User Score",
                font: { color: "#E5E7EB", size: 18 },
              },
              xaxis: {
                title: "Price ($)",
                gridcolor: "#1F2937",
                zeroline: false,
              },
              yaxis: {
                title: "User Score",
                gridcolor: "#1F2937",
                zeroline: false,
              },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "#E5E7EB" },
              height: 500,
              margin: { t: 30, l: 60, r: 30, b: 60 },
            }}
            config={{ displayModeBar: false, responsive: true }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <p className="text-gray-400">
          No valid numeric data found for Price and User score.
        </p>
      )}
    </div>
  );
}
