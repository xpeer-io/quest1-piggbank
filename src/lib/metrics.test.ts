import { describe, it, expect } from "vitest";
import { computeMetrics } from "./metrics";
import type { Transaction } from "@/types";

const income = (amount: number): Transaction => ({
  id: "1",
  description: "Test",
  amount,
  type: "income",
  date: new Date("2026-04-01"),
  category: "Test",
});

const expense = (amount: number): Transaction => ({
  id: "2",
  description: "Test",
  amount,
  type: "expense",
  date: new Date("2026-04-01"),
  category: "Test",
});

describe("computeMetrics", () => {
  it("returns zero values for empty transactions", () => {
    const metrics = computeMetrics([]);
    const revenue = metrics.find((m) => m.label === "Faturamento")!;
    const expenses = metrics.find((m) => m.label === "Despesas")!;
    const profit = metrics.find((m) => m.label === "Lucro Líquido")!;
    const count = metrics.find((m) => m.label === "Transações")!;

    expect(revenue.value).toBe(0);
    expect(expenses.value).toBe(0);
    expect(profit.value).toBe(0);
    expect(count.value).toBe(0);
  });

  it("sums revenue from income transactions", () => {
    const metrics = computeMetrics([income(1000), income(2500)]);
    expect(metrics.find((m) => m.label === "Faturamento")!.value).toBe(3500);
  });

  it("sums expenses from expense transactions", () => {
    const metrics = computeMetrics([expense(800), expense(1200)]);
    expect(metrics.find((m) => m.label === "Despesas")!.value).toBe(2000);
  });

  it("calculates profit as revenue minus expenses", () => {
    const metrics = computeMetrics([income(5000), expense(3000)]);
    expect(metrics.find((m) => m.label === "Lucro Líquido")!.value).toBe(2000);
  });

  it("calculates negative profit when expenses exceed revenue", () => {
    const metrics = computeMetrics([income(1000), expense(4000)]);
    expect(metrics.find((m) => m.label === "Lucro Líquido")!.value).toBe(-3000);
  });

  it("counts all transactions regardless of type", () => {
    const metrics = computeMetrics([income(1000), expense(500), income(200)]);
    expect(metrics.find((m) => m.label === "Transações")!.value).toBe(3);
  });

  it("marks currency fields correctly", () => {
    const metrics = computeMetrics([]);
    expect(metrics.find((m) => m.label === "Faturamento")!.currency).toBe(true);
    expect(metrics.find((m) => m.label === "Despesas")!.currency).toBe(true);
    expect(metrics.find((m) => m.label === "Lucro Líquido")!.currency).toBe(true);
    expect(metrics.find((m) => m.label === "Transações")!.currency).toBe(false);
  });

  it("returns 4 metrics", () => {
    expect(computeMetrics([])).toHaveLength(4);
  });
});
