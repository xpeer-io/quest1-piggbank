"use client";

import { useState, useEffect } from "react";
import type { Transaction } from "@/types";
import { TransactionsTable } from "./TransactionsTable";

interface TransactionsDashboardProps {
  initialTransactions: Transaction[];
}

export function TransactionsDashboard({ initialTransactions }: TransactionsDashboardProps) {
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleEdit = (id: string) => {
    alert(`Editar transação: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <TransactionsTable 
        transactions={transactions} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
