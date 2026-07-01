import { describe, it, expect } from "vitest";
import { summarizeByYear } from "./yearly";
import type { SeriesPoint } from "./types";

function point(
  dateIso: string,
  invested: number,
  units: number,
  price: number,
): SeriesPoint {
  return {
    t: Date.parse(dateIso),
    invested,
    units,
    price,
    value: units * price,
  };
}

describe("summarizeByYear", () => {
  it("keeps the last point of each year as the close", () => {
    const series = [
      point("2018-06-01", 100, 0.01, 6000),
      point("2018-12-31", 300, 0.04, 8000),
      point("2019-12-31", 600, 0.07, 12000),
    ];
    const rows = summarizeByYear(series);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.year).toBe(2018);
    expect(rows[0]?.invested).toBe(300);
    expect(rows[0]?.value).toBe(0.04 * 8000);
    expect(rows[1]?.year).toBe(2019);
  });

  it("computes cumulative performance (value vs invested)", () => {
    const rows = summarizeByYear([point("2020-12-31", 1000, 0.05, 40000)]);
    // value = 0.05 * 40000 = 2000 ; perf = (2000 - 1000) / 1000 * 100 = 100 %
    expect(rows[0]?.performancePct).toBeCloseTo(100, 6);
  });

  it("avoids division by zero when nothing is invested", () => {
    const rows = summarizeByYear([point("2021-01-01", 0, 0, 30000)]);
    expect(rows[0]?.performancePct).toBe(0);
  });

  it("returns an empty array for an empty series", () => {
    expect(summarizeByYear([])).toEqual([]);
  });
});
