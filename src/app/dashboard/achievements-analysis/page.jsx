"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data"; // ✅ Shared global dataset context
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

export default function AchievementImpactPage() {
  const { data, columns, loading } = useData();

  // 🎯 Compute average playtime grouped by achievement ranges
  const groupedData = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      !columns.includes("Achievements") ||
      !columns.includes("Average playtime forever")
    )
      return [];

    const bins = [0, 10, 50, 100, 500, 1000, 5000];
    const labels = ["0-10", "11-50", "51-100", "101-500", "501-1000", "1000+"];

    // Initialize bins
    const binSums = new Array(labels.length).fill(0);
    const binCounts = new Array(labels.length).fill(0);

    data.forEach((row) => {
      const ach = Number(row["Achievements"]);
      const playtime = Number(row["Average playtime forever"]);
      if (isNaN(ach) || isNaN(playtime)) return;

      for (let i = 0; i < bins.length; i++) {
        if (ach <= bins[i]) {
          binSums[i] += playtime;
          binCounts[i]++;
          return;
        }
      }

      // If greater than last bin
      binSums[labels.length - 1] += playtime;
      binCounts[labels.length - 1]++;
    });

    return labels.map((label, i) => ({
      range: label,
      avgPlaytime: binCounts[i] ? binSums[i] / binCounts[i] : 0,
    }));
  }, [data, columns]);

  const chartData = useMemo(() => {
    if (groupedData.length === 0) return null;

    return {
      labels: groupedData.map((g) => g.range),
      datasets: [
        {
          label: "Average Playtime (minutes)",
          data: groupedData.map((g) => g.avgPlaytime),
          backgroundColor: "rgba(245, 85, 54, 0.8)", // magma-like orange tone
          borderRadius: 6,
        },
      ],
    };
  }, [groupedData]);

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Impact of Achievements on Average Playtime",
        color: "#fff",
        font: { size: 18 },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Avg Playtime: ${ctx.raw.toFixed(2)} mins`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
        title: {
          display: true,
          text: "Achievement Range",
          color: "#ccc",
        },
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

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        🏆 Impact of Achievements on Average Playtime
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : chartData ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">
          ⚠️ Columns “Achievements” and “Average playtime forever” missing or
          insufficient data.
        </p>
      )}
    </div>
  );
}
