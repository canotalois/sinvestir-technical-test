import { describe, it, expect } from "vitest";
import { simulate } from "./simulate";
import { SimulationError, type SimulationErrorCode } from "./errors";
import { DAY_MS, addMonths } from "./dates";
import type { PricePoint } from "./types";

const D0 = Date.UTC(2020, 0, 1); // 2020-01-01 00:00 UTC

/** Builds a daily series from a list of prices. */
function daily(prices: number[], start = D0): PricePoint[] {
  return prices.map((price, i) => ({ t: start + i * DAY_MS, price }));
}

/** Returns the `code` of the thrown SimulationError, or an explicit marker. */
function codeOf(fn: () => unknown): SimulationErrorCode | string {
  try {
    fn();
  } catch (err) {
    return err instanceof SimulationError
      ? err.code
      : `unexpected:${String(err)}`;
  }
  return "no-throw";
}

describe("simulate — single contribution", () => {
  it("buys once at the starting price and values at the final price", () => {
    const prices = daily([10, 20, 40]);
    const r = simulate({
      prices,
      amount: 100,
      frequency: "once",
      from: D0,
      to: D0 + 2 * DAY_MS,
    });

    expect(r.periods).toBe(1);
    expect(r.invested).toBe(100);
    expect(r.units).toBeCloseTo(10); // 100 / 10
    expect(r.averagePrice).toBeCloseTo(10);
    expect(r.finalValue).toBeCloseTo(400); // 10 units × 40
    expect(r.performancePct).toBeCloseTo(300);
  });
});

describe("simulate — DCA", () => {
  it("accumulates more units when the price is low (daily DCA)", () => {
    const prices = daily([10, 20, 40]);
    const r = simulate({
      prices,
      amount: 10,
      frequency: "daily",
      from: D0,
      to: D0 + 2 * DAY_MS,
    });

    // units = 10/10 + 10/20 + 10/40 = 1.75
    expect(r.periods).toBe(3);
    expect(r.invested).toBe(30);
    expect(r.units).toBeCloseTo(1.75);
    expect(r.averagePrice).toBeCloseTo(30 / 1.75);
    expect(r.finalValue).toBeCloseTo(70); // 1.75 × 40
    expect(r.performancePct).toBeCloseTo(133.3333, 3);
  });

  it("yields ~0% performance on a flat price (stablecoin-like)", () => {
    const prices = daily([1, 1, 1, 1, 1]);
    const r = simulate({
      prices,
      amount: 25,
      frequency: "daily",
      from: D0,
      to: D0 + 4 * DAY_MS,
    });

    expect(r.averagePrice).toBeCloseTo(1);
    expect(r.performancePct).toBeCloseTo(0);
    expect(r.finalValue).toBeCloseTo(r.invested);
  });

  it("advances month by month for the 'monthly' frequency", () => {
    const prices = daily(Array.from({ length: 70 }, () => 10));
    // D0 (Jan 1) → +60 days = Mar 1, 2020: 3 contributions (Jan, Feb, Mar)
    const r = simulate({
      prices,
      amount: 100,
      frequency: "monthly",
      from: D0,
      to: D0 + 60 * DAY_MS,
    });

    expect(r.periods).toBe(3);
    expect(r.invested).toBe(300);
  });
});

describe("simulate — decimal precision (decimal.js)", () => {
  it("avoids floating-point drift on accumulations (0.1 × 3 = 0.3 exact)", () => {
    const prices = daily([1, 1, 1]);
    const r = simulate({
      prices,
      amount: 0.1,
      frequency: "daily",
      from: D0,
      to: D0 + 2 * DAY_MS,
    });

    // In floating-point arithmetic, 0.1 + 0.1 + 0.1 === 0.30000000000000004 (≠ 0.3).
    expect(r.invested).toBe(0.3);
    expect(r.units).toBe(0.3); // 3 × (0.1 / 1)
    expect(r.gain).toBe(0); // flat price
  });

  it("exposes a gain consistent with finalValue − invested", () => {
    const prices = daily([10, 20, 40]);
    const r = simulate({
      prices,
      amount: 10,
      frequency: "daily",
      from: D0,
      to: D0 + 2 * DAY_MS,
    });

    expect(r.gain).toBeCloseTo(r.finalValue - r.invested);
    expect(r.gain).toBeCloseTo(40); // 70 − 30
  });
});

describe("simulate — bounds & missing data", () => {
  it("ignores scheduled contributions before the first price data point", () => {
    const prices = daily([10, 20]); // starts at D0
    const r = simulate({
      prices,
      amount: 10,
      frequency: "daily",
      from: D0 - 3 * DAY_MS, // 3 days before the data exists
      to: D0 + 1 * DAY_MS,
    });

    expect(r.periods).toBe(2); // only D0 and D0+1 are executed
    expect(r.invested).toBe(20);
  });

  it("throws NO_INVESTMENTS_IN_RANGE when the whole period precedes the data", () => {
    const prices = daily([10, 20]);
    expect(
      codeOf(() =>
        simulate({
          prices,
          amount: 10,
          frequency: "daily",
          from: D0 - 10 * DAY_MS,
          to: D0 - 5 * DAY_MS,
        }),
      ),
    ).toBe("NO_INVESTMENTS_IN_RANGE");
  });
});

describe("simulate — invalid inputs", () => {
  it("throws INVALID_AMOUNT on a non strictly positive amount", () => {
    const prices = daily([10]);
    expect(
      codeOf(() =>
        simulate({ prices, amount: 0, frequency: "once", from: D0, to: D0 }),
      ),
    ).toBe("INVALID_AMOUNT");
  });

  it("throws INVALID_RANGE when from > to", () => {
    const prices = daily([10, 20]);
    expect(
      codeOf(() =>
        simulate({
          prices,
          amount: 10,
          frequency: "once",
          from: D0 + DAY_MS,
          to: D0,
        }),
      ),
    ).toBe("INVALID_RANGE");
  });

  it("throws NO_PRICE_DATA when the price series is empty", () => {
    expect(
      codeOf(() =>
        simulate({
          prices: [],
          amount: 10,
          frequency: "once",
          from: D0,
          to: D0,
        }),
      ),
    ).toBe("NO_PRICE_DATA");
  });

  it("throws INVALID_AMOUNT on a NaN amount (empty input)", () => {
    const prices = daily([10]);
    expect(
      codeOf(() =>
        simulate({
          prices,
          amount: Number.NaN,
          frequency: "once",
          from: D0,
          to: D0,
        }),
      ),
    ).toBe("INVALID_AMOUNT");
  });

  it("throws INVALID_RANGE on non-finite date bounds (never loops)", () => {
    const prices = daily([10, 20]);
    expect(
      codeOf(() =>
        simulate({
          prices,
          amount: 10,
          frequency: "daily",
          from: Number.NaN,
          to: D0,
        }),
      ),
    ).toBe("INVALID_RANGE");
  });
});

describe("simulate — time series", () => {
  it("produces a daily series whose last point matches the aggregates", () => {
    const prices = daily([10, 20, 40]);
    const r = simulate({
      prices,
      amount: 10,
      frequency: "daily",
      from: D0,
      to: D0 + 2 * DAY_MS,
    });

    expect(r.series).toHaveLength(3);
    const last = r.series.at(-1);
    expect(last).toBeDefined();
    expect(last?.invested).toBe(r.invested);
    expect(last?.value).toBeCloseTo(r.finalValue);
    expect(last?.units).toBeCloseTo(r.units);
  });
});

describe("addMonths", () => {
  it("clamps the end of month (Jan 31 + 1 month → Feb 29 in 2020)", () => {
    const jan31 = Date.UTC(2020, 0, 31);
    const feb = new Date(addMonths(jan31, 1));
    expect(feb.getUTCMonth()).toBe(1); // February
    expect(feb.getUTCDate()).toBe(29); // leap year
  });
});
