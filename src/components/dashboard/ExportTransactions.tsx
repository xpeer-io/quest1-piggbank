"use client";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";

interface ExportTransactionsProps {
  transactions: Transaction[];
}

/**
 * Componente que renderiza um botão para exportar as transações em formato CSV.
 */
export function ExportTransactions({ transactions }: ExportTransactionsProps) {
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("Não há transações para exportar");
      return;
    }

    // Cabeçalhos do CSV
    const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    
    // Função auxiliar para escapar valores CSV
    const escapeCSV = (val: string | number) => {
      const stringVal = String(val);
      if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    // Formatação das linhas
    const rows = transactions.map((t) => [
      t.date.toISOString().slice(0, 10),
      escapeCSV(t.description),
      escapeCSV(t.category),
      t.type === "income" ? "Receita" : "Despesa",
      t.amount.toString(),
    ]);

    // Montagem do conteúdo CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Adiciona BOM (Byte Order Mark) para compatibilidade com Excel (UTF-8)
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Criação do link temporário para download
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    link.setAttribute("href", url);
    link.setAttribute("download", `transacoes-piggbank-${dateStr}.csv`);
    link.style.display = "none";
    
    document.body.appendChild(link);
    link.click();
    
    // Limpeza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      Exportar CSV
    </Button>
  );
}
