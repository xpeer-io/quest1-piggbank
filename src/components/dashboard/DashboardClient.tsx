"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { computeMetrics } from "@/lib/metrics";
import type { Transaction } from "@/types";
import { MetricsCard } from "./MetricsCard";
import { NewTransactionModal } from "./NewTransactionModal";
import { TransactionsTable } from "./TransactionsTable";

type SerializedTransaction = Omit<Transaction, "date"> & {
  date: string;
};

type DashboardClientProps = {
  initialTransactions: SerializedTransaction[];
};

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (first, second) => second.date.getTime() - first.date.getTime(),
  );
}

function hydrateTransaction(transaction: SerializedTransaction): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  };
}

export function DashboardClient({
  initialTransactions,
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    sortTransactions(initialTransactions.map(hydrateTransaction)),
  );

  const metrics = useMemo(() => computeMetrics(transactions), [transactions]);

  function handleSaveTransaction(transaction: Transaction) {
    setTransactions((currentTransactions) =>
      sortTransactions([transaction, ...currentTransactions]),
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            piggbank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Vis&atilde;o Geral
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              M&eacute;tricas financeiras do per&iacute;odo
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              &Uacute;ltimos 30 dias
            </div>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>
              Nova Transa&ccedil;&atilde;o
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-base font-medium text-foreground">
            Transa&ccedil;&otilde;es recentes
          </h2>
          <TransactionsTable transactions={transactions} />
        </div>
      </main>

      <NewTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
