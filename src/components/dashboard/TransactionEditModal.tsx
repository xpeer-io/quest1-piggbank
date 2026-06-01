"use client";

import type { Transaction } from "@/types";
import { TransactionFormModal, type TransactionFormValues } from "@/components/dashboard/TransactionFormModal";

interface TransactionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  onSave: (updated: TransactionFormValues & { id: string }) => void;
}

function formatDateInput(date?: Date | string) {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 10);
}

export function TransactionEditModal({ isOpen, onClose, transaction, onSave }: TransactionEditModalProps) {
  return (
    <TransactionFormModal
      isOpen={isOpen}
      title="Editar Transação"
      submitLabel="Salvar"
      initialValues={
        transaction
          ? {
              id: transaction.id,
              type: transaction.type,
              amount: Math.abs(transaction.amount),
              date: formatDateInput(transaction.date),
              category: transaction.category,
              description: transaction.description,
            }
          : undefined
      }
      onClose={onClose}
      onSubmit={(values) => {
        if (!transaction) return;
        onSave({
          id: transaction.id,
          ...values,
        });
      }}
    />
  );
}
