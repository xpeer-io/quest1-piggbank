import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import { startOfDay, endOfDay } from "date-fns";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  const rangeStart = startOfDay(filters.dateRange.from);
  const rangeEnd = endOfDay(filters.dateRange.to);

  return mockTransactions.filter((transaction) => {
    return (
      transaction.date.getTime() >= rangeStart.getTime() &&
      transaction.date.getTime() <= rangeEnd.getTime()
    );
  });
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
