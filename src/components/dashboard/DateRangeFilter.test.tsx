import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DateRangeFilter } from "./DateRangeFilter";
import type { DateRange } from "@/types";

afterEach(cleanup);

const dateRange: DateRange = {
  from: new Date(2026, 3, 1),
  to: new Date(2026, 3, 30, 23, 59, 59, 999),
};

describe("DateRangeFilter", () => {
  it("renders date inputs with the provided range", () => {
    render(<DateRangeFilter dateRange={dateRange} onChange={vi.fn()} />);

    expect((screen.getByLabelText("Data inicial") as HTMLInputElement).value).toBe(
      "2026-04-01",
    );
    expect((screen.getByLabelText("Data final") as HTMLInputElement).value).toBe(
      "2026-04-30",
    );
  });

  it("calls onChange when the initial date changes", () => {
    const handleChange = vi.fn();
    render(<DateRangeFilter dateRange={dateRange} onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText("Data inicial"), {
      target: { value: "2026-04-05" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const nextDateRange = handleChange.mock.calls[0][0] as DateRange;
    expect(nextDateRange.from.getFullYear()).toBe(2026);
    expect(nextDateRange.from.getMonth()).toBe(3);
    expect(nextDateRange.from.getDate()).toBe(5);
    expect(nextDateRange.to.getDate()).toBe(30);
  });

  it("renders an error message when errorMessage is provided", () => {
    render(
      <DateRangeFilter
        dateRange={dateRange}
        onChange={vi.fn()}
        errorMessage="Data inválida"
      />,
    );

    expect(screen.getByText("Data inválida")).toBeTruthy();
  });

  it("calls onReset when the clear filter button is clicked", () => {
    const handleReset = vi.fn();
    render(
      <DateRangeFilter
        dateRange={dateRange}
        onChange={vi.fn()}
        onReset={handleReset}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Limpar filtro/i }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
