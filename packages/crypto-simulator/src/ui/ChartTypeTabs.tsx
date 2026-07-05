"use client";

import type { ComponentType, SVGProps } from "react";
import { LabelTooltip } from "./Tooltip";
import {
  LineChartIcon,
  AreaChartIcon,
  BarChartIcon,
  DoughnutIcon,
} from "./icons";

export type ChartType = "line" | "area" | "bar" | "doughnut";

const OPTIONS: readonly {
  value: ChartType;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { value: "line", label: "Courbe", Icon: LineChartIcon },
  { value: "area", label: "Aire", Icon: AreaChartIcon },
  { value: "bar", label: "Barres", Icon: BarChartIcon },
  { value: "doughnut", label: "Donut", Icon: DoughnutIcon },
];

export function ChartTypeTabs({
  value,
  onChange,
}: {
  readonly value: ChartType;
  readonly onChange: (value: ChartType) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Type de graphique"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {OPTIONS.map((o) => (
        <LabelTooltip key={o.value} label={o.label} side="top">
          <button
            type="button"
            role="tab"
            aria-selected={value === o.value}
            aria-label={o.label}
            onClick={() => onChange(o.value)}
            className={`flex items-center justify-center rounded-full p-2 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-sky [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11 ${
              value === o.value
                ? "bg-white/10 text-white"
                : "text-blue-light hover:text-white"
            }`}
          >
            <o.Icon className="h-4 w-4" />
          </button>
        </LabelTooltip>
      ))}
    </div>
  );
}
