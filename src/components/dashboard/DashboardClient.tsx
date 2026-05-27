'use client';

import { useState } from "react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { CsvExportButton } from "@/components/dashboard/CsvExportButton";
import { NewTransactionButton } from "@/components/dashboard/NewTransactionButton";
import type { MetricSummary, Transaction } from "@/types";

type DashboardClientProps = {
  metrics: MetricSummary[];
  transactions: Transaction[];
};

export function DashboardClient({
  metrics,
  transactions: initialTransactions,
}: DashboardClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);

  function handleAddTransaction(transaction: Transaction) {
    setTransactions((prev) => [transaction, ...prev]);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Visão Geral
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Métricas financeiras do período
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Últimos 30 dias
          </div>

          <NewTransactionButton onAdd={handleAddTransaction} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-medium text-foreground">
            Transações recentes
          </h2>

          <CsvExportButton transactions={transactions} />
        </div>

        <TransactionsTable transactions={transactions} />
      </div>
    </>
  );
}