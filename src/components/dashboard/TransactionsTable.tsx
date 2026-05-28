'use client';

import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";

type TransactionsTableProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
};

export function TransactionsTable({
  transactions,
  onDelete,
  onEdit,
}: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para o período selecionado.
      </div>
    );
  }

  return (
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
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ações
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

              {/* AÇÕES */}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-blue-400 hover:text-blue-300 text-sm mr-3"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}