"use client";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";

interface ExportCsvButtonProps {
  transactions: Transaction[];
}

export function ExportCsvButton({
  transactions,
}: ExportCsvButtonProps) {
  const handleExport = () => {
    const headers = ["Data", "Tipo", "Valor", "Categoria"];

    const rows = transactions.map((transaction) => [
      transaction.date.toISOString().split("T")[0],
      transaction.type === "income" ? "Entrada" : "Saída",
      transaction.amount,
      transaction.category,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const today = new Date()
      .toISOString()
      .split("T")[0]
      .replaceAll("-", "");

    link.href = url;
    link.download = `transacoes-piggbank-${today}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      Exportar CSV
    </Button>
  );
}