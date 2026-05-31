import { formatUrlDate, formatFilenameDate } from "@/lib/date";
import type { Transaction } from "@/types";

/**
 * Converte uma lista de transações para uma string formatada em CSV.
 */
export function convertToCSV(transactions: Transaction[]): string {
  const headers = ["Data", "Tipo", "Valor", "Categoria", "Descrição"];
  
  if (transactions.length === 0) {
    return headers.join(",");
  }

  const rows = transactions.map((t) => {
    const date = formatUrlDate(t.date);
    const type = t.type === "income" ? "Entrada" : "Saída";
    const amount = t.amount.toString();
    
    const escape = (val: string) => 
      val.includes(",") || val.includes('"') || val.includes("\n")
        ? `"${val.replace(/"/g, '""')}"`
        : val;

    const category = escape(t.category);
    const description = escape(t.description);

    return [date, type, amount, category, description].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export function generateExportFilename(date: Date): string {
  return `transacoes-piggbank-${formatFilenameDate(date)}.csv`;
}

export function exportTransactionsToCSV(transactions: Transaction[]) {
  const csvContent = convertToCSV(transactions);
  // Adiciona BOM (Byte Order Mark) para garantir UTF-8 no Excel
  const blob = new Blob([`\ufeff${csvContent}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", generateExportFilename(new Date()));
  link.click();
  URL.revokeObjectURL(url);
}