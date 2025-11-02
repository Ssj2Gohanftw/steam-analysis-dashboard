"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ shared global dataset context
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

export default function MultiplayerAnalysisPage() {
  const { data, columns, loading } = useData();

  // 🎯 Compute average playtime for Multiplayer vs Singleplayer
  const playtimeData = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      !columns.includes("Categories") ||
      !columns.includes("Average playtime forever")
    )
      return null;

    let multiSum = 0,
      multiCount = 0,
      singleSum = 0,
      singleCount = 0;

    data.forEach((row) => {
      const categories = String(row["Categories"] || "").toLowerCase();
      const playtime = Number(row["Average playtime forever"]);
      if (isNaN(playtime)) return;

      if (categories.includes("multiplayer")) {
        multiSum += playtime;
        multiCount++;
      } else {
        singleSum += playtime;
        singleCount++;
      }
    });

    const avgMulti = multiCount ? multiSum / multiCount : 0;
    const avgSingle = singleCount ? singleSum / singleCount : 0;

    return [
      { label: "Multiplayer", value: avgMulti },
      { label: "Singleplayer", value: avgSingle },
    ];
  }, [data, columns]);

  // 📊 Chart Data
  const chartData = useMemo(() => {
    if (!playtimeData) return null;

    return {
      labels: playtimeData.map((item) => item.label),
      datasets: [
        {
          label: "Average Playtime (minutes)",
          data: playtimeData.map((item) => item.value),
          backgroundColor: ["rgba(59,130,246,0.8)", "rgba(236,72,153,0.8)"], // blue & pink
          borderRadius: 8,
        },
      ],
    };
  }, [playtimeData]);

  // ⚙️ Chart Options
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Average Playtime: Multiplayer vs Singleplayer",
        color: "#fff",
        font: { size: 18 },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.toFixed(2)} minutes`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        title: {
          display: true,
          text: "Average Playtime (minutes)",
          color: "#ccc",
        },
      },
    },
  };

  // 🧭 Render
  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        🎮 Multiplayer vs Singleplayer Analysis
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : chartData ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">
          ⚠️ Columns “Categories” and “Average playtime forever” missing or
          insufficient data.
        </p>
      )}
    </div>
  );
}
