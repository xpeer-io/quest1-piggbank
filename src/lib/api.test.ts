import { describe, it, expect, afterEach } from "vitest";
import { getTransactions, getMetrics, persistTransaction, resetTransactions } from "./api";
import { mockTransactions } from "@/data/mock";
import { getDefaultDateRange } from "./date";

const filters = { dateRange: getDefaultDateRange() };

afterEach(() => {
  resetTransactions();
});

describe("getTransactions", () => {
  it("returns only the transactions inside the date range", async () => {
    const range = {
      from: new Date("2026-04-01T00:00:00.000Z"),
      to: new Date("2026-04-10T23:59:59.999Z"),
    };

    const results = await getTransactions({ dateRange: range });

    expect(results.every((transaction) => {
      return transaction.date >= range.from && transaction.date <= range.to;
    })).toBe(true);
    expect(results.length).toBeLessThan(mockTransactions.length);
  });

  it("returns an array", async () => {
    const result = await getTransactions(filters);
    expect(Array.isArray(result)).toBe(true);
  });

  it("persists newly added transactions across requests", async () => {
    const newTransaction = {
      id: "99",
      description: "Venda persistente",
      amount: 900,
      type: "income" as const,
      date: new Date("2026-04-06"),
      category: "Vendas",
    };

    persistTransaction(newTransaction);

    const range = {
      from: new Date("2026-04-01T00:00:00.000Z"),
      to: new Date("2026-04-10T23:59:59.999Z"),
    };

    const results = await getTransactions({ dateRange: range });
    expect(results).toContainEqual(newTransaction);
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

  it("derives revenue from filtered transactions", async () => {
    const range = {
      from: new Date("2026-04-01T00:00:00.000Z"),
      to: new Date("2026-04-10T23:59:59.999Z"),
    };

    const transactions = await getTransactions({ dateRange: range });
    const expectedRevenue = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const metrics = await getMetrics({ dateRange: range });
    expect(metrics.find((m) => m.label === "Faturamento")!.value).toBe(expectedRevenue);
  });

  it("derives transaction count from filtered transactions", async () => {
    const range = {
      from: new Date("2026-04-01T00:00:00.000Z"),
      to: new Date("2026-04-10T23:59:59.999Z"),
    };

    const transactions = await getTransactions({ dateRange: range });
    const metrics = await getMetrics({ dateRange: range });
    expect(metrics.find((m) => m.label === "Transações")!.value).toBe(transactions.length);
  });
});
