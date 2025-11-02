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

export default function TopCategoriesPage() {
  const { data, columns, loading } = useData();

  // 🎯 Compute top 15 categories
  const topCategories = useMemo(() => {
    if (!data || data.length === 0 || !columns.includes("Categories"))
      return [];

    const categoryCounts = {};

    data.forEach((row) => {
      const cats = row["Categories"];
      if (typeof cats === "string") {
        cats
          .split(",")
          .map((c) => c.trim())
          .forEach((c) => {
            if (c) categoryCounts[c] = (categoryCounts[c] || 0) + 1;
          });
      }
    });

    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => ({ name, count }));
  }, [data, columns]);

  const chartData = useMemo(() => {
    if (topCategories.length === 0) return null;

    return {
      labels: topCategories.map((c) => c.name),
      datasets: [
        {
          label: "Number of Games",
          data: topCategories.map((c) => c.count),
          backgroundColor: "rgba(16, 185, 129, 0.8)", // teal tone
          borderRadius: 6,
        },
      ],
    };
  }, [topCategories]);

  const options = {
    indexAxis: "y",
    plugins: {
      title: {
        display: true,
        text: "Top 15 Game Categories on Steam",
        color: "#fff",
        font: { size: 18 },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        title: { display: true, text: "Count", color: "#ccc" },
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
        🧩 Breakdown of Categories
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : chartData ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">
          ⚠️ Column “Categories” missing or insufficient data.
        </p>
      )}
    </div>
  );
}
