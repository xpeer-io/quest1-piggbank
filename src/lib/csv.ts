import type { Transaction } from "@/types";

/**
 * Converte uma lista de transações para o formato CSV.
 * Segue os requisitos: UTF-8, vírgula como separador, data YYYY-MM-DD.
 */
export function formatTransactionsToCSV(transactions: Transaction[]): string {
  const headers = ["Data", "Tipo", "Valor", "Categoria"];
  
  const rows = transactions.map((t) => [
    t.date.toISOString().split("T")[0],
    t.type === "income" ? "Entrada" : "Saída",
    t.amount.toString(),
    t.category || "",
  ]);

  return [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n") + (transactions.length === 0 ? "\n" : "");
}

/**
 * Gera o nome do arquivo para exportação baseado na data atual.
 * Formato: transacoes-piggbank-YYYYMMDD.csv
 */
export function generateExportFilename(date: Date): string {
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
  return `transacoes-piggbank-${dateStr}.csv`;
}
