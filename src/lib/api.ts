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

export async function deleteTransaction(id: string): Promise<void> {
  const index = mockTransactions.findIndex((t) => t.id === id);
  if (index === -1) return;
  mockTransactions.splice(index, 1);
}

export async function updateTransaction(
  id: string,
  data: Partial<Omit<Transaction, "id">>,
): Promise<Transaction | null> {
  const index = mockTransactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = mockTransactions[index];
  const updated: Transaction = {
    ...existing,
    ...data,
    // Ensure date remains a Date instance if provided as string
    date: data.date ? new Date(data.date as unknown as string) : existing.date,
  };

  mockTransactions[index] = updated;
  return updated;
}
