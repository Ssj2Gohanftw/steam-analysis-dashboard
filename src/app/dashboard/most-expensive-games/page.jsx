"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ shared dataset context
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

export default function TopExpensiveGamesPage() {
  const { data, columns, loading } = useData();

  // 💰 Compute Top 20 Most Expensive Games
  const topExpensive = useMemo(() => {
    if (!data || data.length === 0 || !columns.includes("Price")) return [];

    return [...data]
      .filter(
        (row) =>
          typeof row["Price"] === "number" &&
          row["Price"] > 0 &&
          (row["Name"] || row["GameName"])
      )
      .sort((a, b) => b["Price"] - a["Price"])
      .slice(0, 20)
      .map((row) => ({
        name: row["Name"] || row["GameName"] || "Unknown",
        price: row["Price"],
      }));
  }, [data, columns]);

  // 📊 Chart Data
  const chartData = useMemo(() => {
    if (!topExpensive.length) return null;

    return {
      labels: topExpensive.map((g) => g.name),
      datasets: [
        {
          label: "Price ($)",
          data: topExpensive.map((g) => g.price),
          backgroundColor: "rgba(255,99,132,0.7)", // reddish "flare" palette
          borderRadius: 6,
        },
      ],
    };
  }, [topExpensive]);

  // ⚙️ Chart Options
  const options = {
    indexAxis: "y",
    plugins: {
      title: {
        display: true,
        text: "Top 20 Most Expensive Games on Steam",
        color: "#fff",
        font: { size: 18 },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        title: {
          display: true,
          text: "Price ($)",
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
        💰 Top 20 Most Expensive Games
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : chartData ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">
          ⚠️ “Price” column missing or insufficient data.
        </p>
      )}
    </div>
  );
}
