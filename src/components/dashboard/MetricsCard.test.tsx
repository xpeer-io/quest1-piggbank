import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricsCard } from "./MetricsCard";

describe("MetricsCard", () => {
  it("renders the metric label", () => {
    render(<MetricsCard metric={{ label: "Faturamento", value: 1000, currency: true }} />);
    expect(screen.getByText("Faturamento")).toBeTruthy();
  });

  it("formats currency value in BRL", () => {
    render(<MetricsCard metric={{ label: "Faturamento", value: 48200, currency: true }} />);
    expect(screen.getByText(/48\.200/)).toBeTruthy();
  });

  it("renders non-currency value as plain number", () => {
    render(<MetricsCard metric={{ label: "Transações", value: 8, currency: false }} />);
    expect(screen.getByText("8")).toBeTruthy();
  });

  it("does not render currency symbol for non-currency metric", () => {
    const { container } = render(
      <MetricsCard metric={{ label: "Transações", value: 8, currency: false }} />,
    );
    expect(container.textContent).not.toContain("R$");
  });
});
