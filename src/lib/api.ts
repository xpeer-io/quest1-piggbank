import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

export async function getTransactions(
  filters: DashboardFilters
): Promise<Transaction[]> {
  const { from, to } = filters.dateRange;

  return mockTransactions.filter((transaction) => {
    return transaction.date >= from && transaction.date <= to;
  });
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
