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
