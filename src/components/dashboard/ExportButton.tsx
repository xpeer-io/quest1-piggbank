"use client";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import { formatUrlDate, formatFilenameDate } from "@/lib/date";

type ExportButtonProps = {
  transactions: Transaction[];
};

export function ExportButton({ transactions }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = ["Data", "Tipo", "Valor", "Categoria"];
    
    const rows = transactions.map((t) => [
      formatUrlDate(t.date),
      t.type === "income" ? "Entrada" : "Saída",
      t.amount.toString(),
      t.category,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    const timestamp = formatFilenameDate(new Date());
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transacoes-piggbank-${timestamp}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      variant="outline" 
      onClick={exportToCSV}
      className="gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      Exportar CSV
    </Button>
  );
}
