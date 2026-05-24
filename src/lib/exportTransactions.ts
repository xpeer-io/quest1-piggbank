import { format } from "date-fns";
import type { Transaction } from "@/types";

const CSV_HEADERS = ["Data", "Tipo", "Valor", "Categoria"];

export function escapeCsvField(value: string): string {
  if (value.includes("\"") || value.includes(",") || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatExportDate(date: Date): string {
  return format(new Date(date), "yyyy-MM-dd");
}

function formatExportType(type: Transaction["type"]): string {
  return type === "income" ? "Entrada" : "Saída";
}

export function formatTransactionToCsvRow(transaction: Transaction): string {
  const data = formatExportDate(transaction.date);
  const tipo = formatExportType(transaction.type);
  const valor = transaction.amount.toFixed(2);
  const categoria = escapeCsvField(transaction.category);

  return [data, tipo, valor, categoria].join(",");
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = CSV_HEADERS.join(",");
  const rows = transactions.map(formatTransactionToCsvRow);
  return [header, ...rows].join("\r\n") + "\r\n";
}

export function buildExportFilename(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  return `transacoes-piggbank-${date}.csv`;
}
