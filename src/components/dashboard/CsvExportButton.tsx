'use client';

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import {
  exportTransactionsToCSV,
  generateCSVBlob,
  generateCSVContent,
} from "@/lib/csv-export";

type CsvExportButtonProps = {
  transactions: Transaction[];
  onExport?: (csv: string, filename: string) => void;
};

export function CsvExportButton({ transactions, onExport }: CsvExportButtonProps) {
  async function handleExport() {
    const csv = generateCSVContent(transactions);
    const filename = exportTransactionsToCSV(transactions);
    const blob = generateCSVBlob(transactions);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onExport?.(csv, filename);
  }

  return (
    <Button type="button" variant="secondary" onClick={handleExport}>
      Exportar CSV
    </Button>
  );
}
