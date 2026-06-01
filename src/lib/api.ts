import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";
import { isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  const { dateRange } = filters;

  return mockTransactions.filter((transaction) => {
    const txDate = transaction.date;
    const isAfterOrEqualStart = isAfter(txDate, startOfDay(dateRange.from)) ||
      txDate.getTime() === startOfDay(dateRange.from).getTime();
    const isBeforeOrEqualEnd = isBefore(txDate, endOfDay(dateRange.to)) ||
      txDate.getTime() === endOfDay(dateRange.to).getTime();

    return isAfterOrEqualStart && isBeforeOrEqualEnd;
  });
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
