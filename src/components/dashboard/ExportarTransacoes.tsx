"use client"

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";

type ExportarTransacoesProps = {
  transactions: Transaction[];
};

const CSV_HEADER = "Data,Tipo,Valor,Categoria";
const FILE_NAME_PREFIX = "transacoes-piggbank";

const formatTransactionDate = (date: Date | string): string =>
  format(new Date(date), "yyyy-MM-dd");

const formatTransactionType = (type: Transaction["type"]): string =>
  type === "income" ? "Entrada" : "Saída";

const escapeCsvValue = (value: string): string => {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

const buildCsvRow = (transaction: Transaction): string => {
  return [
    formatTransactionDate(transaction.date),
    formatTransactionType(transaction.type),
    transaction.amount.toString(),
    escapeCsvValue(transaction.category),
  ].join(",");
};

const buildCsv = (transactions: Transaction[]): string => {
  const rows = transactions.map(buildCsvRow);
  return [CSV_HEADER, ...rows].join("\r\n") + "\r\n";
};

const buildFileName = (): string =>
  `${FILE_NAME_PREFIX}-${format(new Date(), "yyyyMMdd")}.csv`;

const downloadCsv = (csv: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = buildFileName();
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function ExportarTransacoes({ transactions }: ExportarTransacoesProps) {
  const handleExport = () => {
    const csv = buildCsv(transactions);
    downloadCsv(csv);
  };

  return (
    <Button onClick={handleExport} type="button">
      Exportar CSV
    </Button>
  );
}
