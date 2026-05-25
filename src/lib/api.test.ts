import { describe, it, expect } from "vitest";
import { getTransactions, getMetrics } from "./api";
import { mockTransactions } from "@/data/mock";
import { getDefaultDateRange } from "./date";
import { startOfDay, endOfDay, subMonths } from "date-fns";
import type { DashboardFilters } from "@/types";

// Filtro que cobre todas as transações mockadas
const allTransactionsFilter: DashboardFilters = {
  dateRange: {
    from: startOfDay(new Date("2026-01-01")),
    to: endOfDay(new Date("2026-12-31")),
  },
};

// Filtro padrão (últimos 30 dias)
const defaultFilters: DashboardFilters = { dateRange: getDefaultDateRange() };

describe("getTransactions", () => {
  it("returns all mock transactions when range covers them", async () => {
    const result = await getTransactions(allTransactionsFilter);
    expect(result).toEqual(mockTransactions);
  });

  it("returns an array", async () => {
    const result = await getTransactions(defaultFilters);
    expect(Array.isArray(result)).toBe(true);
  });

  it("filters transactions by date range", async () => {
    const result = await getTransactions(allTransactionsFilter);
    expect(result.length).toBe(mockTransactions.length);
  });
});

describe("getMetrics", () => {
  it("returns 4 metrics", async () => {
    const result = await getMetrics(allTransactionsFilter);
    expect(result).toHaveLength(4);
  });

  it("returns metrics with expected labels", async () => {
    const result = await getMetrics(allTransactionsFilter);
    const labels = result.map((m) => m.label);
    expect(labels).toContain("Faturamento");
    expect(labels).toContain("Despesas");
    expect(labels).toContain("Lucro Líquido");
    expect(labels).toContain("Transações");
  });

  it("derives revenue from transactions", async () => {
    const transactions = await getTransactions(allTransactionsFilter);
    const expectedRevenue = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const metrics = await getMetrics(allTransactionsFilter);
    expect(metrics.find((m) => m.label === "Faturamento")!.value).toBe(
      expectedRevenue
    );
  });

  it("derives transaction count from transactions", async () => {
    const transactions = await getTransactions(allTransactionsFilter);
    const metrics = await getMetrics(allTransactionsFilter);
    expect(metrics.find((m) => m.label === "Transações")!.value).toBe(
      transactions.length
    );
  });
});
