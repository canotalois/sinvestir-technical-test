import type { SeriesPoint } from "./types";

export interface YearSummary {
  readonly year: number;
  /** Cumulative amount invested at year end (€). */
  readonly invested: number;
  /** Cumulative units held at year end. */
  readonly units: number;
  /** Portfolio value at year end (€). */
  readonly value: number;
  /** Cumulative performance at this date (%). */
  readonly performancePct: number;
}

/**
 * Reduces the daily series to one snapshot per calendar year (the last point
 * of each year = close). The series is assumed to be in ascending chronological order.
 */
export function summarizeByYear(series: readonly SeriesPoint[]): YearSummary[] {
  const lastOfYear = new Map<number, SeriesPoint>();
  for (const point of series) {
    lastOfYear.set(new Date(point.t).getUTCFullYear(), point);
  }
  return [...lastOfYear.entries()].map(([year, point]) => ({
    year,
    invested: point.invested,
    units: point.units,
    value: point.value,
    performancePct:
      point.invested > 0
        ? ((point.value - point.invested) / point.invested) * 100
        : 0,
  }));
}
