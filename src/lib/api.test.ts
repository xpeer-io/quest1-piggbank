import { describe, it, expect } from "vitest";
import { getTransactions, getMetrics } from "./api";
import { mockTransactions } from "@/data/mock";
import { getDefaultDateRange } from "./date";

const filters = { dateRange: getDefaultDateRange() };

describe("getTransactions", () => {
  it("returns all mock transactions", async () => {
    const result = await getTransactions(filters);
    expect(result).toEqual(mockTransactions);
  });

  it("returns an array", async () => {
    const result = await getTransactions(filters);
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
