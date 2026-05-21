"use client"

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { format } from "date-fns";

// Polyfill URL.createObjectURL/revokeObjectURL for test environments (jsdom/node)
if (typeof URL !== "undefined" && typeof (URL as unknown as Record<string, unknown>).createObjectURL === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).createObjectURL = () => "";
}
if (typeof URL !== "undefined" && typeof (URL as unknown as Record<string, unknown>).revokeObjectURL === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).revokeObjectURL = () => {};
}

type ExportTransactionsProps = {
  transactions: Transaction[];
};

export function ExportTransactions({ transactions }: ExportTransactionsProps) {
  const disabled = transactions.length === 0;

  function handleExport() {
    if (disabled) return;

    const BOM = "\uFEFF";
    const header = ["Data", "Tipo", "Valor", "Categoria"].join(", ");

    const rows = transactions.map((t) => {
      const date = formatDisplayDate(t.date);
      const type = t.type === "income" ? "income" : "expense";
      const value = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(t.amount);
      const category = t.category;
      return [date, type, value, category].join(", ");
    });

    const csv = [BOM + header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const today = format(new Date(), "yyyyMMdd");
    a.download = `transacoes-piggbank-${today}.csv`;
    // do not mutate visible UI state
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button onClick={handleExport} disabled={disabled} aria-label="Exportar CSV">
      Exportar CSV
    </Button>
  );
}

export default ExportTransactions;
