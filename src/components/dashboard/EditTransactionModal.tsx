"use client";

import type { Transaction } from "@/types";
import { ModalLayout } from "@/components/dashboard/ModalLayout";
import { TransactionForm, type TransactionFormValues } from "@/components/dashboard/TransactionForm";
import { formatDateInputValue } from "@/lib/date";

type EditTransactionModalProps = {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (data: TransactionFormValues) => Promise<void>;
};

export function EditTransactionModal({
  transaction,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  if (!transaction) {
    return null;
  }

  const initialValues: TransactionFormValues = {
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    type: transaction.type,
    date: formatDateInputValue(transaction.date),
  };

  return (
    <ModalLayout open={Boolean(transaction)} title="Editar transação" onClose={onClose}>
      <TransactionForm
        initialValues={initialValues}
        onCancel={onClose}
        onSubmit={onSave}
        submitLabel="Salvar"
      />
    </ModalLayout>
  );
}
