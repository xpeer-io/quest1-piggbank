import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import { isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  const { from, to } = filters.dateRange;
  const startDate = startOfDay(from);
  const endDate = endOfDay(to);

  return mockTransactions.filter((transaction) => {
    const transactionDate = transaction.date;
    return (
      (isAfter(transactionDate, startDate) ||
        transactionDate.getTime() === startDate.getTime()) &&
      (isBefore(transactionDate, endDate) ||
        transactionDate.getTime() === endDate.getTime())
    );
  });
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
