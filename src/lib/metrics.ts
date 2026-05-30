import type { MetricSummary, Transaction } from "@/types";

export function computeMetrics(transactions: Transaction[]): MetricSummary[] {
  let revenue = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      revenue += t.amount;
    } else if (t.type === "expense") {
      expenses += t.amount;
    }
  });

  return [
    { label: "Faturamento", value: revenue, currency: true },
    { label: "Despesas", value: expenses, currency: true },
    { label: "Lucro Líquido", value: revenue - expenses, currency: true },
    { label: "Transações", value: transactions.length, currency: false },
  ];
}
