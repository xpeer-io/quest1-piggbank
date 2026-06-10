"use client";

import { useMemo, useState } from "react";

import { DeleteTransactionDialog } from "@/components/dashboard/DeleteTransactionDialog";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { EditTransactionModal } from "@/components/dashboard/EditTransactionModal";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { parseSerializedDate } from "@/lib/date";
import { computeMetrics } from "@/lib/metrics";
import type { Transaction } from "@/types";

type SerializedTransaction = Omit<Transaction, "date"> & {
  date: string;
};

type DashboardClientProps = {
  initialTransactions: SerializedTransaction[];
};

function hydrateTransaction(transaction: SerializedTransaction): Transaction {
  return {
    ...transaction,
    date: parseSerializedDate(transaction.date),
  };
}

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (first, second) => second.date.getTime() - first.date.getTime(),
  );
}

export function DashboardClient({
  initialTransactions,
}: DashboardClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    sortTransactions(initialTransactions.map(hydrateTransaction)),
  );
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const metrics = useMemo(() => computeMetrics(transactions), [transactions]);

  function handleConfirmDeleteTransaction() {
    if (!deletingTransaction) {
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter((item) => item.id !== deletingTransaction.id),
    );
    setDeletingTransaction(null);
  }

  function handleSaveTransaction(updatedTransaction: Transaction) {
    setTransactions((currentTransactions) =>
      sortTransactions(
        currentTransactions.map((transaction) =>
          transaction.id === updatedTransaction.id
            ? updatedTransaction
            : transaction,
        ),
      ),
    );
    setEditingTransaction(null);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Vis&atilde;o Geral
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              M&eacute;tricas financeiras do per&iacute;odo
            </p>
          </div>
          <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            &Uacute;ltimos 30 dias
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-base font-medium text-foreground">
            Transa&ccedil;&otilde;es recentes
          </h2>
          <TransactionsTable
            transactions={transactions}
            onDeleteTransaction={setDeletingTransaction}
            onEditTransaction={setEditingTransaction}
          />
        </div>
      </main>

      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveTransaction}
      />
      <DeleteTransactionDialog
        transaction={deletingTransaction}
        onCancel={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDeleteTransaction}
      />
    </div>
  );
}
