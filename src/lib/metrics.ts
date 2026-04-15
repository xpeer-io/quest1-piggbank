import type { MetricSummary, Transaction } from "@/types";

export function computeMetrics(transactions: Transaction[]): MetricSummary[] {
  const revenue = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return [
    { label: "Faturamento", value: revenue, currency: true },
    { label: "Despesas", value: expenses, currency: true },
    { label: "Lucro Líquido", value: revenue - expenses, currency: true },
    { label: "Transações", value: transactions.length, currency: false },
  ];
}
