"use client";

import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function TransactionActions({ onEdit, onDelete }: TransactionActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onEdit}
        title="Editar"
        aria-label="Editar"
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onDelete}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        title="Excluir"
        aria-label="Excluir"
      >
        <Trash2 />
      </Button>
    </div>
  );
}

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === "income";

  return (
    <tr className="transition-colors hover:bg-accent/30">
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
        className={cn(
          "px-4 py-3 text-right font-medium",
          isIncome ? "text-emerald-400" : "text-red-400"
        )}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(Math.abs(transaction.amount))}
      </td>
      <td className="px-4 py-3 text-center">
        <TransactionActions 
          onEdit={() => onEdit(transaction.id)} 
          onDelete={() => onDelete(transaction.id)} 
        />
      </td>
    </tr>
  );
}

type TransactionsTableProps = {
  transactions: Transaction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
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
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit ?? (() => {})}
              onDelete={onDelete ?? (() => {})}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
