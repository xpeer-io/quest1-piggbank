"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { generateCsvContent, downloadCsv } from "@/lib/csv";
import type { Transaction } from "@/types";

interface ExportCsvButtonProps {
  transactions: Transaction[];
}

/**
 * Botão para exportar transações em formato CSV.
 * @param transactions Lista de transações a serem exportadas
 */
export function ExportCsvButton({ transactions }: ExportCsvButtonProps) {
  const handleExport = () => {
    if (transactions.length === 0) return;

    const csvContent = generateCsvContent(transactions);
    const dateStr = format(new Date(), "yyyyMMdd");
    const filename = `transacoes-piggbank-${dateStr}.csv`;

    downloadCsv(csvContent, filename);
  };

  const isDisabled = transactions.length === 0;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isDisabled}
      className="flex items-center gap-2"
      aria-label="Exportar todas as transações visíveis em formato CSV"
      title={isDisabled ? "Nenhuma transação para exportar" : "Clique para baixar o arquivo CSV"}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span>Exportar CSV</span>
    </Button>
  );
}
