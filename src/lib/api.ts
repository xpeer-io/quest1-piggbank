import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import { isWithinInterval } from "date-fns";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  // Filter transactions by date range
    return mockTransactions.filter((transaction) => {
    const range = filters?.dateRange;
    
    if (!range?.from || !range?.to) return true;

    return isWithinInterval(new Date(transaction.date), { 
      start: range.from, 
      end: range.to 
    });
  });


}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
