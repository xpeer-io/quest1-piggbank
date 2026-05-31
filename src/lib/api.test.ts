import { describe, it, expect, vi, afterEach } from "vitest";
import { getTransactions, getMetrics } from "./api";
import { mockTransactions } from "@/data/mock";
import { getDefaultDateRange } from "./date";

afterEach(() => {
  vi.useRealTimers();
});

function getDefaultFilters() {
  return { dateRange: getDefaultDateRange() };
}

describe("getTransactions", () => {
  it("returns all mock transactions when the default range covers the dataset", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 11));

    const filters = getDefaultFilters();
    const result = await getTransactions(filters);

    expect(result).toEqual(mockTransactions);
  });

  it("returns an array", async () => {
    const filters = getDefaultFilters();
    const result = await getTransactions(filters);
    expect(Array.isArray(result)).toBe(true);
  });

  it("filters transactions by date range", async () => {
    const filtered = await getTransactions({
      dateRange: {
        from: new Date(2026, 2, 24),
        to: new Date(2026, 2, 28, 23, 59, 59),
      },
    });

    expect(filtered).toHaveLength(2);
    expect(filtered.map((transaction) => transaction.id)).toEqual(["5", "6"]);
  });
});

describe("getMetrics", () => {
  it("returns 4 metrics", async () => {
    const result = await getMetrics(getDefaultFilters());
    expect(result).toHaveLength(4);
  });

  it("returns metrics with expected labels", async () => {
    const result = await getMetrics(getDefaultFilters());
    const labels = result.map((m) => m.label);
    expect(labels).toContain("Faturamento");
    expect(labels).toContain("Despesas");
    expect(labels).toContain("Lucro Líquido");
    expect(labels).toContain("Transações");
  });

  it("derives revenue from transactions", async () => {
    const transactions = await getTransactions(getDefaultFilters());
    const expectedRevenue = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const metrics = await getMetrics(getDefaultFilters());
    expect(metrics.find((m) => m.label === "Faturamento")!.value).toBe(expectedRevenue);
  });

  it("derives transaction count from transactions", async () => {
    const transactions = await getTransactions(getDefaultFilters());
    const metrics = await getMetrics(getDefaultFilters());
    expect(metrics.find((m) => m.label === "Transações")!.value).toBe(transactions.length);
  });
});
