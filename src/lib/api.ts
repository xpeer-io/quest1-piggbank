import { isWithinInterval } from "date-fns";
import { mockTransactions } from "@/data/mock";
import { computeMetrics } from "@/lib/metrics";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";

const transactionsStore: Transaction[] = [...mockTransactions];

export function persistTransaction(transaction: Transaction) {
  transactionsStore.unshift(transaction);
}

export function resetTransactions() {
  transactionsStore.splice(0, transactionsStore.length, ...mockTransactions);
}

function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange: DashboardFilters["dateRange"],
) {
  return transactions.filter((transaction) =>
    isWithinInterval(transaction.date, {
      start: dateRange.from,
      end: dateRange.to,
    }),
  );
}

export async function getTransactions(
  filters: DashboardFilters,
): Promise<Transaction[]> {
  return filterTransactionsByDateRange(transactionsStore, filters.dateRange);
}

export async function getMetrics(
  filters: DashboardFilters,
): Promise<MetricSummary[]> {
  const transactions = await getTransactions(filters);
  return computeMetrics(transactions);
}
