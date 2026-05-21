"use client"

import { useState } from "react"

import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { getDefaultDateRange } from "@/lib/date";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false)

  const filters = { dateRange: getDefaultDateRange() };

  const metrics: any[] = [];
  const transactions: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            🐷 piggbank
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Visão Geral Financeira
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Métricas financeiras do período
            </p>
          </div>

          <Button onClick={() => setIsOpen(true)}>
            Nova Transação
          </Button>
        </div>

        <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          Últimos 30 dias
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricsCard key={index} {...metric} />
          ))}
        </div>

        <TransactionsTable transactions={transactions} />

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">
                Nova Transação
              </h2>

              <p className="mb-4 text-sm text-gray-500">
                Modal funcionando ✅
              </p>

              <Button onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}