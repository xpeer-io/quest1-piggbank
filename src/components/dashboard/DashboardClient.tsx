"use client";

import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { NewTransactionModal } from "./NewTransactionModal";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  category: string;
  description: string;
};

type Props = {
  children: React.ReactNode;
};

export function DashboardClient({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  function handleAddTransaction(tx: Transaction) {
    setTransactions((prev) => [tx, ...prev]);
  }

  return (
    <>
      <DashboardHeader onOpenModal={() => setOpen(true)} />

      <NewTransactionModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleAddTransaction}
      />

      {children}
    </>
  );
}