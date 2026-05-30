import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  const { from, to } = filters.dateRange;

  return mockTransactions.filter((transaction) => {
    if (transaction.date < from) return false;
    if (transaction.date > to) return false;
    return true;
  });
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
