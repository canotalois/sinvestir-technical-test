import type { Frequency } from "../core/types";

const MONEY_COMPACT_ABOVE = 1e9;
const UNITS_COMPACT_ABOVE = 1e6;

const eurFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const eurCompactFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const amountFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const amountCompactFmt = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const amountInputFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

const unitsFullFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 8 });

const unitsCardFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 6 });

const unitsSmallFmt = new Intl.NumberFormat("fr-FR", {
  maximumSignificantDigits: 6,
});

const unitsCompactFmt = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const pctFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const makePctValueFmt = (digits: number) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: "exceptZero",
  });

const pctValueFmts: Record<0 | 1 | 2, Intl.NumberFormat> = {
  0: makePctValueFmt(0),
  1: makePctValueFmt(1),
  2: makePctValueFmt(2),
};

const dateLongFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const identity = (s: string): string => s;

/** Replaces narrow non-breaking spaces (fr-FR separators) with normal spaces,
 *  so a long amount can wrap instead of overflowing. */
function breakableSpaces(formatted: string): string {
  return formatted.replace(/[\u202f\u00a0\u2009]/g, " ");
}

/** Formats with `compact` past `threshold` and `full` below, a dash for
 *  non-finite input. Keeps every card value to one short line. */
function scaled(
  value: number,
  threshold: number,
  full: Intl.NumberFormat,
  compact: Intl.NumberFormat,
  transform: (s: string) => string = identity,
): string {
  if (!Number.isFinite(value)) return "-";
  const fmt = Math.abs(value) >= threshold ? compact : full;
  return transform(fmt.format(value));
}

export function formatEur(value: number): string {
  return scaled(value, MONEY_COMPACT_ABOVE, eurFmt, eurCompactFmt);
}

export function formatAmount(value: number): string {
  return scaled(
    value,
    MONEY_COMPACT_ABOVE,
    amountFmt,
    amountCompactFmt,
    breakableSpaces,
  );
}

/** Full precision, no compaction, for a hover title on a truncated card value. */
export function formatAmountFull(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return breakableSpaces(amountFmt.format(value));
}

/** Amount for an <input>: grouped by thousands ("1 100") at rest, empty if not finite. */
export function formatAmountInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  return breakableSpaces(amountInputFmt.format(value));
}

/** Parses free-form amount input ("1 100", "1 100,5") into a number. */
export function parseAmountInput(raw: string): number {
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  return cleaned === "" ? Number.NaN : Number(cleaned);
}

/** Crypto units with their symbol (e.g. "0,79400746 BTC"), full precision. */
export function formatUnits(value: number, symbol: string): string {
  return `${unitsFullFmt.format(value)} ${symbol.toUpperCase()}`;
}

/** Unit quantity for card display: significant figures below 1 (a cheap token's
 *  tiny fractions), 6 decimals in the normal range, compact ("94,7 Md") past a
 *  million. Full precision goes in the card's hover title. */
export function formatUnitsNumber(value: number): string {
  if (!Number.isFinite(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= UNITS_COMPACT_ABOVE) return unitsCompactFmt.format(value);
  if (abs !== 0 && abs < 1) return unitsSmallFmt.format(value);
  return unitsCardFmt.format(value);
}

/** Full-precision unit quantity WITHOUT symbol, for a hover title. */
export function formatUnitsFull(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return unitsFullFmt.format(value);
}

/** Signed percentage with « % » (e.g. "+277,33 %", "−12,5 %"). */
export function formatPct(value: number): string {
  return `${pctFmt.format(value)} %`;
}

/** Signed percentage WITHOUT « % », fewer decimals as the magnitude grows. */
export function formatPctValue(value: number): string {
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return pctValueFmts[digits].format(value);
}

/** Timestamp (ms UTC) → "yyyy-mm-dd" for an <input type="date">. */
export function toDateInputValue(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/** "yyyy-mm-dd" → "dd/mm/yyyy" (compact, for the date-range trigger). */
export function formatDateShort(value: string): string {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/** "yyyy-mm-dd" → "1 janvier 2018" (UTC). Returns the input unchanged if it
 *  cannot be parsed (never throws). */
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
  const d = new Date(ts);
  // JS rolls overflow dates forward ("2018-02-31" → March), so reject them.
  if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    return Number.NaN;
  }
  return ts;
}

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
