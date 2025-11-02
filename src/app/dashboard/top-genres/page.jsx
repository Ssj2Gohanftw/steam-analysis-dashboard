"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/data";
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

export default function TopGenresPage() {
  const { data, columns, loading } = useData();

  // ✅ 1️⃣ Compute Top 10 Most Common Genres
  const topGenres = useMemo(() => {
    if (!data || data.length === 0 || !columns.includes("Genres")) return [];

    const counts = {};
    data.forEach((row) => {
      const genres = row.Genres;
      if (genres && typeof genres === "string") {
        genres.split(",").forEach((g) => {
          const genre = g.trim();
          if (genre) counts[genre] = (counts[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [data, columns]);

  // ✅ Chart data for Top 10 Most Common Genres
  const genreChartData = useMemo(() => {
    if (!topGenres.length) return null;
    return {
      labels: topGenres.map(([genre]) => genre),
      datasets: [
        {
          label: "Number of Games",
          data: topGenres.map(([, count]) => count),
          backgroundColor: "rgba(115, 103, 240, 0.7)",
        },
      ],
    };
  }, [topGenres]);

  // ✅ 2️⃣ Compute Top 10 Genres by Average User Score
  const topGenreScores = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      !columns.includes("Genres") ||
      !columns.includes("User score")
    )
      return [];

    const genreScores = {};

    data.forEach((row) => {
      const genres = row.Genres;
      const score = parseFloat(row["User score"]);
      if (genres && !isNaN(score)) {
        genres.split(",").forEach((g) => {
          const genre = g.trim();
          if (!genreScores[genre]) genreScores[genre] = [];
          genreScores[genre].push(score);
        });
      }
    });

    // Average calculation
    const averages = Object.entries(genreScores).map(([genre, scores]) => [
      genre,
      scores.reduce((a, b) => a + b, 0) / scores.length,
    ]);

    return averages.sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [data, columns]);

  // ✅ Chart data for Top 10 Genres by Average User Score
  const genreScoreChartData = useMemo(() => {
    if (!topGenreScores.length) return null;
    return {
      labels: topGenreScores.map(([genre]) => genre),
      datasets: [
        {
          label: "Average User Score",
          data: topGenreScores.map(([, avg]) => avg),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };
  }, [topGenreScores]);

  return (
    <div className="p-8 space-y-16 text-white">
      {/* 🎮 Section 1: Most Common Genres */}
      <div>
        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
          🎮 Top 10 Most Common Game Genres on Steam
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading dataset...</span>
          </div>
        ) : genreChartData ? (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <Bar
              data={genreChartData}
              options={{
                indexAxis: "y",
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: "Top 10 Most Common Genres" },
                },
                scales: {
                  x: { grid: { color: "#444" } },
                  y: { grid: { color: "#444" } },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-400">
            ⚠️ No genre data available in this dataset.
          </p>
        )}
      </div>

      {/* ⭐ Section 2: Top Genres by Average User Score */}
      <div>
        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
          ⭐ Top 10 Genres by Average User Score
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading dataset...</span>
          </div>
        ) : genreScoreChartData ? (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <Bar
              data={genreScoreChartData}
              options={{
                indexAxis: "y",
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: "Top 10 Genres by Average User Score",
                  },
                },
                scales: {
                  x: { grid: { color: "#444" } },
                  y: { grid: { color: "#444" } },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-400">
            ⚠️ No genre or user score data available in this dataset.
          </p>
        )}
      </div>
    </div>
  );
}
