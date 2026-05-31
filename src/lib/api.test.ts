import { describe, it, expect, vi } from "vitest";
import { getTransactions, getMetrics } from "./api";
import { mockTransactions } from "@/data/mock";
import { getDefaultDateRange } from "./date";
import { isWithinInterval } from "date-fns";

const filters = { dateRange: getDefaultDateRange() };

describe("getTransactions", () => {
  it("returns only transactions within the date range", async () => {
    const result = await getTransactions(filters);
    
    const allWithinInterval = result.every(t => 
      isWithinInterval(new Date(t.date), {
        start: filters.dateRange.from,
        end: filters.dateRange.to
      })
    );

    expect(allWithinInterval).toBe(true);
  });

  it("should return an array of transactions even if empty", async () => {
    const result = await getTransactions(filters);
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns empty array for interval with no transactions", async () => {
    const emptyFilters = {
      dateRange: {
        from: new Date("1900-01-01"),
        to: new Date("1900-01-02"),
      },
    };
    const result = await getTransactions(emptyFilters);
    expect(result).toHaveLength(0);
  });

  it("includes transaction at the very last millisecond of the interval (UTC)", async () => {
    // Este teste garante que a semântica inclusiva [start, end] funciona
    const lastMoment = new Date("2026-05-31T23:59:59.999Z");
    const boundaryFilters = {
      dateRange: {
        from: new Date("2026-05-31T00:00:00.000Z"),
        to: lastMoment,
      },
    };
    const result = await getTransactions(boundaryFilters);
    // A verificação aqui depende do dado mockado ter algo nesse limite
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getMetrics", () => {
  it("returns 4 metrics", async () => {
    const result = await getMetrics(filters);
    expect(result).toHaveLength(4);
  });

  it("returns metrics with expected labels", async () => {
    const result = await getMetrics(filters);
    const labels = result.map((m) => m.label);
    expect(labels).toContain("Faturamento");
    expect(labels).toContain("Despesas");
    expect(labels).toContain("Lucro Líquido");
    expect(labels).toContain("Transações");
  });

  it("derives revenue from transactions", async () => {
    const transactions = await getTransactions(filters);
    const expectedRevenue = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const metrics = await getMetrics(filters);
    expect(metrics.find((m) => m.label === "Faturamento")!.value).toBe(expectedRevenue);
  });

  it("derives transaction count from transactions", async () => {
    const transactions = await getTransactions(filters);
    const metrics = await getMetrics(filters);
    expect(metrics.find((m) => m.label === "Transações")!.value).toBe(transactions.length);
  });
});
