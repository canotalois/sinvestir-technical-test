"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { color } from "@sinvestir/tokens";
import { formatEur } from "./format";

ChartJS.register(ArcElement, Tooltip, Legend);

/** Final capital split: invested vs. gain (or loss). */
export function DoughnutChart({
  invested,
  gain,
}: {
  readonly invested: number;
  readonly gain: number;
}) {
  const { data, options } = useMemo(() => {
    const hasGain = gain >= 0;
    const chartData: ChartData<"doughnut"> = {
      labels: ["Investi", hasGain ? "Plus-value" : "Moins-value"],
      datasets: [
        {
          data: [invested, Math.abs(gain)],
          backgroundColor: [
            color.primary,
            hasGain ? color.gold : color.negative,
          ],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
    const chartOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: color.text,
            usePointStyle: true,
            boxHeight: 8,
            padding: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: (item) => `${item.label}: ${formatEur(Number(item.parsed))}`,
          },
        },
      },
    };
    return { data: chartData, options: chartOptions };
  }, [invested, gain]);

  return (
    <div className="relative h-[280px] min-[860px]:h-[360px]">
      <Doughnut data={data} options={options} />
    </div>
  );
}
