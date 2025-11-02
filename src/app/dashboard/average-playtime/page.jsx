"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ shared context for dataset
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

export default function PlaytimeDistributionPage() {
  const { data, columns, loading } = useData(); // ✅ get from context

  // 🎯 Compute histogram data for playtime 0–500 mins
  const chartData = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      !columns.includes("Average playtime forever")
    )
      return null;

    const playtimes = data
      .map((r) => r["Average playtime forever"])
      .filter((v) => typeof v === "number" && v <= 500 && v >= 0);

    const binCount = 50;
    const maxVal = 500;
    const binSize = maxVal / binCount;
    const bins = Array(binCount).fill(0);

    playtimes.forEach((v) => {
      const idx = Math.min(Math.floor(v / binSize), binCount - 1);
      bins[idx]++;
    });

    const labels = Array.from(
      { length: binCount },
      (_, i) => `${Math.round(i * binSize)}–${Math.round((i + 1) * binSize)}`
    );

    return {
      labels,
      datasets: [
        {
          label: "Number of Games",
          data: bins,
          backgroundColor: "rgba(34,197,94,0.7)",
          borderRadius: 4,
        },
      ],
    };
  }, [data, columns]);

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Distribution of Average Playtime (Forever) — 0–500 mins",
        color: "#fff",
        font: { size: 18 },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#ccc", autoSkip: true, maxTicksLimit: 10 },
        grid: { color: "#333" },
        title: {
          display: true,
          text: "Average Playtime (minutes)",
          color: "#ccc",
        },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        title: { display: true, text: "Number of Games", color: "#ccc" },
      },
    },
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        🕹️ Distribution of Average Playtime (Forever)
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : chartData ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">
          ⚠️ “Average playtime forever” column missing or empty in dataset.
        </p>
      )}
    </div>
  );
}
