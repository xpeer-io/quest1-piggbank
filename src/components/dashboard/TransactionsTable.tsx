import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";

"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import { formatDisplayDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { TransactionForm } from "./TransactionForm";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({
  transactions: initialTransactions,
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions,
  );
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete" | null>(
    null,
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleAdd = (data: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
    };
    setTransactions([newTransaction, ...transactions]);
    closeModal();
  };

  const handleEdit = (data: Omit<Transaction, "id">) => {
    if (!selectedTransaction) return;
    const updatedTransactions = transactions.map((t) =>
      t.id === selectedTransaction.id ? { ...t, ...data } : t,
    );
    setTransactions(updatedTransactions);
    closeModal();
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
    closeModal();
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTransaction(null);
  };

  if (transactions.length === 0 && modalMode !== "add") {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setModalMode("add")}>
            <Plus className="mr-2 h-4 w-4" /> Nova Transação
          </Button>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhuma transação encontrada para o período selecionado.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setModalMode("add")}>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Data
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Descrição
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setModalMode("edit");
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-400 hover:text-red-500"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setModalMode("delete");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unified Modal Overlay */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {modalMode === "add" && "Nova Transação"}
                {modalMode === "edit" && "Editar Transação"}
                {modalMode === "delete" && "Confirmar Exclusão"}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalMode === "delete" ? (
              <div className="space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tem certeza que deseja excluir a transação{" "}
                  <span className="font-medium text-foreground">
                    "{selectedTransaction?.description}"
                  </span>
                  ? Esta ação é irreversível e removerá permanentemente o registro.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Excluir Permanentemente
                  </Button>
                </div>
              </div>
            ) : (
              <TransactionForm
                initialData={modalMode === "edit" ? selectedTransaction : null}
                onSubmit={modalMode === "add" ? handleAdd : handleEdit}
                onCancel={closeModal}
                submitLabel={modalMode === "add" ? "Adicionar" : "Salvar Alterações"}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

