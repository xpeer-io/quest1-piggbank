"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import { formatTransactionsToCSV, generateExportFilename } from "@/lib/csv";

interface ExportCSVProps {
  transactions: Transaction[];
}

export function ExportCSV({ transactions }: ExportCSVProps) {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Orchestrates the CSV export process:
   * 1. Sets loading state
   * 2. Formats data
   * 3. Triggers browser download
   * 4. Cleans up resources
   */
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Visual feedback delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const csvData = formatTransactionsToCSV(transactions);
      const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const downloadUrl = URL.createObjectURL(csvBlob);

      const downloadLink = document.createElement("a");
      const fileName = generateExportFilename(new Date());
      
      downloadLink.setAttribute("href", downloadUrl);
      downloadLink.setAttribute("download", fileName);
      downloadLink.style.display = "none";
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Erro ao exportar: Não foi possível gerar o arquivo CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport} 
      className="gap-2"
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      {isExporting ? "Exportando..." : "Exportar CSV"}
    </Button>
  );
}
