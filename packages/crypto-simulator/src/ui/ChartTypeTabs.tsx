"use client";

export type ChartType = "line" | "area" | "bar" | "doughnut";

const OPTIONS: readonly { value: ChartType; label: string }[] = [
  { value: "line", label: "Courbe" },
  { value: "area", label: "Aire" },
  { value: "bar", label: "Barres" },
  { value: "doughnut", label: "Donut" },
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
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-xs font-light transition-colors ${
            value === o.value
              ? "bg-white/10 text-white"
              : "text-blue-light hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
