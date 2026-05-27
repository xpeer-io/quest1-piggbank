import { formatUrlDate } from "./date";
import type { Transaction } from "@/types";

/**
 * Formata um valor para CSV, tratando vírgulas, aspas e números.
 * @param value Valor a ser formatado
 * @returns String formatada para CSV
 */
export function formatCsvValue(value: string | number | Date): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }

  if (value instanceof Date) {
    return formatUrlDate(value);
  }

  let stringValue = String(value);

  // Escapa aspas duplas (dobrando-as)
  if (stringValue.includes('"')) {
    stringValue = stringValue.replace(/"/g, '""');
  }

  // Se contém vírgula, aspas ou quebra de linha, envolve em aspas
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue}"`;
  }

  return stringValue;
}

/**
 * Gera o conteúdo de um arquivo CSV a partir de uma lista de transações.
 * @param transactions Lista de transações
 * @returns String contendo o CSV completo
 */
export function generateCsvContent(transactions: Transaction[]): string {
  const header = "Data,Tipo,Valor,Categoria";
  
  const rows = transactions.map((t) => {
    const date = formatCsvValue(t.date);
    const type = t.type === "income" ? "Entrada" : "Saída";
    const amount = formatCsvValue(t.amount);
    const category = formatCsvValue(t.category);

    return `${date},${type},${amount},${category}`;
  });

  return [header, ...rows].join("\n");
}

/**
 * Dispara o download de um arquivo CSV no navegador.
 * Inclui o BOM (Byte Order Mark) UTF-8 para garantir compatibilidade com o Excel.
 * @param content Conteúdo do CSV
 * @param filename Nome do arquivo
 */
export function downloadCsv(content: string, filename: string): void {
  // \uFEFF é o BOM (Byte Order Mark) para UTF-8, ajudando o Excel a reconhecer a codificação
  const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
