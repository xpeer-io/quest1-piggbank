'use client';

import { useState } from "react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { CsvExportButton } from "@/components/dashboard/CsvExportButton";
import { NewTransactionButton } from "@/components/dashboard/NewTransactionButton";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { TransactionForm } from "./TransactionForm";
import { TransactionDialog } from "./TransactionDialog";
import { formatDateToInput } from "@/lib/date";
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

  // DELETE (AGORA USA ID CORRETAMENTE)
  const [deletingTransactionId, setDeletingTransactionId] =
    useState<string | null>(null);

  function confirmDelete() {
    if (!deletingTransactionId) return;

    setTransactions((prev) =>
      prev.filter((t) => t.id !== deletingTransactionId)
    );

    setDeletingTransactionId(null);
  }

  // EDIT
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  function openEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
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

      {/* FILTRO */}
      <DateRangeFilter
        defaultFrom={formatDateToInput(new Date())}
        defaultTo={formatDateToInput(new Date())}
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
          onEdit={openEdit}
          onDelete={(id: string) => setDeletingTransactionId(id)}
        />
      </div>

      {/* EDIT MODAL */}
      <TransactionDialog
        isOpen={!!editingTransaction}
        title="Editar Transação"
        onClose={() => setEditingTransaction(null)}
      >
        {editingTransaction && (
          <TransactionForm
            submitLabel="Salvar alterações"
            initialData={{
              amount: String(editingTransaction.amount),
              date: formatDateToInput(editingTransaction.date),
              category: editingTransaction.category,
              type: editingTransaction.type,
            }}
            onCancel={() => setEditingTransaction(null)}
            onSubmit={(data) => {
              setTransactions((prev) =>
                prev.map((t) =>
                  t.id === editingTransaction.id
                    ? { ...t, ...data }
                    : t
                )
              );

              setEditingTransaction(null);
            }}
          />
        )}
      </TransactionDialog>

      {/* DELETE MODAL (SUBSTITUI CONFIRM) */}
      <TransactionDialog
        isOpen={!!deletingTransactionId}
        title="Excluir Transação"
        onClose={() => setDeletingTransactionId(null)}
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Tem certeza que deseja excluir esta transação?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeletingTransactionId(null)}
              className="text-sm text-muted-foreground"
            >
              Cancelar
            </button>

            <button
              onClick={confirmDelete}
              className="text-sm text-red-400 font-semibold"
            >
              Excluir
            </button>
          </div>
        </div>
      </TransactionDialog>
    </>
  );
}