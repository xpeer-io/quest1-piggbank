"use client"

import * as React from "react"
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { Button } from "@/components/ui/button";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const exportCsv = React.useCallback(() => {
    const headers = ["Data", "Tipo", "Valor", "Categoria"]
    const rows = transactions.map((t) => [
      formatDisplayDate(t.date),
      t.type === "income" ? "Entrada" : "Saída",
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(t.amount)),
      t.category,
    ])

    const escapeCell = (cell: unknown) => `"${String(cell).replace(/"/g, '""')}"`
    const csvContent = [headers, ...rows].map((r) => r.map(escapeCell).join(",")).join("\r\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const now = new Date()
    const filename = `transacoes-piggbank-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}.csv`

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(link.href)
  }, [transactions])

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        <Button variant="outline" onClick={exportCsv}>
          Exportar CSV
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhuma transação encontrada para o período selecionado.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Categoria
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-accent/30"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDisplayDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      transaction.type === "income"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Math.abs(transaction.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
