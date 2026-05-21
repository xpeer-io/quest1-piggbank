"use client"

import { useEffect, useState } from "react";
import { DateRangeFilter } from "./DateRangeFilter";
import { MetricsCard } from "./MetricsCard";
import { TransactionsTable } from "./TransactionsTable";
import { NewTransactionModal } from "./NewTransactionModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getDefaultDateRange } from "@/lib/date";
import { getMetrics, getTransactions, persistTransaction } from "@/lib/api";
import { computeMetrics } from "@/lib/metrics";
import type { DateRange, MetricSummary, Transaction } from "@/types";

export function DashboardClient() {
  const [dateRange, setDateRange] = useState<DateRange>(() => getDefaultDateRange());
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [transactionsResult, metricsResult] = await Promise.all([
          getTransactions({ dateRange }),
          getMetrics({ dateRange }),
        ]);

        if (!mounted) {
          return;
        }

        setTransactions(transactionsResult);
        setMetrics(metricsResult);
      } catch {
        if (!mounted) {
          return;
        }

        setLoadError("Não foi possível carregar os dados do período.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">🐷 piggbank</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
            <p className="mt-1 text-sm text-muted-foreground">Métricas financeiras do período</p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button aria-label="Abrir formulário de nova transação">Nova Transação</Button>
              </DialogTrigger>
              {/* The modal content is rendered by NewTransactionModal (it returns DialogContent) */}
              <NewTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(t: Transaction) => {
                  persistTransaction(t);

                  const shouldShowTransaction = t.date >= dateRange.from && t.date <= dateRange.to;
                  const next = shouldShowTransaction ? [t, ...transactions] : transactions;

                  setTransactions(next);
                  setMetrics(computeMetrics(next));
                }}
              />
            </Dialog>
          </div>
        </div>

        {loadError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-4 text-sm text-destructive">
            {loadError}
          </div>
        ) : null}

        <div className="grid grid-cols-4 gap-4">
          {isLoading && metrics.length === 0
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-lg border border-border bg-muted"
                />
              ))
            : metrics.map((metric) => <MetricsCard key={metric.label} metric={metric} />)}
        </div>

        <div>
          <h2 className="mb-4 text-base font-medium text-foreground">Transações recentes</h2>
          {isLoading ? (
            <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
              Carregando transações...
            </div>
          ) : (
            <>
              <TransactionsTable transactions={transactions} />
              {/* modal already rendered above next to the trigger */}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
