"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTransactionsToCSV } from "@/lib/csv/exportTransactions";
import type { Transaction } from "@/types";

interface ExportButtonProps {
  transactions: Transaction[];
}

export function ExportButton({ transactions }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 border-border hover:bg-muted"
      onClick={() => exportTransactionsToCSV(transactions)}
    >
      <Download className="mr-2 h-3.5 w-3.5" />
      Exportar CSV
    </Button>
  );
}