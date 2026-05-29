import type { Transaction } from "@/types";

/**
 * Generates a CSV string from an array of transactions.
 * Format: Data (YYYY-MM-DD), Tipo (Entrada/Saída), Valor (número), Categoria, Descrição
 */
export function generateCSV(transactions: Transaction[]): string {
  const headers = ["Data", "Tipo", "Valor", "Categoria", "Descrição"];
  
  const escapeCSV = (val: any): string => {
    const str = String(val ?? "");
    // If it contains quotes, commas, or newlines, wrap in quotes and escape quotes
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((t) => {
    const dateStr = t.date.toISOString().split("T")[0];
    const typeStr = t.type === "income" ? "Entrada" : "Saída";
    
    return [
      dateStr,
      typeStr,
      t.amount,
      escapeCSV(t.category),
      escapeCSV(t.description),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
