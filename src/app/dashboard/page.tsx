import { getTransactions, getMetrics } from "@/lib/api";
import type { DateRange } from "@/types";
import { getDefaultDateRange } from "@/lib/date";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsDashboard } from "@/components/dashboard/TransactionsDashboard";
import { ExportarTransacoes } from "@/components/dashboard/ExportarTransacoes";

type DashboardPageProps = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const dateRange: DateRange = (params.from && params.to)
    ? { from: new Date(params.from), to: new Date(params.to) }
    : getDefaultDateRange();

  const [metrics, transactions] = await Promise.all([
    getMetrics({ dateRange }),
    getTransactions({ dateRange }),
  ]);

  // CORREÇÃO AQUI: Encontra cada métrica individual dentro da lista (Array) retornada pela API
  const balanceMetric = metrics.find(m => m.label.toLowerCase().includes("saldo")) || { label: "Saldo Atual", value: 0, currency: true };
  const incomeMetric = metrics.find(m => m.label.toLowerCase().includes("receita")) || { label: "Receitas", value: 0, currency: true };
  const expenseMetric = metrics.find(m => m.label.toLowerCase().includes("despesa")) || { label: "Despesas", value: 0, currency: true };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            piggybank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <ExportarTransacoes transactions={transactions} />
            <DateRangeFilter currentRange={dateRange} />
          </div>
        </div>

        {/* Renderiza os cards usando as variáveis corrigidas acima */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricsCard metric={balanceMetric} />
          <MetricsCard metric={incomeMetric} />
          <MetricsCard metric={expenseMetric} />
        </div>

        <TransactionsDashboard initialTransactions={transactions} />
      </main>
    </div>
  );
}
