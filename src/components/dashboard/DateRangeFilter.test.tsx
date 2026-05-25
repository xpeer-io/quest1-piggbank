import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DateRangeFilter } from "./DateRangeFilter";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("DateRangeFilter", () => {
  const defaultProps = {
    defaultFrom: "2026-04-25",
    defaultTo: "2026-05-25",
  };

  // Garantir cleanup entre testes
  afterEach(() => {
    cleanup();
  });

  it("renders date inputs with default values", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const fromInput = screen.getByLabelText("De") as HTMLInputElement;
    const toInput = screen.getByLabelText("Até") as HTMLInputElement;

    expect(fromInput.value).toBe("2026-04-25");
    expect(toInput.value).toBe("2026-05-25");
  });

  it("renders Aplicar and Limpar buttons", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const applyButton = screen.getByRole("button", { name: /aplicar/i });
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    expect(applyButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it("shows error when from > to", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const fromInput = screen.getByLabelText("De") as HTMLInputElement;
    const toInput = screen.getByLabelText("Até") as HTMLInputElement;
    const applyButton = screen.getByRole("button", { name: /aplicar/i });

    fireEvent.change(fromInput, { target: { value: "2026-05-25" } });
    fireEvent.change(toInput, { target: { value: "2026-04-25" } });
    fireEvent.click(applyButton);

    expect(
      screen.getByText("Data início deve ser anterior à data fim.")
    ).toBeInTheDocument();
  });

  it("shows error when interval exceeds 12 months", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const fromInput = screen.getByLabelText("De") as HTMLInputElement;
    const toInput = screen.getByLabelText("Até") as HTMLInputElement;
    const applyButton = screen.getByRole("button", { name: /aplicar/i });

    fireEvent.change(fromInput, { target: { value: "2025-01-01" } });
    fireEvent.change(toInput, { target: { value: "2026-05-25" } });
    fireEvent.click(applyButton);

    expect(
      screen.getByText("Intervalo máximo permitido é de 12 meses.")
    ).toBeInTheDocument();
  });

  it("allows clearing the filter", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    expect(clearButton).toBeInTheDocument();
  });
});
