"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import TransactionFormModal from "@/components/dashboard/TransactionFormModal";

type SerializedTransaction = Omit<Transaction, "date"> & { date: string };

type Props = {
  initialTransactions: SerializedTransaction[];
};

export default function TransactionsTableClient({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [editing, setEditing] = useState<SerializedTransaction | null>(null);

  async function handleDelete(id: string) {
    const ok = window.confirm("Confirmar exclusão desta transação?");
    if (!ok) return;
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTransactions((s) => s.filter((t) => t.id !== id));
    } else {
      alert("Falha ao excluir transação");
    }
  }

  async function handleEdit(id: string) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    setEditing(tx);
  }

  async function handleSaveEdit(payload: Partial<SerializedTransaction>) {
    if (!editing) return;
    const id = editing.id;
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Falha ao atualizar");
      return;
    }

    const json = await res.json();
    const updated = json.transaction;
    setTransactions((s) => s.map((t) => (t.id === id ? { ...t, ...updated, date: new Date(updated.date).toISOString() } : t)));
    setEditing(null);
  }

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
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Descrição</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Categoria</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Valor</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="transition-colors hover:bg-accent/30">
              <td className="px-4 py-3 text-muted-foreground">{formatDisplayDate(new Date(transaction.date))}</td>
              <td className="px-4 py-3 text-foreground">{transaction.description}</td>
              <td className="px-4 py-3">
                <span className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">{transaction.category}</span>
              </td>
              <td className={`px-4 py-3 text-right font-medium ${transaction.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(transaction.amount))}
              </td>
              <td className="px-4 py-3 text-right">
                <button className="mr-2 rounded bg-yellow-500 px-2 py-1 text-xs text-white" onClick={() => handleEdit(transaction.id)}>Editar</button>
                <button className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => handleDelete(transaction.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing ? (
        <TransactionFormModal
          transaction={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      ) : null}
    </div>
  );
}

