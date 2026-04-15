import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { getMetrics, getTransactions } from "@/lib/api";
import { getDefaultDateRange } from "@/lib/date";

export default async function DashboardPage() {
  const filters = { dateRange: getDefaultDateRange() };
  const [metrics, transactions] = await Promise.all([
    getMetrics(filters),
    getTransactions(filters),
  ]);
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            🐷 piggbank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Visão Geral
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Métricas financeiras do período
            </p>
          </div>
          {/* TODO: substituir pelo DateRangeFilter — piggbank-142 */}
          <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Últimos 30 dias
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-base font-medium text-foreground">
            Transações recentes
          </h2>
          <TransactionsTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
