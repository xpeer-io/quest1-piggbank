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

  it("syncs input values when the value prop changes", () => {
    const firstValue = {
      from: new Date(2026, 3, 1),
      to: new Date(2026, 3, 10),
    };
    const secondValue = {
      from: new Date(2026, 4, 1),
      to: new Date(2026, 4, 15),
    };

    const { rerender } = render(
      <DateRangeFilter
        value={firstValue}
        router={defaultRouter}
        pathname="/dashboard"
        searchParams={defaultSearchParams}
      />
    );

    const startInput = screen.getByLabelText("start") as HTMLInputElement;
    const endInput = screen.getByLabelText("end") as HTMLInputElement;

    expect(startInput.value).toBe("2026-04-01");
    expect(endInput.value).toBe("2026-04-10");

    rerender(
      <DateRangeFilter
        value={secondValue}
        router={defaultRouter}
        pathname="/dashboard"
        searchParams={defaultSearchParams}
      />
    );

    expect(startInput.value).toBe("2026-05-01");
    expect(endInput.value).toBe("2026-05-15");
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

    fireEvent.change(start, { target: { value: "2026-03-01" } });
    fireEvent.change(end, { target: { value: "2026-03-10" } });

    fireEvent.click(screen.getByText("Aplicar"));

    expect(onApply).toHaveBeenCalled();
    const calledWith = onApply.mock.calls[0][0];
    expect(formatUrlDate(calledWith.from)).toBe("2026-03-01");
    expect(formatUrlDate(calledWith.to)).toBe("2026-03-10");
  });

  it("replaces the current query when no onApply is provided", () => {
    const replace = vi.fn();
    const searchParams = new URLSearchParams([['foo', 'bar']]);

    const { container } = render(
      <DateRangeFilter
        router={{ replace }}
        pathname="/dashboard"
        searchParams={searchParams}
      />
    );

    const inputs = container.querySelectorAll('input[aria-label="start"], input[aria-label="end"]');
    const start = inputs[0] as HTMLInputElement;
    const end = inputs[1] as HTMLInputElement;

    fireEvent.change(start, { target: { value: "2026-06-01" } });
    fireEvent.change(end, { target: { value: "2026-06-10" } });
    fireEvent.click(screen.getByText("Aplicar"));

    expect(replace).toHaveBeenCalledWith("/dashboard?foo=bar&start=2026-06-01&end=2026-06-10");
  });

  it("shows aggregation suggestion for ranges longer than 12 months", () => {
    const longRange = {
      from: new Date("2024-01-01"),
      to: new Date("2025-03-01"),
    };

    render(
      <DateRangeFilter
        value={longRange}
        router={defaultRouter}
        pathname="/dashboard"
        searchParams={defaultSearchParams}
      />
    );

    expect(screen.getByText(/Intervalo grande — agregação possível/)).toBeTruthy();
  });

  it("uses preset buttons to replace the route with a recent range", () => {
    const replace = vi.fn();

    render(
      <DateRangeFilter
        router={{ replace }}
        pathname="/dashboard"
        searchParams={defaultSearchParams}
      />
    );

    fireEvent.click(screen.getByText("30d"));

    expect(replace).toHaveBeenCalled();
    expect(replace.mock.calls[0][0]).toContain("start=");
    expect(replace.mock.calls[0][0]).toContain("end=");
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
