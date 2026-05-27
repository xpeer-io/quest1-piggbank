/**
 * CSV Utilities para Exportação de Transações
 * Módulo centralizador de geração e download de arquivos CSV
 */

/**
 * Formata um valor para saída CSV, escapando caracteres especiais
 * e formatando números com 2 casas decimais
 */
export function formatCsvValue(value: unknown): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }

  const stringValue = String(value);

  // Verifica se precisa escaping (contém vírgula, aspas ou quebra de linha)
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    // Escape aspas internas dobrando-as
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return stringValue;
}

/**
 * Mapeia tipo de transação para formato de exibição
 */
function mapTransactionType(type: "income" | "expense"): string {
  return type === "income" ? "Entrada" : "Saída";
}

/**
 * Formata data para padrão YYYY-MM-DD
 */
function formatDateToUrl(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Interface de Transação
 */
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  category: string;
}

/**
 * Gera conteúdo CSV a partir de transações
 * Formato: Data,Tipo,Valor,Categoria
 */
export function generateCsvContent(transactions: Transaction[]): string {
  const header = "Data,Tipo,Valor,Categoria";

  if (transactions.length === 0) {
    return header;
  }

  const rows = transactions.map((transaction) => {
    const date = formatDateToUrl(transaction.date);
    const type = mapTransactionType(transaction.type);
    const amount = formatCsvValue(transaction.amount);
    const category = formatCsvValue(transaction.category);

    return [date, type, amount, category].join(",");
  });

  return [header, ...rows].join("\n");
}

/**
 * Gera nome de arquivo com data atual
 * Formato: transacoes-piggbank-YYYYMMDD.csv
 */
function generateCsvFilename(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `transacoes-piggbank-${year}${month}${day}.csv`;
}

/**
 * Inicia download de arquivo CSV para transações
 * Cria blob, gera nome com data atual, e inicia download
 */
export function downloadCsv(transactions: Transaction[]): void {
  const csvContent = generateCsvContent(transactions);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", generateCsvFilename());
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
