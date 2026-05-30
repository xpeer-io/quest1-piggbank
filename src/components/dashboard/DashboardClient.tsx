"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import { computeMetrics } from "@/lib/metrics";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

type Props = {
  initialTransactions: Transaction[];
};

export function DashboardClient({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  function handleAdd(tx: Transaction) {
    setTransactions((prev) => [tx, ...prev]);
  }

  function handleUpdate(updated: Transaction) {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const metrics = computeMetrics(transactions);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="mt-6">
        <TransactionsTable
          transactions={transactions}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default DashboardClient;
