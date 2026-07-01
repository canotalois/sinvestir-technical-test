/** Investment frequency (DCA), or single contribution. */
export type Frequency = "once" | "daily" | "weekly" | "monthly";

export const FREQUENCIES: readonly Frequency[] = [
  "once",
  "daily",
  "weekly",
  "monthly",
] as const;

/** Narrowing guard (avoids an `as Frequency` cast on `<select>` values). */
export function isFrequency(value: string): value is Frequency {
  return (FREQUENCIES as readonly string[]).includes(value);
}

/** A daily price point (timestamp ms UTC, price in EUR). */
export interface PricePoint {
  readonly t: number;
  readonly price: number;
}

export interface SimulationInput {
  /** Daily series sorted by ascending `t` (in EUR). */
  readonly prices: readonly PricePoint[];
  /** Amount invested per period, in EUR (> 0). */
  readonly amount: number;
  readonly frequency: Frequency;
  /** Start bound, inclusive (ms UTC). */
  readonly from: number;
  /** End bound, inclusive (ms UTC). */
  readonly to: number;
}

/** Point of the time series displayed in the "Historique" chart. */
export interface SeriesPoint {
  readonly t: number;
  /** Cumulative amount invested at this date (€). */
  readonly invested: number;
  /** Cumulative units held at this date. */
  readonly units: number;
  /** Asset price at this date (€). */
  readonly price: number;
  /** Portfolio value at this date (€) = units × price. */
  readonly value: number;
}

export interface SimulationResult {
  /** Total invested (€) = amount × periods. */
  readonly invested: number;
  /** Units acquired (cumulative). */
  readonly units: number;
  /** Average acquisition price / PRU (€) = invested / units. */
  readonly averagePrice: number;
  /** Final capital (€) = units × final price. */
  readonly finalValue: number;
  /** Capital gain or loss (€) = finalValue − invested. */
  readonly gain: number;
  /** Performance as a percentage: (finalValue − invested) / invested × 100. */
  readonly performancePct: number;
  /** Number of contributions actually executed (price available). */
  readonly periods: number;
  /** Time series for the chart. */
  readonly series: readonly SeriesPoint[];
}
