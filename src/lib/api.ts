import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";
import { isAfter, isBefore } from "date-fns";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  return mockTransactions.filter((transaction) => {
    const txDate = transaction.date;
    return (
      !isBefore(txDate, filters.dateRange.from) &&
      !isAfter(txDate, filters.dateRange.to)
    );
  });
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
