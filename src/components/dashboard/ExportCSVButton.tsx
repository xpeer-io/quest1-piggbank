"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Transaction } from "@/types";

interface ExportCSVButtonProps {
  transactions: Transaction[];
}

export function ExportCSVButton({ transactions }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    const headers = ["Data", "Tipo", "Valor", "Categoria"];
    const rows = transactions.map((t) => [
      t.date,
      t.type === "income" ? "Entrada" : "Saída",
      t.amount.toString(),
      t.category,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const fileName = `transacoes-piggbank-${today}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={exportToCSV} className="gap-2">
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
