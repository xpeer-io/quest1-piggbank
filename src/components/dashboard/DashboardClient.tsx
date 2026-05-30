"use client";

import { useState } from "react";
import { ExportarTransacoes } from './ExportarTransacoes';
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
// 🚀 Importando os novos componentes isolados
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { ConfirmDeleteModal } from "@/components/dashboard/ConfirmDeleteModal";

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
  const [transactionList, setTransactionList] = useState(transactions);

  // ✨ Estados limpos e centralizados (Reduzido de 8 para apenas 3!)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // 📝 Função unificada que resolve tanto a CRIAÇÃO quanto a EDIÇÃO
  function handleSaveTransaction(data: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }) {
    if (selectedTransaction) {
      // MODO EDIÇÃO: Atualiza o item existente na lista
      setTransactionList((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id
            ? {
                ...t,
                description: data.description,
                amount: data.amount,
                type: data.type,
                category: data.category,
                date: new Date(`${data.date}T12:00:00`),
              }
            : t
        )
      );
    } else {
      // MODO CRIAÇÃO: Adiciona um novo item com ID único
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: new Date(`${data.date}T12:00:00`),
      };
      setTransactionList((prev) => [newTransaction, ...prev]);
    }
  }

  // 🗑️ Função de exclusão confirmada
  function handleDeleteConfirm() {
    if (!selectedTransaction) return;
    setTransactionList((prev) => prev.filter((t) => t.id !== selectedTransaction.id));
    setIsDeleteModalOpen(false);
  }

  // Cálculos de métricas mantidos idênticos
  const income = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expense;

  const updatedMetrics: MetricSummary[] = [
    { label: "Receitas", value: income, currency: true },
    { label: "Despesas", value: expense, currency: true },
    { label: "Saldo", value: balance, currency: true },
    { label: "Transações", value: transactionList.length, currency: false },
  ];

  const transacoesFormatadasParaCSV = transactionList.map((t) => ({
    data: t.date instanceof Date 
      ? t.date.toISOString().split('T')[0] 
      : new Date(t.date).toISOString().split('T')[0],
    tipo: t.type === "income" ? ("Entrada" as const) : ("Saída" as const),
    valor: t.amount,
    categoria: t.category,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">Métricas financeiras do período</p>
        </div>

        <div className="flex items-center gap-4">
          <DateRangeFilter from={from} to={to} />
          <ExportarTransacoes transacoes={transacoesFormatadasParaCSV} />
          
          {/* ⚡ Botão de nova transação agora usa o modal unificado! */}
          <button
            onClick={() => {
              setSelectedTransaction(null); // Garante que entra em modo criação
              setIsTransactionModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {updatedMetrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-base font-medium text-foreground">Transações recentes</h2>
        <TransactionsTable 
          transactions={transactionList} 
          onEdit={(t) => {
            setSelectedTransaction(t); // Passa a transação clicada para o estado
            setIsTransactionModalOpen(true);
          }}
          onDelete={(t) => {
            setSelectedTransaction(t);
            setIsDeleteModalOpen(true);
          }}
        />
      </div>

      {/* ======================================================= */}
      {/* 🏗️ COMPONENTES REFATORADOS E REUTILIZÁVEIS              */}
      {/* ======================================================= */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleSaveTransaction}
        transactionToEdit={selectedTransaction}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        transaction={selectedTransaction}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}