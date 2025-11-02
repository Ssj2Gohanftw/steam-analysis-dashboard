"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useData } from "@/contexts/data";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function PlatformDistributionPage() {
  const { data, loading } = useData();

  // 🧠 Compute platform support stats
  const platformCounts = useMemo(() => {
    if (loading || data.length === 0) return { windows: 0, mac: 0, linux: 0 };

    const toBool = (val) =>
      val === true || val === "True" || val === 1 || val === "1";

    return {
      windows: data.filter((r) => toBool(r.Windows)).length,
      mac: data.filter((r) => toBool(r.Mac)).length,
      linux: data.filter((r) => toBool(r.Linux)).length,
    };
  }, [data, loading]);

  return (
    <div className="p-8 space-y-12 text-white">
      <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Platform Support Distribution
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading chart...</span>
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <Plot
            data={[
              {
                type: "pie",
                labels: ["Windows", "Mac", "Linux"],
                values: [
                  platformCounts.windows,
                  platformCounts.mac,
                  platformCounts.linux,
                ],
                textinfo: "label+percent",
                marker: { colors: ["#3B82F6", "#10B981", "#F59E0B"] },
              },
            ]}
            layout={{
              title: {
                text: "Platform Support Distribution",
                font: { color: "#E5E7EB", size: 18 },
              },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "#E5E7EB" },
              height: 420,
              margin: { t: 30, b: 30 },
            }}
            config={{ displayModeBar: false, responsive: true }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {!loading && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300 space-y-2">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">
            Platform Summary
          </h3>
          <p>Windows: {platformCounts.windows.toLocaleString()} games</p>
          <p>Mac: {platformCounts.mac.toLocaleString()} games</p>
          <p>Linux: {platformCounts.linux.toLocaleString()} games</p>
        </div>
      )}
    </div>
  );
}
