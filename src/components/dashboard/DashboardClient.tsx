"use client";

import { Suspense, useMemo, useState } from "react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import { computeMetrics } from "@/lib/metrics";
import type { DateRange, Transaction } from "@/types";

type DashboardClientProps = {
  initialTransactions: Transaction[];
  initialDateRange: DateRange;
};

export function DashboardClient({ initialTransactions, initialDateRange }: DashboardClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);

  const metrics = useMemo(() => computeMetrics(transactions), [transactions]);

  function handleAddTransaction(transaction: Transaction) {
    setTransactions((current) => [transaction, ...current]);
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">🐷 piggbank</span>
          <div className="flex items-center gap-3">
            <NewTransactionModal onAddTransaction={handleAddTransaction} />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              BH
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
            <p className="mt-1 text-sm text-muted-foreground">Métricas financeiras do período</p>
          </div>
          <Suspense fallback={<div />}> 
            <DateRangeFilter value={initialDateRange} />
          </Suspense>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.label} metric={metric} />
          ))}
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-medium text-foreground">Transações recentes</h2>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Atualiza em tempo real</span>
          </div>
          <TransactionsTable transactions={transactions} />
        </section>
      </main>
    </div>
  );
}
