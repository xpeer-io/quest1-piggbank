"use client";

import { TransactionFormModal, type TransactionFormValues } from "@/components/dashboard/TransactionFormModal";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<TransactionFormValues, "id">) => void;
}

export function TransactionModal({ isOpen, onClose, onSave }: TransactionModalProps) {
  return (
    <TransactionFormModal
      isOpen={isOpen}
      title="Nova Transação"
      submitLabel="Salvar"
      initialValues={{
        type: "income",
        amount: 0,
        date: "",
        category: "",
        description: "",
      }}
      onClose={onClose}
      onSubmit={(values) =>
        onSave({
          type: values.type,
          amount: values.amount,
          date: values.date,
          category: values.category,
          description: values.description,
        })
      }
    />
  );
}
