import { Decimal } from "decimal.js";
import { SimulationError } from "./errors";
import { scheduleDates } from "./dates";
import type {
  PricePoint,
  SeriesPoint,
  SimulationInput,
  SimulationResult,
} from "./types";

/**
 * Last known price at date `t` (most recent point with `point.t <= t`).
 * Returns `null` if `t` precedes any available data.
 * `prices` must be sorted by ascending `t` (contract of `SimulationInput`).
 */
function priceAtOrBefore(
  prices: readonly PricePoint[],
  t: number,
): number | null {
  let lo = 0;
  let hi = prices.length - 1;
  let idx = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const point = prices[mid];
    if (point === undefined) break;
    if (point.t <= t) {
      idx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (idx < 0) return null;
  return prices[idx]?.price ?? null;
}

interface Buy {
  readonly t: number;
  readonly units: Decimal;
}

/**
 * DCA / single-contribution backtest for a crypto, based on a daily price
 * history (EUR). Pure function, independent of React and the network.
 *
 * Any scheduled buy whose date precedes the first price data point (the asset
 * did not exist yet) is ignored; `periods` only counts executed buys.
 */
export function simulate(input: SimulationInput): SimulationResult {
  const { prices, amount, frequency, from, to } = input;

  if (!(amount > 0)) {
    throw new SimulationError(
      "INVALID_AMOUNT",
      "Le montant doit être strictement positif.",
    );
  }
  if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) {
    throw new SimulationError(
      "INVALID_RANGE",
      "La date de début doit précéder la date de fin.",
    );
  }
  if (prices.length === 0) {
    throw new SimulationError(
      "NO_PRICE_DATA",
      "Aucune donnée de prix disponible.",
    );
  }

  // Per-contribution amount as Decimal: all monetary/unit arithmetic goes through
  // decimal.js to avoid accumulating floating-point errors (hundreds of cumulative
  // `amount / price` divisions, then ratios).
  const amountDec = new Decimal(amount);

  const buys: Buy[] = [];
  for (const date of scheduleDates(from, to, frequency)) {
    const price = priceAtOrBefore(prices, date);
    if (price === null || !(price > 0)) continue;
    buys.push({ t: date, units: amountDec.div(price) });
  }

  if (buys.length === 0) {
    throw new SimulationError(
      "NO_INVESTMENTS_IN_RANGE",
      "Aucun versement n'a pu être exécuté sur la période (données de prix indisponibles).",
    );
  }

  // Time series: one point per day of data within [from, to],
  // accumulating buys over time (cumulative totals in Decimal).
  const series: SeriesPoint[] = [];
  let buyIdx = 0;
  let cumInvested = new Decimal(0);
  let cumUnits = new Decimal(0);
  for (const point of prices) {
    if (point.t < from || point.t > to) continue;
    while (buyIdx < buys.length && (buys[buyIdx]?.t ?? Infinity) <= point.t) {
      const buy = buys[buyIdx];
      if (buy !== undefined) {
        cumInvested = cumInvested.plus(amountDec);
        cumUnits = cumUnits.plus(buy.units);
      }
      buyIdx++;
    }
    series.push({
      t: point.t,
      invested: cumInvested.toNumber(),
      units: cumUnits.toNumber(),
      price: point.price,
      value: cumUnits.times(point.price).toNumber(),
    });
  }

  const invested = amountDec.times(buys.length);
  const units = buys.reduce((sum, b) => sum.plus(b.units), new Decimal(0));
  const lastPoint = prices[prices.length - 1];
  const finalPrice = priceAtOrBefore(prices, to) ?? lastPoint?.price ?? 0;
  const finalValue = units.times(finalPrice);
  const gain = finalValue.minus(invested);
  const averagePrice = units.isZero() ? new Decimal(0) : invested.div(units);
  const performancePct = invested.isZero()
    ? new Decimal(0)
    : gain.div(invested).times(100);

  return {
    invested: invested.toNumber(),
    units: units.toNumber(),
    averagePrice: averagePrice.toNumber(),
    finalValue: finalValue.toNumber(),
    gain: gain.toNumber(),
    performancePct: performancePct.toNumber(),
    periods: buys.length,
    series,
  };
}
