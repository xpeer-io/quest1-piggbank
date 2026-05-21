import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateRangeFilter } from "./DateRangeFilter";
import { getDefaultDateRange } from "@/lib/date";

describe("DateRangeFilter", () => {
  it("renders the filter buttons", () => {
    render(<DateRangeFilter currentRange={getDefaultDateRange()} />);
    expect(screen.getByText("Data início")).toBeTruthy();
    expect(screen.getByText("até")).toBeTruthy();
    expect(screen.getByText("Data fim")).toBeTruthy();
    expect(screen.getByText("Aplicar")).toBeTruthy();
  });

  it("shows formatted dates when range is provided", () => {
    const range = {
      from: new Date(2026, 4, 1), // May 1, 2026
      to: new Date(2026, 4, 10), // May 10, 2026
    };
    render(<DateRangeFilter currentRange={range} />);
    expect(screen.getByText("01/05/2026")).toBeTruthy();
    expect(screen.getByText("10/05/2026")).toBeTruthy();
  });
});