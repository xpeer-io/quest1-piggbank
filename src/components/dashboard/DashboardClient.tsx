'use client';

import { useState } from "react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { CsvExportButton } from "@/components/dashboard/CsvExportButton";
import { NewTransactionButton } from "@/components/dashboard/NewTransactionButton";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import type { MetricSummary, Transaction } from "@/types";

type DashboardClientProps = {
  metrics: MetricSummary[];
  transactions: Transaction[];
};

export function DashboardClient({
  metrics,
  transactions: initialTransactions,
}: DashboardClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);

  // CREATE
  function handleAddTransaction(transaction: Transaction) {
    setTransactions((prev) => [transaction, ...prev]);
  }

  // DELETE
  function handleDeleteTransaction(id: string) {
    const confirmed = confirm(
      "Tem certeza que deseja excluir esta transação?"
    );

    if (!confirmed) return;

    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  }

  // EDIT STATE
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editType, setEditType] = useState<"income" | "expense">("income");

  // abrir edição
  function openEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setEditAmount(String(transaction.amount));
    setEditDate(
      new Date(transaction.date).toISOString().split("T")[0]
    );
    setEditCategory(transaction.category);
    setEditType(transaction.type);
  }

  // salvar edição
  function handleSaveEdit() {
    if (!editingTransaction) return;

    const updated: Transaction = {
      ...editingTransaction,
      amount: Number(editAmount),
      date: new Date(editDate),
      category: editCategory,
      type: editType,
    };

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id ? updated : t
      )
    );

    setEditingTransaction(null);
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Visão Geral
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Métricas financeiras do período
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Últimos 30 dias
          </div>

          <NewTransactionButton onAdd={handleAddTransaction} />
        </div>
      </div>

      {/* 🔥 FILTRO DE DATA (AGORA NO LUGAR CORRETO) */}
      <DateRangeFilter
        defaultFrom={new Date().toISOString().split("T")[0]}
        defaultTo={new Date().toISOString().split("T")[0]}
      />

      {/* MÉTRICAS */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* TABELA */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-medium text-foreground">
            Transações recentes
          </h2>

          <CsvExportButton transactions={transactions} />
        </div>

        <TransactionsTable
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onEdit={openEdit}
        />
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Editar Transação
            </h2>

            <div className="space-y-4">
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />

              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />

              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />

              <select
                value={editType}
                onChange={(e) =>
                  setEditType(e.target.value as "income" | "expense")
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingTransaction(null)}
                  className="text-sm text-red-400"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSaveEdit}
                  className="text-sm text-blue-400"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}