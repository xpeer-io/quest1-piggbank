import { Transaction } from "@/types";
import { formatUrlDate, formatFilenameDate } from "./date";

/**
 * Gera uma string CSV a partir de uma lista de transações.
 * Segue o Cenário 2 e 4 dos requisitos.
 */
export function generateCSV(transactions: Transaction[]): string {
  const headers = ["Data", "Tipo", "Valor", "Categoria"];
  
  const escapeField = (field: string) => {
    const stringField = String(field);
    if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const rows = transactions.map((t) => [
    formatUrlDate(t.date),
    t.type === "income" ? "Entrada" : "Saída",
    t.amount.toString(),
    t.category,
  ]);

  const csvRows = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeField).join(",")),
  ];

  return csvRows.join("\n");
}

/**
 * Exporta transações para um arquivo CSV e inicia o download.
 * Segue o Cenário 1, 3 e 5 dos requisitos.
 */
export function exportarCSV(transactions: Transaction[]): void {
  const csv = generateCSV(transactions);
  
  // Criar o Blob com codificação UTF-8 (Cenário 2)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  const dateStr = formatFilenameDate(new Date());
  
  link.setAttribute("href", url);
  link.setAttribute("download", `transacoes-piggbank-${dateStr}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar a URL para evitar vazamento de memória
  URL.revokeObjectURL(url);
}
