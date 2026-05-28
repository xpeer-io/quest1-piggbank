'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "./TransactionForm";
import { TransactionDialog } from "./TransactionDialog";
import type { Transaction } from "@/types";

type NewTransactionButtonProps = {
  onAdd: (transaction: Transaction) => void;
};

export function NewTransactionButton({
  onAdd,
}: NewTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(data: any) {
    onAdd({
      id: crypto.randomUUID(),
      description: "Nova transação",
      amount: data.amount,
      date: data.date,
      category: data.category,
      type: data.type,
    });

    setIsOpen(false);
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Nova Transação
      </Button>

      <TransactionDialog
        isOpen={isOpen}
        title="Nova Transação"
        onClose={() => setIsOpen(false)}
      >
        <TransactionForm
          submitLabel="Salvar"
          onCancel={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </TransactionDialog>
    </>
  );
}