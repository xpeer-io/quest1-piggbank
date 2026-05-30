"use client";

import { Button } from "@/components/ui/button";
import generateTransactionsCsv from "@/lib/export";
import type { Transaction } from "@/types";

type ExportButtonProps = {
  transactions: Transaction[];
  from?: Date;
  to?: Date;
};

export default function ExportButton({ transactions, from, to }: ExportButtonProps) {
  function handleExport() {
    const { filename, csv } = generateTransactionsCsv(transactions, { from, to });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      Exportar CSV
    </Button>
  );
}
