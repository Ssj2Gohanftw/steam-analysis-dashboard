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

export default function TopPositiveNegativeGamesPage() {
  const { data, columns, loading } = useData(); // ✅ get from context

  // 🎯 Compute Top 10 Games by Positive Review Ratio
  const topPositive = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      !columns.includes("Positive") ||
      !columns.includes("Negative")
    )
      return [];

    const games = data
      .map((row) => {
        const positive = Number(row["Positive"]);
        const negative = Number(row["Negative"]);
        const name = row["Name"] || row["GameName"];

        if (isNaN(positive) || isNaN(negative) || !name) return null;

        const total = positive + negative;
        if (total === 0) return null;

        return {
          name,
          positiveRatio: positive / total,
          totalReviews: total,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.positiveRatio - a.positiveRatio)
      .slice(0, 10);

    return games;
  }, [data, columns]);

  // 🚫 Compute Top 10 Games with Most Negative Reviews
  const topNegative = useMemo(() => {
    if (!data || data.length === 0 || !columns.includes("Negative")) return [];

    return [...data]
      .filter((row) => !isNaN(Number(row["Negative"])))
      .sort((a, b) => Number(b["Negative"]) - Number(a["Negative"]))
      .slice(0, 10)
      .map((row) => ({
        name: row["Name"] || row["GameName"] || "Unknown",
        negative: Number(row["Negative"]),
      }));
  }, [data, columns]);

  // 📊 Chart Data: Positive Ratio
  const positiveChartData = useMemo(() => {
    if (!topPositive.length) return null;
    return {
      labels: topPositive.map((g) => g.name),
      datasets: [
        {
          label: "Positive Review Ratio",
          data: topPositive.map((g) => g.positiveRatio),
          backgroundColor: "rgba(139, 92, 246, 0.8)", // purple
          borderRadius: 6,
        },
      ],
    };
  }, [topPositive]);

  // 📊 Chart Data: Negative Reviews
  const negativeChartData = useMemo(() => {
    if (!topNegative.length) return null;
    return {
      labels: topNegative.map((g) => g.name),
      datasets: [
        {
          label: "Number of Negative Reviews",
          data: topNegative.map((g) => g.negative),
          backgroundColor: "rgba(239, 68, 68, 0.8)", // red tone
          borderRadius: 6,
        },
      ],
    };
  }, [topNegative]);

  // ⚙️ Shared Chart Options
  const baseOptions = {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#333" },
      },
    },
  };

  return (
    <div className="p-8 text-white space-y-16">
      {/* 🎮 Top 10 Positive Ratio */}
      <section>
        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
          🎮 Top 10 Games by Positive Review Ratio
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading dataset...</span>
          </div>
        ) : positiveChartData ? (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <Bar
              data={positiveChartData}
              options={{
                ...baseOptions,
                plugins: {
                  ...baseOptions.plugins,
                  title: {
                    display: true,
                    text: "Top 10 Games by Positive Review Ratio",
                    color: "#fff",
                    font: { size: 18 },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        `Positive Ratio: ${(ctx.raw * 100).toFixed(2)}%`,
                    },
                  },
                },
                scales: {
                  ...baseOptions.scales,
                  x: {
                    ...baseOptions.scales.x,
                    ticks: {
                      color: "#ccc",
                      callback: (val) => `${(val * 100).toFixed(0)}%`,
                    },
                    title: {
                      display: true,
                      text: "Positive Review Ratio",
                      color: "#ccc",
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-400">
            ⚠️ Columns “Positive” and “Negative” missing or insufficient data.
          </p>
        )}
      </section>

      {/* 🚫 Top 10 Negative Reviews */}
      <section>
        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
          🚫 Top 10 Games with Most Negative Reviews
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading dataset...</span>
          </div>
        ) : negativeChartData ? (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <Bar
              data={negativeChartData}
              options={{
                ...baseOptions,
                plugins: {
                  ...baseOptions.plugins,
                  title: {
                    display: true,
                    text: "Top 10 Games with Most Negative Reviews",
                    color: "#fff",
                    font: { size: 18 },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        `${ctx.raw.toLocaleString()} negative reviews`,
                    },
                  },
                },
                scales: {
                  ...baseOptions.scales,
                  x: {
                    ...baseOptions.scales.x,
                    title: {
                      display: true,
                      text: "Number of Negative Reviews",
                      color: "#ccc",
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-400">
            ⚠️ “Negative” column missing or insufficient data.
          </p>
        )}
      </section>
    </div>
  );
}
