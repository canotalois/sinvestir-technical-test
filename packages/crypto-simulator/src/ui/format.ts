import type { Frequency } from "../core/types";

const eurFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const unitsFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 8 });

const unitsCardFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 6,
});

const amountFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Above a billion, switch to compact notation ("1,2 Md") so a card value stays
 *  one short line instead of a 40-digit string. The card also truncates as a
 *  hard safety net, so the layout can never shift regardless of magnitude. */
const COMPACT_ABOVE = 1e9;

const eurCompactFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const amountCompactFmt = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const pctFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

/** Replaces narrow non-breaking spaces (fr-FR separators) with normal spaces,
 *  so long amounts can wrap to a new line instead of overflowing. */
function breakableSpaces(formatted: string): string {
  return formatted.replace(/[\u202f\u00a0\u2009]/g, " ");
}

export function formatEur(value: number): string {
  if (!Number.isFinite(value)) return "-";
  if (Math.abs(value) >= COMPACT_ABOVE) return eurCompactFmt.format(value);
  return eurFmt.format(value);
}

export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return "-";
  if (Math.abs(value) >= COMPACT_ABOVE) return amountCompactFmt.format(value);
  return breakableSpaces(amountFmt.format(value));
}

/** Full precision, no compaction, for a hover title on a truncated card value. */
export function formatAmountFull(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return breakableSpaces(amountFmt.format(value));
}

/** Amount for an <input>: grouped by thousands ("1 100") at rest, empty if not finite. */
export function formatAmountInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  return breakableSpaces(
    new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value),
  );
}

/** Parses free-form amount input ("1 100", "1 100,5") into a number. */
export function parseAmountInput(raw: string): number {
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  return cleaned === "" ? Number.NaN : Number(cleaned);
}

/** Crypto units with their symbol (e.g. "0,79400746 BTC") - tooltip usage (full precision). */
export function formatUnits(value: number, symbol: string): string {
  return `${unitsFmt.format(value)} ${symbol.toUpperCase()}`;
}

/** Unit quantity WITHOUT symbol, rounded for card display (e.g. "0,794488"). */
export function formatUnitsNumber(value: number): string {
  return unitsCardFmt.format(value);
}

/** Signed percentage with « % » (e.g. "+277,33 %", "−12,5 %"). */
export function formatPct(value: number): string {
  return `${pctFmt.format(value)} %`;
}

/** Signed percentage WITHOUT « % », adaptive precision (e.g. "+277", "+45,3", "+3,21"). */
export function formatPctValue(value: number): string {
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: "exceptZero",
  }).format(value);
}

/** Timestamp (ms UTC) → "yyyy-mm-dd" for an <input type="date">. */
export function toDateInputValue(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

const dateLongFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "yyyy-mm-dd" → "dd/mm/yyyy" (compact, for the date-range trigger). */
export function formatDateShort(value: string): string {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/** "yyyy-mm-dd" → "1 janvier 2018" (human-readable, UTC timezone).
 *  Returns the raw input unchanged if it cannot be parsed (never throws). */
export function formatDateLong(value: string): string {
  const ts = fromDateInputValue(value);
  return Number.isFinite(ts) ? dateLongFmt.format(new Date(ts)) : value;
}

/** "yyyy-mm-dd" → timestamp (ms) at UTC midnight, or `NaN` if the string is
 *  empty, malformed, or not a real calendar date (e.g. "2018-02-31"). */
export function fromDateInputValue(value: string): number {
  const parts = value.split("-");
  if (parts.length !== 3) return Number.NaN;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return Number.NaN;
  }
  const ts = Date.UTC(year, month - 1, day);
  // Reject overflow dates that JS rolls forward (e.g. "2018-02-31" → March).
  const d = new Date(ts);
  if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    return Number.NaN;
  }
  return ts;
}

/** Label "in N weeks" displayed next to the invested amount. */
export function periodsLabel(frequency: Frequency, periods: number): string {
  const plural = periods > 1 ? "s" : "";
  switch (frequency) {
    case "once":
      return `${periods} versement${plural}`;
    case "daily":
      return `${periods} jour${plural}`;
    case "weekly":
      return `${periods} semaine${plural}`;
    case "monthly":
      return `${periods} mois`;
  }
}

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  once: "Une fois",
  daily: "Par jour",
  weekly: "Par semaine",
  monthly: "Par mois",
};
