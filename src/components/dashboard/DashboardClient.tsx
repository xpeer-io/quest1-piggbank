"use client";

import { useState } from "react";
import { ExportarTransacoes } from './ExportarTransacoes';
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
  const [transactionList, setTransactionList] = useState(transactions);

  // 1. Estados adicionados para controle das ações crúas
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Estados temporários para o formulário de edição clonado
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState(0);
  const [editType, setEditType] = useState<"income" | "expense">("income");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");

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

    setTransactionList((prev) => [transaction, ...prev]);
  }

  // 2. Função para abrir o modal salvando os dados atuais nos inputs
  function handleOpenEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount);
    setEditType(transaction.type);
    setEditCategory(transaction.category);
    
    const rawDate = transaction.date instanceof Date ? transaction.date : new Date(transaction.date);
    setEditDate(rawDate.toISOString().split('T')[0]);
    
    setIsEditModalOpen(true);
  }

  // 3. Função para salvar as alterações da Edição
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTransaction) return;

    setTransactionList((prev) =>
      prev.map((t) =>
        t.id === selectedTransaction.id
          ? {
              ...t,
              description: editDescription,
              amount: editAmount,
              type: editType,
              category: editCategory,
              date: new Date(`${editDate}T12:00:00`),
            }
          : t
      )
    );
    setIsEditModalOpen(false);
  }

  // 4. Função para Excluir a transação selecionada
  function handleDeleteConfirm() {
    if (!selectedTransaction) return;
    setTransactionList((prev) => prev.filter((t) => t.id !== selectedTransaction.id));
    setIsDeleteModalOpen(false);
  }

  // Cálculos de métricas idênticos ao seu código
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
          <NewTransactionModal onSubmit={handleAddTransaction} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {updatedMetrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-base font-medium text-foreground">Transações recentes</h2>
        {/* Passamos as novas funções criadas para a tabela aqui */}
        <TransactionsTable 
          transactions={transactionList} 
          onEdit={handleOpenEdit}
          onDelete={(t) => { setSelectedTransaction(t); setIsDeleteModalOpen(true); }}
        />
      </div>

      {/* ======================================================= */}
      {/* 🔴 MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (BRUTO)             */}
      {/* ======================================================= */}
      {isDeleteModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Excluir Transação</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tem certeza que deseja remover permanentemente a transação &quot;{selectedTransaction.description}&quot;?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/80 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 📝 MODAL DE EDIÇÃO DUPLICADO (BRUTO / VIOLANDO DRY)     */}
      {/* ======================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Editar Transação</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Descrição</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tipo</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as "income" | "expense")}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="income">Receita (Entrada)</option>
                    <option value="expense">Despesa (Saída)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Data</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/80 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}