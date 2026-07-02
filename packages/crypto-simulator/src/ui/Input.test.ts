import { describe, it, expect } from "vitest";
import { maskDate } from "./Input";

describe("maskDate", () => {
  it("caps each segment: 2 digits day, 2 month, 4 year", () => {
    expect(maskDate("01/05/2013")).toBe("01/05/2013");
    // A fifth year digit never lands.
    expect(maskDate("01/05/20133")).toBe("01/05/2013");
  });

  it("auto-advances to the next segment as each one fills (typing forward)", () => {
    expect(maskDate("0")).toBe("0");
    expect(maskDate("01")).toBe("01/"); // day full → jump to month
    expect(maskDate("01/0")).toBe("01/0");
    expect(maskDate("01/05")).toBe("01/05/"); // month full → jump to year
    expect(maskDate("01/05/20")).toBe("01/05/20");
  });

  it("does NOT cascade when a digit is deleted mid-string", () => {
    // The exact bug: "01/05/2013" minus the "5" must stay "01/0/2013",
    // never re-slice into "01/02/013".
    expect(maskDate("01/0/2013", true)).toBe("01/0/2013");
    expect(maskDate("1/05/2013", true)).toBe("1/05/2013");
    expect(maskDate("01/05/201", true)).toBe("01/05/201");
  });

  it("does not auto-insert a slash while deleting", () => {
    // Backspacing the trailing slash off "01/" leaves "01", editable again.
    expect(maskDate("01", true)).toBe("01");
  });

  it("ignores any non-digit the user pastes", () => {
    expect(maskDate("aa01bb/05/2013")).toBe("01/05/2013");
  });
});
