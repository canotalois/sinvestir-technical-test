import { formatEur } from "./format";
import { signClass } from "./styles";

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="text-center">
      <span className="mb-1.5 block text-sm font-light text-blue-light">
        {label}
      </span>
      <span
        className={`block text-2xl font-normal tabular-nums ${className ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/** The three headline figures shown above the chart, also reused in the
 *  shareable export card. */
export function StatsRow({
  finalValue,
  gain,
  invested,
}: {
  readonly finalValue: number;
  readonly gain: number;
  readonly invested: number;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-12">
      <Stat label="Valeur finale" value={formatEur(finalValue)} />
      <Stat
        label="Plus-value"
        value={formatEur(gain)}
        className={signClass(gain)}
      />
      <Stat label="Total investi" value={formatEur(invested)} />
    </div>
  );
}
