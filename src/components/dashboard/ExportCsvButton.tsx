"use client";

import { buildExportFilename, transactionsToCsv } from "@/lib/exportTransactions";
import type { Transaction } from "@/types";

interface ExportCsvButtonProps {
  transactions: Transaction[];
}

export function ExportCsvButton({ transactions }: ExportCsvButtonProps) {
  const handleExport = () => {
    const csvContent = transactionsToCsv(transactions);
    const fileName = buildExportFilename();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center justify-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
    >
      Exportar CSV
    </button>
  );
}
