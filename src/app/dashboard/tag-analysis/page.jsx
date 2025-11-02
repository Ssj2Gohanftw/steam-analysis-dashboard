"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ shared context from your project
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TagAnalysisPage() {
  const { data, columns, loading } = useData();

  // ✅ Compute Top 15 Most Common Tags
  const topTags = useMemo(() => {
    if (!data || data.length === 0 || !columns.includes("Tags")) return [];

    const tagCounts = {};
    data.forEach((row) => {
      const tags = row.Tags;
      if (tags && typeof tags === "string") {
        tags.split(",").forEach((t) => {
          const tag = t.trim();
          if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  }, [data, columns]);

  // ✅ Chart Data
  const tagChartData = useMemo(() => {
    if (!topTags.length) return null;
    return {
      labels: topTags.map(([tag]) => tag),
      datasets: [
        {
          label: "Number of Games",
          data: topTags.map(([, count]) => count),
          backgroundColor: "rgba(201, 90, 255, 0.7)", // Cubehelix-inspired purple
        },
      ],
    };
  }, [topTags]);

  const options = {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top 15 Most Common Game Tags on Steam",
        color: "#fff",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        title: {
          display: true,
          text: "Number of Games",
          color: "#ccc",
        },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
      },
    },
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        🏷️ Tag Analysis
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : tagChartData ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <Bar data={tagChartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">
          ⚠️ No tag data available in this dataset.
        </p>
      )}
    </div>
  );
}
