"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataProvider } from "@/contexts/data";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const isActive = (href) =>
    pathname === href
      ? "text-blue-400 font-semibold"
      : "text-gray-300 hover:text-blue-400 transition";

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black p-6 flex flex-col fixed h-full border-r border-gray-800 overflow-y-auto">
        <h1 className="text-xl font-bold mb-6 text-blue-400">
          Steam Dashboard
        </h1>

        <nav className="flex flex-col gap-3">
          <Link
            href="/dashboard/overview"
            className={isActive("/dashboard/overview")}
          >
            Overview
          </Link>
          <Link
            href="/dashboard/platform-distribution"
            className={isActive("/dashboard/platform-distribution")}
          >
            Platform Distribution
          </Link>
          <Link
            href="/dashboard/user-score-vs-price"
            className={isActive("/dashboard/user-score-vs-price")}
          >
            User Score vs Price
          </Link>
          <Link
            href="/dashboard/correlation-heatmap"
            className={isActive("/dashboard/correlation-heatmap")}
          >
            Correlation Heatmap
          </Link>
          <Link
            href="/dashboard/top-devs-publishers"
            className={isActive("/dashboard/top-devs-publishers")}
          >
            Top Devs & Publishers
          </Link>
          <Link
            href="/dashboard/top-genres"
            className={isActive("/dashboard/top-genres")}
          >
            Top Genres
          </Link>
          <Link
            href="/dashboard/average-playtime"
            className={isActive("/dashboard/average-playtime")}
          >
            Average Playtime
          </Link>
          <Link
            href="/dashboard/games-review"
            className={isActive("/dashboard/games-review")}
          >
            Games Review
          </Link>
          <Link
            href="/dashboard/tag-analysis"
            className={isActive("/dashboard/tag-analysis")}
          >
            Tag Analysis
          </Link>
          <Link
            href="/dashboard/top-played-games"
            className={isActive("/dashboard/top-played-games")}
          >
            Top Played Games
          </Link>
          <Link
            href="/dashboard/most-expensive-games"
            className={isActive("/dashboard/most-expensive-games")}
          >
            Most Expensive Games
          </Link>
          <Link
            href="/dashboard/category-analysis"
            className={isActive("/dashboard/category-analysis")}
          >
            Category Analysis
          </Link>
          <Link
            href="/dashboard/achievements-analysis"
            className={isActive("/dashboard/achievements-analysis")}
          >
            Achievements Analysis
          </Link>
          <Link
            href="/dashboard/multiplayer-vs-singleplayer"
            className={isActive("/dashboard/multiplayer-vs-singleplayer")}
          >
            Multiplayer vs Singleplayer
          </Link>
          <Link
            href="/dashboard/playtime-vs-recommendations"
            className={isActive("/dashboard/playtime-vs-recommendations")}
          >
            Playtime vs Recommendations
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth">
        <DataProvider>{children}</DataProvider>
      </main>
    </div>
  );
}
