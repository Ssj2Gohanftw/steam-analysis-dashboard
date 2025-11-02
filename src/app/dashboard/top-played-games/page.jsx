"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ shared context
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

export default function TopPlayedGamesPage() {
  const { data, columns, loading } = useData();

  // 🎮 Compute Top 10 Most Played Games
  const topPlayed = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      !columns.includes("Average playtime forever")
    )
      return [];

    return [...data]
      .filter((row) => typeof row["Average playtime forever"] === "number")
      .sort(
        (a, b) => b["Average playtime forever"] - a["Average playtime forever"]
      )
      .slice(0, 10)
      .map((row) => ({
        name: row["Name"] || row["GameName"] || "Unknown",
        playtime: row["Average playtime forever"],
      }));
  }, [data, columns]);

  // 📊 Chart Data
  const chartData = useMemo(() => {
    if (!topPlayed.length) return null;

    return {
      labels: topPlayed.map((g) => g.name),
      datasets: [
        {
          label: "Average Playtime (minutes)",
          data: topPlayed.map((g) => g.playtime),
          backgroundColor: "rgba(34,197,94,0.8)", // greenish viridis tone
          borderRadius: 6,
        },
      ],
    };
  }, [topPlayed]);

  // ⚙️ Chart Options
  const options = {
    indexAxis: "y",
    plugins: {
      title: {
        display: true,
        text: "Top 10 Most Played Games (Average Playtime)",
        color: "#fff",
        font: { size: 18 },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.toLocaleString()} minutes`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
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
        title: {
          display: true,
          text: "Game Name",
          color: "#ccc",
        },
      },
    },
  };

  // 🧭 Render
  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        ⏱️ Top 10 Most Played Games
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
          ⚠️ “Average playtime forever” column missing or insufficient data.
        </p>
      )}
    </div>
  );
}
