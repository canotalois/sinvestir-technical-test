import type { Frequency } from "./types";

export const DAY_MS = 86_400_000;

/** Adds `n` days to a timestamp (ms). */
export function addDays(ts: number, n: number): number {
  return ts + n * DAY_MS;
}

/**
 * Adds `n` months in UTC, with end-of-month clamping
 * (Jan 31 + 1 month → Feb 28/29).
 */
export function addMonths(ts: number, n: number): number {
  const d = new Date(ts);
  const day = d.getUTCDate();
  const firstOfTarget = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1),
  );
  const daysInTarget = new Date(
    Date.UTC(
      firstOfTarget.getUTCFullYear(),
      firstOfTarget.getUTCMonth() + 1,
      0,
    ),
  ).getUTCDate();
  return Date.UTC(
    firstOfTarget.getUTCFullYear(),
    firstOfTarget.getUTCMonth(),
    Math.min(day, daysInTarget),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds(),
  );
}

/**
 * Generates the contribution dates between `from` and `to` (bounds included)
 * according to the frequency. Steps are computed from `from` to avoid drift.
 */
export function scheduleDates(
  from: number,
  to: number,
  frequency: Frequency,
): number[] {
  if (frequency === "once") return from <= to ? [from] : [];

  const dates: number[] = [];
  for (let i = 0; ; i++) {
    const ts =
      frequency === "daily"
        ? addDays(from, i)
        : frequency === "weekly"
          ? addDays(from, i * 7)
          : addMonths(from, i);
    if (ts > to) break;
    dates.push(ts);
    if (dates.length > 200_000) break; // anti-loop safeguard
  }
  return dates;
}
