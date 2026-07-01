import { ResultsPanel } from "./ResultsPanel";
import { StatsRow } from "./StatsRow";
import { HistoryChart } from "./HistoryChart";
import { formatDateLong, toDateInputValue } from "./format";
import type { Frequency, SimulationResult } from "../core/types";

interface ShareCardProps {
  readonly result: SimulationResult;
  readonly symbol: string;
  readonly coinName: string;
  readonly amount: number;
  readonly frequency: Frequency;
  readonly from: string;
  readonly to: string;
  readonly periodsText: string | null;
  /** Generation date (ms). Rendered in the header, e.g. "Le 30 juin 2026". */
  readonly generatedAt: number;
}

/**
 * Fixed-width, branded composition exported as a PNG when the user downloads
 * their results: header + date, result cards, headline figures, chart and a
 * S'investir footer. Rendered off-screen and captured with `html-to-image`.
 */
export function ShareCard({
  result,
  symbol,
  coinName,
  amount,
  frequency,
  from,
  to,
  periodsText,
  generatedAt,
}: ShareCardProps) {
  const year = new Date(generatedAt).getFullYear();

  return (
    <div className="w-[1240px] bg-app p-12 font-sans text-white">
      <ResultsPanel
        result={result}
        loading={false}
        symbol={symbol}
        coinName={coinName}
        amount={amount}
        frequency={frequency}
        from={from}
        to={to}
        periodsText={periodsText}
        dateLabel={`Le ${formatDateLong(toDateInputValue(generatedAt))}`}
      />

      <div className="mt-12">
        <StatsRow
          finalValue={result.finalValue}
          gain={result.gain}
          invested={result.invested}
        />
      </div>

      <div className="mt-8">
        <HistoryChart series={result.series} symbol={symbol} />
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
          <img
            src="/sinvestir-mark.svg"
            alt="S'investir"
            className="h-9 w-auto"
          />
          <span className="text-base font-light tracking-[0.2em] text-white">
            SIMULATEURS
          </span>
        </div>
        <span className="text-sm font-light text-blue-light">
          Copyright © {year} | sinvestir.fr
        </span>
      </div>
    </div>
  );
}
