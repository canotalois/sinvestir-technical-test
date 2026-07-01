"use client";

import { ViewChartIcon, ViewCalendarIcon } from "./icons";

export type ResultsView = "chart" | "calendar";

const TAB =
  "relative z-10 flex cursor-pointer flex-row items-center gap-3 rounded-full px-6 py-3 transition-colors focus:outline-none";

export function ViewTabs({
  value,
  onChange,
}: {
  value: ResultsView;
  onChange: (v: ResultsView) => void;
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className="relative mx-auto flex w-fit flex-row items-center gap-2.5 rounded-full border border-white/10 bg-white/5 p-2.5"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "chart"}
        onClick={() => onChange("chart")}
        className={`${TAB} ${value === "chart" ? "bg-white/5" : "hover:bg-white/[0.02]"}`}
      >
        <ViewChartIcon className="h-5 w-5 text-white" />
        <span className="text-center text-sm font-light tracking-tight text-white">
          Graphiques
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "calendar"}
        onClick={() => onChange("calendar")}
        className={`${TAB} ${value === "calendar" ? "bg-white/5" : "hover:bg-white/[0.02]"}`}
      >
        <ViewCalendarIcon className="h-5 w-5 text-white" />
        <span className="text-center text-sm font-light tracking-tight text-white">
          Calendrier
        </span>
      </button>
    </div>
  );
}
