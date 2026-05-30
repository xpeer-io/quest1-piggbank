import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardClient } from "./DashboardClient";

vi.mock("@/components/dashboard/DateRangeFilter", () => ({
  DateRangeFilter: () => <div>DateRangeFilter</div>,
}));

vi.mock("@/components/dashboard/ExportarTransacoes", () => ({
  ExportarTransacoes: () => <div>ExportarTransacoes</div>,
}));

vi.mock("@/components/dashboard/NewTransactionModal", () => ({
  NewTransactionModal: () => <div>NewTransactionModal</div>,
}));

vi.mock("@/components/dashboard/MetricsCard", () => ({
  MetricsCard: () => <div>MetricsCard</div>,
}));

vi.mock("@/components/dashboard/TransactionsTable", () => ({
  TransactionsTable: () => <div>TransactionsTable</div>,
}));

describe("DashboardClient", () => {
  it("renderiza dashboard", () => {
    render(
      <DashboardClient
        metrics={[]}
        transactions={[]}
        from={new Date("2026-01-01")}
        to={new Date("2026-01-31")}
      />
    );

    expect(screen.getByText("Visão Geral")).toBeTruthy();
    expect(screen.getByText("Transações recentes")).toBeTruthy();
  });
});