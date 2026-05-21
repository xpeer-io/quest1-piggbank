/**
 * CSV Generation Utility for Piggbank
 * 
 * This module handles the conversion of transaction data into CSV format
 * following the specific requirements: UTF-8 encoding, comma separation,
 * and ISO date formatting (YYYY-MM-DD).
 */

import type { Transaction } from "@/types";

/**
 * Converts an array of Transactions into a CSV string.
 * Includes headers: Data, Tipo, Valor, Categoria.
 * 
 * @param transactions - List of transactions to be exported.
 * @returns A formatted CSV string.
 */
export function formatTransactionsToCSV(transactions: Transaction[]): string {
  const CSV_HEADERS = ["Data", "Tipo", "Valor", "Categoria"];
  
  const csvRows = transactions.map((t) => {
    const formattedDate = t.date.toISOString().split("T")[0];
    const typeLabel = t.type === "income" ? "Entrada" : "Saída";
    const amountStr = t.amount.toString();
    const categoryName = t.category || "";
    
    return [formattedDate, typeLabel, amountStr, categoryName].join(",");
  });

  // Combine headers and rows with newline character
  const content = [CSV_HEADERS.join(","), ...csvRows].join("\n");
  
  // Ensure a final newline if the list is empty for standard compliance
  return transactions.length === 0 ? content + "\n" : content;
}

/**
 * Generates a standard export filename using the current timestamp.
 * Example: transacoes-piggbank-20260516.csv
 * 
 * @param date - The date to be used in the filename.
 * @returns A string representing the filename.
 */
export function generateExportFilename(date: Date): string {
  const timestamp = date.toISOString().split("T")[0].replace(/-/g, "");
  return `export-piggbank-${timestamp}.csv`;
}
