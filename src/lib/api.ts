import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

export async function getTransactions(
  _filters: DashboardFilters,
): Promise<Transaction[]> {
  return mockTransactions;
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}

export async function addTransaction(
  transaction: Transaction
): Promise<void> {
  if (typeof window === "undefined") {
    mockTransactions.unshift(transaction);
    return;
  }

  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...transaction,
      date: transaction.date.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar transação");
  }
}