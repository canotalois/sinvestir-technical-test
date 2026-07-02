"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { color, rgb, withAlpha } from "@sinvestir/tokens";
import { formatEur, formatUnits } from "./format";
import type { SeriesPoint } from "../core/types";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
);

const MAX_POINTS = 400;

function downsample(series: readonly SeriesPoint[]): SeriesPoint[] {
  if (series.length <= MAX_POINTS) return [...series];
  const step = Math.ceil(series.length / MAX_POINTS);
  const out: SeriesPoint[] = [];
  for (let i = 0; i < series.length; i += step) {
    const point = series[i];
    if (point) out.push(point);
  }
  const last = series[series.length - 1];
  if (last && out[out.length - 1] !== last) out.push(last);
  return out;
}

/** Vertical fill gradient for an area dataset, from `rgbTriplet`. */
function areaFill(rgbTriplet: string) {
  return (ctx: ScriptableContext<"line">) => {
    const { ctx: canvas, chartArea } = ctx.chart;
    if (!chartArea) return "transparent";
    const gradient = canvas.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, withAlpha(rgbTriplet, 0.45));
    gradient.addColorStop(1, withAlpha(rgbTriplet, 0.02));
    return gradient;
  };
}

interface HistoryChartProps {
  readonly series: readonly SeriesPoint[];
  readonly symbol: string;
  /** "line" = multi-line detail; "area" = filled Valeur vs Investi. */
  readonly variant?: "line" | "area";
}

export function HistoryChart({
  series,
  symbol,
  variant = "line",
}: HistoryChartProps) {
  const isArea = variant === "area";
  const data = useMemo<ChartData<"line">>(() => {
    const points = downsample(series);
    const map = (select: (p: SeriesPoint) => number) =>
      points.map((p) => ({ x: p.t, y: select(p) }));

    const valueDataset = {
      label: "Valeur",
      yAxisID: "yEur",
      data: map((p) => p.value),
      borderColor: color.ring,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.25,
      fill: "origin",
      backgroundColor: areaFill(rgb.ring),
    };
    const investedDataset = {
      label: "Investi",
      yAxisID: "yEur",
      data: map((p) => p.invested),
      borderColor: color.primary,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.25,
      fill: isArea ? ("origin" as const) : (false as const),
      ...(isArea ? { backgroundColor: areaFill(rgb.primary) } : {}),
    };

    if (isArea) return { datasets: [valueDataset, investedDataset] };

    return {
      datasets: [
        valueDataset,
        investedDataset,
        {
          label: "Prix",
          yAxisID: "yEur",
          data: map((p) => p.price),
          borderColor: color.gold,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.25,
          fill: false,
        },
        {
          label: `Acquis (${symbol.toUpperCase()})`,
          yAxisID: "yUnits",
          data: map((p) => p.units),
          borderColor: color.textMuted,
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
          tension: 0.25,
          fill: false,
        },
      ],
    };
  }, [series, symbol, isArea]);

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          type: "linear",
          grid: { color: withAlpha(rgb.border, 0.08) },
          ticks: {
            color: color.textMuted,
            maxTicksLimit: 8,
            callback: (value) =>
              new Date(Number(value)).getFullYear().toString(),
          },
        },
        yEur: {
          type: "linear",
          position: "left",
          grid: { color: withAlpha(rgb.border, 0.08) },
          ticks: {
            color: color.textMuted,
            callback: (value) => `${Math.round(Number(value) / 1000)} k€`,
          },
        },
        yUnits: {
          type: "linear",
          position: "right",
          display: !isArea,
          grid: { drawOnChartArea: false },
          ticks: { color: withAlpha(rgb.textMuted, 0.7) },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: color.text, usePointStyle: true, boxHeight: 6 },
        },
        tooltip: {
          callbacks: {
            title: (items) =>
              items[0]
                ? new Date(Number(items[0].parsed.x)).toLocaleDateString(
                    "fr-FR",
                  )
                : "",
            label: (item) => {
              const value = Number(item.parsed.y);
              const label = item.dataset.label ?? "";
              if (item.dataset.yAxisID === "yUnits") {
                return `${label}: ${formatUnits(value, symbol)}`;
              }
              return `${label}: ${formatEur(value)}`;
            },
          },
        },
      },
    }),
    [symbol, isArea],
  );

  return (
    <div className="relative h-[280px] min-[860px]:h-[360px]">
      <Line data={data} options={options} />
    </div>
  );
}
