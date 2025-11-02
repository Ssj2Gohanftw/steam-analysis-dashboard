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

export default function TopDevsPublishersPage() {
  const { data, columns, loading } = useData();

  // Compute top 10 developers and publishers
  const { topDevelopers, topPublishers } = useMemo(() => {
    if (data.length === 0) return { topDevelopers: [], topPublishers: [] };

    const countItems = (key) => {
      const counts = {};
      data.forEach((row) => {
        const val = row[key];
        if (val && typeof val === "string") {
          // Handle multiple entries like "Valve; Hidden Path Entertainment"
          val.split(/[;,]/).forEach((item) => {
            const name = item.trim();
            if (name) counts[name] = (counts[name] || 0) + 1;
          });
        }
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    };

    const devKey = columns.includes("Developers")
      ? "Developers"
      : columns.includes("Developer")
      ? "Developer"
      : null;

    const pubKey = columns.includes("Publishers")
      ? "Publishers"
      : columns.includes("Publisher")
      ? "Publisher"
      : null;

    const topDevs = devKey ? countItems(devKey) : [];
    const topPubs = pubKey ? countItems(pubKey) : [];

    return { topDevelopers: topDevs, topPublishers: topPubs };
  }, [data, columns]);

  const devData = useMemo(() => {
    if (!topDevelopers.length) return null;
    return {
      labels: topDevelopers.map(([name]) => name),
      datasets: [
        {
          label: "Number of Games",
          data: topDevelopers.map(([, count]) => count),
          backgroundColor: "rgba(59,130,246,0.6)", // blue
        },
      ],
    };
  }, [topDevelopers]);

  const pubData = useMemo(() => {
    if (!topPublishers.length) return null;
    return {
      labels: topPublishers.map(([name]) => name),
      datasets: [
        {
          label: "Number of Games",
          data: topPublishers.map(([, count]) => count),
          backgroundColor: "rgba(16,185,129,0.6)", // green
        },
      ],
    };
  }, [topPublishers]);

  return (
    <div className="p-8 space-y-12 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        🏗️ Top 10 Developers and Publishers
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading dataset...</span>
        </div>
      ) : (
        <>
          {/* Developers */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Top 10 Developers by Number of Games
            </h3>
            {devData ? (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <Bar
                  data={devData}
                  options={{
                    indexAxis: "y",
                    plugins: {
                      legend: { display: false },
                      title: { display: true, text: "Top 10 Developers" },
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
                ⚠️ No developer data available in this dataset.
              </p>
            )}
          </section>

          {/* Publishers */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-green-400">
              Top 10 Publishers by Number of Games
            </h3>
            {pubData ? (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <Bar
                  data={pubData}
                  options={{
                    indexAxis: "y",
                    plugins: {
                      legend: { display: false },
                      title: { display: true, text: "Top 10 Publishers" },
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
                ⚠️ No publisher data available in this dataset.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
