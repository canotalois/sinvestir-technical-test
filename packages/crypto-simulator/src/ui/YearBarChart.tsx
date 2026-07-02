"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { color, rgb, withAlpha } from "@sinvestir/tokens";
import { summarizeByYear } from "../core/yearly";
import { formatEur } from "./format";
import type { SeriesPoint } from "../core/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/** Per-year stacked bars: invested (blue) + gain/loss (gold/red) → final value. */
export function YearBarChart({ series }: { series: readonly SeriesPoint[] }) {
  const { data, options } = useMemo(() => {
    const rows = summarizeByYear(series);
    const gains = rows.map((r) => r.value - r.invested);

    const chartData: ChartData<"bar"> = {
      labels: rows.map((r) => String(r.year)),
      datasets: [
        {
          label: "Investi",
          data: rows.map((r) => r.invested),
          backgroundColor: color.primary,
          stack: "capital",
          borderRadius: 4,
        },
        {
          label: "Plus-value",
          data: gains,
          backgroundColor: gains.map((g) =>
            g >= 0 ? color.gold : color.negative,
          ),
          stack: "capital",
          borderRadius: 4,
        },
      ],
    };

    const chartOptions: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: color.textMuted },
        },
        y: {
          stacked: true,
          grid: { color: withAlpha(rgb.border, 0.08) },
          ticks: {
            color: color.textMuted,
            callback: (v) => `${Math.round(Number(v) / 1000)} k€`,
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: color.text, usePointStyle: true, boxHeight: 6 },
        },
        tooltip: {
          callbacks: {
            label: (item) =>
              `${item.dataset.label}: ${formatEur(Number(item.parsed.y))}`,
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [series]);

  return (
    <div className="relative h-[280px] min-[860px]:h-[360px]">
      <Bar data={data} options={options} />
    </div>
  );
}
