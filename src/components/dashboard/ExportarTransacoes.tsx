"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateCSV } from "@/lib/csv";
import type { Transaction } from "@/types";

type ExportarTransacoesProps = {
  transactions: Transaction[];
};

export function ExportarTransacoes({ transactions }: ExportarTransacoesProps) {
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    try {
      const csvContent = generateCSV(transactions);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const fileName = `transacoes-piggbank-${year}${month}${day}.csv`;

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Ocorreu um erro ao gerar o arquivo CSV. Por favor, tente novamente.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleExport}
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
