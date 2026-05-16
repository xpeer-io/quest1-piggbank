"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import { formatTransactionsToCSV, generateExportFilename } from "@/lib/csv";

interface ExportCSVProps {
  transactions: Transaction[];
}

export function ExportCSV({ transactions }: ExportCSVProps) {
  const handleExport = () => {
    try {
      // 1. Formatar conteúdo CSV via utility
      const csvContent = formatTransactionsToCSV(transactions);

      // 2. Criar Blob e URL
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // 3. Trigger download
      const link = document.createElement("a");
      const filename = generateExportFilename(new Date());
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 4. Limpar URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Ocorreu um erro ao gerar o arquivo CSV. Por favor, tente novamente.");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
      <Download className="size-4" />
      Exportar CSV
    </Button>
  );
}
