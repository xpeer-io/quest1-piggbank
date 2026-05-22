"use client";

import { useCallback } from "react";
import type { Transaction } from "@/types";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { EditTransactionModal } from "@/components/dashboard/EditTransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import type { SerializedTransaction } from "@/lib/transactionApi";
import type { TransactionFormValues } from "@/components/dashboard/TransactionForm";

type Props = {
  initialTransactions: SerializedTransaction[];
};

export default function TransactionsTableClient({ initialTransactions }: Props) {
  const {
    transactions,
    editingTransaction,
    removeTransaction,
    setEditingTransaction,
    updateTransaction,
  } = useTransactions(initialTransactions);

  const handleEdit = useCallback(
    (transaction: Transaction) => {
      setEditingTransaction(transaction);
    },
    [setEditingTransaction],
  );

  const handleDelete = useCallback(
    async (transaction: Transaction) => {
      const confirmed = window.confirm("Confirmar exclusão desta transação?");
      if (!confirmed) return;

      try {
        await removeTransaction(transaction.id);
      } catch {
        alert("Falha ao excluir transação");
      }
    },
    [removeTransaction],
  );

  const handleSaveEdit = useCallback(
    async (payload: TransactionFormValues) => {
      if (!editingTransaction) return;

      try {
        await updateTransaction(editingTransaction.id, {
          ...payload,
          date: new Date(payload.date).toISOString(),
        });
        setEditingTransaction(null);
      } catch {
        alert("Falha ao atualizar a transação");
      }
    },
    [editingTransaction, updateTransaction],
  );

  return (
    <>
      <TransactionsTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
}

