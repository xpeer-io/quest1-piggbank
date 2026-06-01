"use client";

import { useState, useCallback } from "react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { TransactionFormModal, type TransactionFormValues } from "@/components/dashboard/TransactionFormModal";
// Removed CSV export — not part of this branch
import type { MetricSummary, Transaction } from "@/types";

interface DashboardClientProps {
  initialMetrics: MetricSummary[];
  initialTransactions: Transaction[];
}

export function DashboardClient({ initialMetrics, initialTransactions }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  function handleSave(data: Omit<TransactionFormValues, "id">) {
    const newTransaction: Transaction = {
      id: String(Date.now()),
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: new Date(data.date),
      type: data.type,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }

  const handleDelete = useCallback((id: string) => {
    console.log('handleDelete called', id);
    const ok = window.confirm('Tem certeza que deseja excluir esta transação?');
    if (!ok) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleEditClick = useCallback((tx: Transaction) => {
    console.log('handleEditClick called', tx.id);
    setSelectedTransaction(tx);
    setIsEditOpen(true);
  }, []);

  const handleEditSave = useCallback((updated: TransactionFormValues) => {
    if (!updated.id) return;

    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === updated.id
          ? {
              ...transaction,
              description: updated.description,
              amount: updated.amount,
              category: updated.category,
              date: new Date(updated.date),
              type: updated.type,
            }
          : transaction,
      ),
    );
    setIsEditOpen(false);
    setSelectedTransaction(null);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">Métricas financeiras do período</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">Últimos 30 dias</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            + Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 my-4">
        {initialMetrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-base font-medium text-foreground">Transações recentes</h2>
      </div>

      <TransactionsTable transactions={transactions} onEdit={handleEditClick} onDelete={handleDelete} />

      <TransactionFormModal
        isOpen={isModalOpen}
        title="Nova Transação"
        submitLabel="Salvar"
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
      />

      <TransactionFormModal
        isOpen={isEditOpen}
        title="Editar Transação"
        submitLabel="Salvar"
        initialValues={
          selectedTransaction
            ? {
                id: selectedTransaction.id,
                type: selectedTransaction.type,
                amount: Math.abs(selectedTransaction.amount),
                date: selectedTransaction.date.toISOString().slice(0, 10),
                category: selectedTransaction.category,
                description: selectedTransaction.description,
              }
            : undefined
        }
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSave}
      />
    </>
  );
}
