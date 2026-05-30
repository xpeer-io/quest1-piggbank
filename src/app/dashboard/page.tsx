"use client"

import { useEffect, useState } from "react";

import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { getTransactions, getMetrics } from "@/lib/api";
import {
  getDefaultDateRange,
  formatDisplayDate,
  isValidDateRange,
  isDateInFuture,
  exceedsMaxRange,
} from "@/lib/date";
import type { DashboardFilters, MetricSummary, Transaction } from "@/types";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: getDefaultDateRange(),
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    async function loadDashboardData() {
      const { dateRange } = filters;

      if (!isValidDateRange(dateRange)) {
        setErrorMessage("A data inicial deve ser anterior ou igual à data final.");
        setStatus("error");
        return;
      }

      if (isDateInFuture(dateRange.from) || isDateInFuture(dateRange.to)) {
        setErrorMessage("Datas futuras não são permitidas.");
        setStatus("error");
        return;
      }

      if (exceedsMaxRange(dateRange)) {
        setErrorMessage("O período não pode ultrapassar 12 meses.");
        setStatus("error");
        return;
      }

      setStatus("loading");
      setErrorMessage(null);

      try {
        const [transactionsResult, metricsResult] = await Promise.all([
          getTransactions(filters),
          getMetrics(filters),
        ]);

        if (!isSubscribed) {
          return;
        }

        setTransactions(transactionsResult);
        setMetrics(metricsResult);
        setStatus("success");
      } catch {
        if (!isSubscribed) {
          return;
        }

        setErrorMessage("Falha ao carregar dados do dashboard.");
        setStatus("error");
      }
    }

    loadDashboardData();

    return () => {
      isSubscribed = false;
    };
  }, [filters]);

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

        <DateRangeFilter
          dateRange={filters.dateRange}
          onChange={(dateRange) => setFilters({ dateRange })}
          onReset={() => setFilters({ dateRange: getDefaultDateRange() })}
          errorMessage={errorMessage}
        />

        <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          {errorMessage ??
            (status === "loading"
              ? "Carregando dados do dashboard..."
              : `Período: ${formatDisplayDate(filters.dateRange.from)} até ${formatDisplayDate(filters.dateRange.to)}`)}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricsCard key={index} metric={metric} />
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