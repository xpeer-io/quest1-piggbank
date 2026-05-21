import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DateRangeFilter } from "./DateRangeFilter";
import { formatUrlDate, getToday } from "@/lib/date";

describe("DateRangeFilter", () => {
  const initialRange = {
    from: new Date(2026, 2, 1),
    to: new Date(2026, 2, 31, 23, 59, 59, 999),
  };

  it("renders start and end date fields with initial values", () => {
    const onChange = vi.fn();

    render(<DateRangeFilter dateRange={initialRange} onChange={onChange} />);

    const startInputs = screen.getAllByLabelText(/data de início/i);
    const endInputs = screen.getAllByLabelText(/data de fim/i);
    const startInput = startInputs[startInputs.length - 1];
    const endInput = endInputs[endInputs.length - 1];

    expect(startInput).toHaveProperty("value", "2026-03-01");
    expect(endInput).toHaveProperty("value", "2026-03-31");
  });

  it("calls onChange when a valid range is provided", () => {
    const onChange = vi.fn();

    render(<DateRangeFilter dateRange={initialRange} onChange={onChange} />);

    const startInputs = screen.getAllByLabelText(/data de início/i);
    const endInputs = screen.getAllByLabelText(/data de fim/i);
    const startInput = startInputs[startInputs.length - 1];
    const endInput = endInputs[endInputs.length - 1];

    fireEvent.change(startInput, {
      target: { value: "2026-03-05" },
    });
    fireEvent.change(endInput, {
      target: { value: "2026-03-10" },
    });

    expect(onChange).toHaveBeenCalled();
    const [range] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(range.from.getFullYear()).toBe(2026);
    expect(range.from.getMonth()).toBe(2);
    expect(range.from.getDate()).toBe(5);
    expect(range.to.getFullYear()).toBe(2026);
    expect(range.to.getMonth()).toBe(2);
    expect(range.to.getDate()).toBe(10);
    expect(range.to.getHours()).toBe(23);
    expect(range.to.getMinutes()).toBe(59);
  });

  it("shows an error for invalid date ranges", () => {
    const onChange = vi.fn();

    render(<DateRangeFilter dateRange={initialRange} onChange={onChange} />);

    const startInputs = screen.getAllByLabelText(/data de início/i);
    const endInputs = screen.getAllByLabelText(/data de fim/i);
    const startInput = startInputs[startInputs.length - 1];
    const endInput = endInputs[endInputs.length - 1];

    fireEvent.change(endInput, {
      target: { value: "2026-03-10" },
    });
    onChange.mockClear();

    fireEvent.change(startInput, {
      target: { value: "2026-03-20" },
    });

    const errorMessage = screen.getByText(/intervalo inválido/i);
    expect(errorMessage).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("prevents selecting future dates", () => {
    const onChange = vi.fn();

    render(<DateRangeFilter dateRange={initialRange} onChange={onChange} />);

    const startInputs = screen.getAllByLabelText(/data de início/i);
    const endInputs = screen.getAllByLabelText(/data de fim/i);
    const startInput = startInputs[startInputs.length - 1];
    const endInput = endInputs[endInputs.length - 1];
    const maxDate = formatUrlDate(getToday());

    expect(startInput.getAttribute("max")).toBe(maxDate);
    expect(endInput.getAttribute("max")).toBe(maxDate);
  });
});
