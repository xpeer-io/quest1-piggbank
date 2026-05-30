import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";
import { isWithinInterval } from "date-fns";
import { isValidDateRange } from "./date";

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  if (!isValidDateRange(filters.dateRange)) {
    return [];
  }

  const { from, to } = filters.dateRange;

  return mockTransactions
    .filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: from,
        end: to,
      }),
    )
    // Ordena por data decrescente (mais recentes primeiro)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}

export async function createTransaction(
  data: Omit<Transaction, "id">,
): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...data,
    id: Math.random().toString(36).substring(2, 11),
  };
  mockTransactions.unshift(newTransaction);
  return newTransaction;
}
