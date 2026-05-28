"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";

type TransactionsTableProps = {
  transactions: Transaction[];
  onAdd: (tx: Transaction) => void;
};

export function TransactionsTable({ transactions, onAdd }: TransactionsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Transações recentes</h2>
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          Nova Transação
        </Button>
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(tx) => {
          onAdd(tx);
        }}
      />

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
                        ? "text-accent"
                        : "text-destructive"
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
