"use client";

import React from "react";
import Plot from "react-plotly.js";
import { useData } from "@/contexts/data";

export default function PlaytimeVsRecommendations() {
  const { data } = useData();

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }

  // Extract columns
  const playtime = data.map((d) => parseFloat(d["Average playtime forever"]));
  const recommendations = data.map((d) => parseFloat(d["Recommendations"]));

  // Filter valid values for log scale
  const valid = playtime
    .map((x, i) => ({ x, y: recommendations[i] }))
    .filter((p) => !isNaN(p.x) && !isNaN(p.y) && p.x > 0 && p.y > 0);

  return (
    <div className="p-4 rounded-2xl shadow">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Playtime vs Recommendations
      </h2>
      <Plot
        data={[
          {
            x: valid.map((p) => p.x),
            y: valid.map((p) => p.y),
            mode: "markers",
            type: "scatter",
            marker: { color: "darkcyan", opacity: 0.6 },
          },
        ]}
        layout={{
          title: "Playtime vs Recommendations",
          xaxis: {
            title: "Average Playtime (minutes, log scale)",
            type: "log",
          },
          yaxis: {
            title: "Recommendations (log scale)",
            type: "log",
          },
          hovermode: "closest",
          margin: { t: 40, l: 60, r: 20, b: 60 },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "480px" }}
      />
    </div>
  );
}
