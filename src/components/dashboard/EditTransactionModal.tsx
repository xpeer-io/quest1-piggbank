"use client";

import {
  TransactionFormModal,
  type TransactionFormValues,
} from "@/components/dashboard/TransactionFormModal";
import type { Transaction } from "@/types";

type EditTransactionModalProps = {
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction: Transaction | null;
};

const transactionTypeLabels: Record<Transaction["type"], string> = {
  income: "Entrada",
  expense: "Sa\u00edda",
};

function toUpdatedTransaction(
  transaction: Transaction,
  values: TransactionFormValues,
): Transaction {
  return {
    ...transaction,
    ...values,
    description: `${transactionTypeLabels[values.type]} - ${values.category}`,
  };
}

export function EditTransactionModal({
  onClose,
  onSave,
  transaction,
}: EditTransactionModalProps) {
  if (!transaction) {
    return null;
  }

  return (
    <TransactionFormModal
      description="Atualize tipo, valor, data e categoria da transacao."
      initialValues={{
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
      }}
      open
      title="Editar Transa\u00e7\u00e3o"
      onClose={onClose}
      onSubmit={(values) => onSave(toUpdatedTransaction(transaction, values))}
    />
  );
}
