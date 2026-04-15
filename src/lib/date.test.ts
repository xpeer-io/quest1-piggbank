import { describe, it, expect, vi, afterEach } from "vitest";
import {
  formatDisplayDate,
  formatUrlDate,
  getDefaultDateRange,
  isValidDateRange,
  exceedsMaxRange,
  isDateInFuture,
  DATE_DISPLAY_FORMAT,
  DATE_URL_FORMAT,
  MAX_DATE_RANGE_MONTHS,
} from "./date";

const FIXED_NOW = new Date("2026-04-03T12:00:00.000Z");

afterEach(() => {
  vi.useRealTimers();
});

describe("constants", () => {
  it("exports correct display format", () => {
    expect(DATE_DISPLAY_FORMAT).toBe("dd/MM/yyyy");
  });

  it("exports correct URL format", () => {
    expect(DATE_URL_FORMAT).toBe("yyyy-MM-dd");
  });

  it("exports 12 as max range months", () => {
    expect(MAX_DATE_RANGE_MONTHS).toBe(12);
  });
});

describe("formatDisplayDate", () => {
  it("formats date as dd/MM/yyyy", () => {
    expect(formatDisplayDate(new Date(2026, 2, 15))).toBe("15/03/2026");
  });

  it("pads single-digit day and month", () => {
    expect(formatDisplayDate(new Date(2026, 0, 5))).toBe("05/01/2026");
  });
});

describe("formatUrlDate", () => {
  it("formats date as yyyy-MM-dd", () => {
    expect(formatUrlDate(new Date(2026, 2, 15))).toBe("2026-03-15");
  });

  it("pads single-digit day and month", () => {
    expect(formatUrlDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("getDefaultDateRange", () => {
  it("returns range ending today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    const range = getDefaultDateRange();

    expect(range.to.getFullYear()).toBe(2026);
    expect(range.to.getMonth()).toBe(3);
    expect(range.to.getDate()).toBe(3);
  });

  it("returns range starting 30 days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    const range = getDefaultDateRange();

    expect(range.from.getDate()).toBe(4);
    expect(range.from.getMonth()).toBe(2);
    expect(range.from.getFullYear()).toBe(2026);
  });

  it("sets from to start of day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    const range = getDefaultDateRange();

    expect(range.from.getHours()).toBe(0);
    expect(range.from.getMinutes()).toBe(0);
    expect(range.from.getSeconds()).toBe(0);
  });

  it("sets to to end of day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    const range = getDefaultDateRange();

    expect(range.to.getHours()).toBe(23);
    expect(range.to.getMinutes()).toBe(59);
    expect(range.to.getSeconds()).toBe(59);
  });
});

describe("isValidDateRange", () => {
  it("returns true when to is after from", () => {
    expect(
      isValidDateRange({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 1, 1),
      }),
    ).toBe(true);
  });

  it("returns false when to is before from", () => {
    expect(
      isValidDateRange({
        from: new Date(2026, 1, 1),
        to: new Date(2026, 0, 1),
      }),
    ).toBe(false);
  });

  it("returns false when from and to are the same instant", () => {
    const date = new Date(2026, 0, 1);
    expect(isValidDateRange({ from: date, to: date })).toBe(false);
  });
});

describe("exceedsMaxRange", () => {
  it("returns false for range within 12 months", () => {
    expect(
      exceedsMaxRange({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 11, 31),
      }),
    ).toBe(false);
  });

  it("returns true for range exceeding 12 months", () => {
    expect(
      exceedsMaxRange({
        from: new Date(2025, 0, 1),
        to: new Date(2026, 1, 1),
      }),
    ).toBe(true);
  });

  it("returns false for exactly 12 months", () => {
    expect(
      exceedsMaxRange({
        from: new Date(2025, 0, 1),
        to: new Date(2026, 0, 1),
      }),
    ).toBe(false);
  });
});

describe("isDateInFuture", () => {
  it("returns true for a date in the future", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(isDateInFuture(new Date(2027, 0, 1))).toBe(true);
  });

  it("returns false for a date in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(isDateInFuture(new Date(2025, 0, 1))).toBe(false);
  });

  it("returns false for the current instant", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(isDateInFuture(FIXED_NOW)).toBe(false);
  });
});
