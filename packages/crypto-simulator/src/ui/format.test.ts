import { describe, it, expect } from "vitest";
import {
  formatPct,
  formatPctValue,
  formatAmount,
  formatUnitsNumber,
  formatDateLong,
  fromDateInputValue,
  toDateInputValue,
  periodsLabel,
} from "./format";

describe("formatPct", () => {
  it("displays an explicit sign for positive and negative values", () => {
    expect(formatPct(277.33).startsWith("+")).toBe(true);
    expect(
      formatPct(-12.5).includes("−") || formatPct(-12.5).includes("-"),
    ).toBe(true);
  });
});

describe("formatAmount", () => {
  it("formats without a currency symbol, always 2 decimals", () => {
    const s = formatAmount(11100);
    expect(s).not.toContain("€");
    expect(s.endsWith("00")).toBe(true);
    expect(s).toContain(",");
  });
});

describe("formatUnitsNumber", () => {
  it("rounds to at most 6 decimals, without an asset symbol", () => {
    expect(formatUnitsNumber(0.79448843)).toBe("0,794488");
    expect(formatUnitsNumber(2)).toBe("2");
  });
});

describe("formatPctValue", () => {
  it("adapts the number of decimals to the magnitude", () => {
    expect(formatPctValue(277.33)).toBe("+277");
    expect(formatPctValue(45.3)).toBe("+45,3");
    expect(formatPctValue(3.21)).toBe("+3,21");
  });
  it("keeps a negative sign (no '+')", () => {
    const s = formatPctValue(-54.2);
    expect(s.startsWith("+")).toBe(false);
    expect(s).toContain("54");
  });
});

describe("formatDateLong", () => {
  it("renders a human-readable date in French, in UTC (no timezone drift)", () => {
    expect(formatDateLong("2018-01-01")).toBe("1 janvier 2018");
  });

  it("never throws on invalid input, returns it unchanged", () => {
    expect(formatDateLong("")).toBe("");
    expect(formatDateLong("not-a-date")).toBe("not-a-date");
  });
});

describe("date <input> helpers", () => {
  it("round-trips timestamp ↔ 'yyyy-mm-dd' without timezone drift", () => {
    const ts = Date.UTC(2018, 0, 1);
    expect(toDateInputValue(ts)).toBe("2018-01-01");
    expect(fromDateInputValue("2018-01-01")).toBe(ts);
  });

  it("returns NaN (never throws) on empty or malformed dates", () => {
    expect(fromDateInputValue("")).toBeNaN();
    expect(fromDateInputValue("pas-une-date")).toBeNaN();
    expect(fromDateInputValue("2018-01")).toBeNaN();
    expect(fromDateInputValue("2018-13-01")).toBeNaN();
    expect(fromDateInputValue("2018-00-10")).toBeNaN();
    expect(fromDateInputValue("2018-02-31")).toBeNaN();
  });
});

describe("periodsLabel", () => {
  it("agrees the plural and keeps 'mois' invariant", () => {
    expect(periodsLabel("weekly", 443)).toBe("443 semaines");
    expect(periodsLabel("weekly", 1)).toBe("1 semaine");
    expect(periodsLabel("monthly", 12)).toBe("12 mois");
    expect(periodsLabel("once", 1)).toBe("1 versement");
  });
});
