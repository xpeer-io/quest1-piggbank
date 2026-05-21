"use client";

import { useState } from "react";

import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

import type { MetricSummary, Transaction } from "@/types";

type DashboardClientProps = {
  metrics: MetricSummary[];
  transactions: Transaction[];
  from: Date;
  to: Date;
};

export function DashboardClient({
  metrics,
  transactions,
  from,
  to,
}: DashboardClientProps) {
  const [transactionList, setTransactionList] =
    useState(transactions);

  function handleAddTransaction(newTransaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }) {
    const transaction: Transaction = {
      id: crypto.randomUUID(),

      description: newTransaction.description,

      amount: newTransaction.amount,

      type: newTransaction.type,

      category: newTransaction.category,

      date: new Date(`${newTransaction.date}T12:00:00`),
    };

    setTransactionList((prev) => [
      transaction,
      ...prev,
    ]);
  }

  const income = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const expense = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const balance = income - expense;

 const updatedMetrics: MetricSummary[] = [
  {
    label: "Receitas",
    value: income,
    currency: true,
  },

  {
    label: "Despesas",
    value: expense,
    currency: true,
  },

  {
    label: "Saldo",
    value: balance,
    currency: true,
  },

  {
    label: "Transações",
    value: transactionList.length,
    currency: false,
  },
];

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

        <div className="flex items-center gap-4">
          <DateRangeFilter from={from} to={to} />

          <NewTransactionModal
            onSubmit={handleAddTransaction}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {updatedMetrics.map((metric) => (
          <MetricsCard
            key={metric.label}
            metric={metric}
          />
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-base font-medium text-foreground">
          Transações recentes
        </h2>

        <TransactionsTable
          transactions={transactionList}
        />
      </div>
    </>
  );
}