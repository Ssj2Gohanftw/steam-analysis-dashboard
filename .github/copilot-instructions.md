# Steam Analysis Dashboard - AI Agent Guidelines

## Architecture Overview

This is a Next.js 16 dashboard application analyzing Steam game data. The app uses the App Router with a centralized data architecture:

- **Data Source**: Single CSV file (`games.csv`) loaded via Papa Parse in a React context provider
- **Routing**: App Router with `/dashboard/*` pages for different analyses
- **Layout**: Fixed sidebar navigation with main content area
- **Styling**: Tailwind CSS + shadcn/ui components with dark theme

## Key Patterns & Conventions

### Data Management

- **Centralized Loading**: All data loaded once in `src/contexts/data.jsx` using `DataProvider`
- **Consumption**: Use `useData()` hook to access `{ data, columns, loading }`
- **Processing**: Use `useMemo` for expensive computations on raw data
- **Boolean Conversion**: Platform columns need conversion: `toBool(val) => val === true || val === "True" || val === 1 || val === "1"`

### Visualization Components

- **Libraries**: Plotly (pie/bar charts), Chart.js (bar charts), Recharts (other charts)
- **SSR Handling**: Dynamic imports for chart components: `const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })`
- **Chart Registration**: Register Chart.js components before use
- **Styling**: Dark theme with `paper_bgcolor: "rgba(0,0,0,0)"` and custom colors

### Page Structure

- **Loading States**: Consistent spinner with "Loading..." text
- **Layout**: `p-8 space-y-12` container, `text-white` for content
- **Headers**: `text-3xl font-semibold mb-4 border-b border-gray-700 pb-2`
- **Cards**: `bg-gray-800 p-4 rounded-lg border border-gray-700`

### Data Processing Examples

```javascript
// Split comma-separated values (Genres, Tags)
genres.split(",").forEach((g) => {
  const genre = g.trim();
  if (genre) counts[genre] = (counts[genre] || 0) + 1;
});

// Filter and count patterns
const freeGames = data.filter((r) => r.Price === 0).length;
const uniqueDevs = new Set(data.map((r) => r.Developers)).size;
```

### Development Workflow

- **EDA First**: Start with `eda/eda.ipynb` for data exploration and understanding
- **Build Command**: `npm run build` (Next.js with React Compiler)
- **Data File**: Place `games.csv` in `public/` directory for loading
- **Package Manager**: Uses Bun (bun.lock present) but npm scripts work

### Component Patterns

- **Client Components**: Mark with `"use client"` for interactivity
- **Imports**: Use `@/` aliases for clean imports
- **Theme**: `next-themes` with system/dark/light support

### File Organization

- `src/app/dashboard/*/page.jsx` - Analysis pages
- `src/contexts/data.jsx` - Global data provider
- `src/components/` - Reusable UI components
- `eda/eda.ipynb` - Data exploration notebook

## Common Gotchas

- CSV loading is async - always check `loading` state
- Platform columns are boolean but may be stored as strings/numbers
- Some columns contain comma-separated values requiring splitting
- Charts need proper cleanup to avoid SSR issues
- Dark theme requires explicit color overrides in Plotly configs</content>
  <parameter name="filePath">c:\Users\ethan\steam-analysis-dashboard\.github\copilot-instructions.md
