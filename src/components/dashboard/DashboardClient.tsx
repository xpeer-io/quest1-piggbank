'use client';

import { useState } from 'react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { TransactionModal } from '@/components/dashboard/TransactionModal';
import { Button } from '@/components/ui/button';
import { exportarCSV } from '@/lib/csv';
import type { Metric, Transaction } from '@/types';

interface DashboardClientProps {
  initialMetrics: Metric[];
  initialTransactions: Transaction[];
}

export function DashboardClient({ initialMetrics, initialTransactions }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  function handleSave(data: {
    type: 'income' | 'expense';
    amount: number;
    date: string;
    category: string;
    description: string;
  }) {
    const newTransaction: Transaction = {
      id: String(Date.now()),
      description: data.description,
      amount: data.type === 'expense' ? -data.amount : data.amount,
      category: data.category,
      date: data.date,
      type: data.type,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">Métricas financeiras do período</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Últimos 30 dias
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              background: '#16a34a', color: '#fff', fontWeight: 500,
              fontSize: '14px', cursor: 'pointer'
            }}
          >
            + Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {initialMetrics.map((metric) => (
          <MetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">
          Transações recentes
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportarCSV(transactions)}
        >
          Exportar CSV
        </Button>
      </div>
      <TransactionsTable transactions={transactions} />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}