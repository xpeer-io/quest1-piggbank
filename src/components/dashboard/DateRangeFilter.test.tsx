import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import DateRangeFilter from "./DateRangeFilter";
import { formatUrlDate } from "@/lib/date";

afterEach(() => cleanup());

describe("DateRangeFilter", () => {
  const defaultRouter = { replace: vi.fn() };
  const defaultSearchParams = new URLSearchParams();

  it("renders inputs and presets", () => {
    render(<DateRangeFilter router={defaultRouter} pathname="/dashboard" searchParams={defaultSearchParams} />);
    expect(screen.getByLabelText("start")).toBeTruthy();
    expect(screen.getByLabelText("end")).toBeTruthy();
    expect(screen.getByText("7d")).toBeTruthy();
    expect(screen.getByText("30d")).toBeTruthy();
  });

  it("calls onApply with correct DateRange when Aplicar is clicked", () => {
    const onApply = vi.fn();
    const { container } = render(
      <DateRangeFilter
        onApply={onApply}
        router={defaultRouter}
        pathname="/dashboard"
        searchParams={defaultSearchParams}
      />
    );

    const inputs = container.querySelectorAll('input[aria-label="start"], input[aria-label="end"]');
    const start = inputs[0] as HTMLInputElement;
    const end = inputs[1] as HTMLInputElement;

    // set custom range
    fireEvent.change(start, { target: { value: "2026-03-01" } });
    fireEvent.change(end, { target: { value: "2026-03-10" } });

    fireEvent.click(screen.getByText("Aplicar"));

    expect(onApply).toHaveBeenCalled();
    const calledWith = onApply.mock.calls[0][0];
    expect(formatUrlDate(calledWith.from)).toBe("2026-03-01");
    expect(formatUrlDate(calledWith.to)).toBe("2026-03-10");
  });

  it("prevents invalid range (start > end)", () => {
    const onApply = vi.fn();
    const { container } = render(
      <DateRangeFilter
        onApply={onApply}
        router={defaultRouter}
        pathname="/dashboard"
        searchParams={defaultSearchParams}
      />
    );
    const inputs = container.querySelectorAll('input[aria-label="start"], input[aria-label="end"]');
    const start = inputs[0] as HTMLInputElement;
    const end = inputs[1] as HTMLInputElement;

    fireEvent.change(start, { target: { value: "2026-04-10" } });
    fireEvent.change(end, { target: { value: "2026-04-01" } });
    fireEvent.click(screen.getByText("Aplicar"));

    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByText(/Período inválido/)).toBeTruthy();
  });
});
