import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { DateRangePicker } from "./DateRangePicker";
import { getMetrics, getTransactions } from "@/lib/api";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { 
  getDefaultDateRange, 
  parseUrlDate, 
  isValidDateRange, 
  startOfDay, 
  endOfDay 
} from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function DashboardPage(props: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const searchParams = await props.searchParams;
  const fromParam = parseUrlDate(searchParams.from ?? null);
  const toParam = parseUrlDate(searchParams.to ?? null);

  let dateRange = getDefaultDateRange();

  if (fromParam && toParam && isValidDateRange({ from: fromParam, to: toParam })) {
    dateRange = {
      from: startOfDay(fromParam),
      to: endOfDay(toParam),
    };
  }

  const filters = { dateRange };
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
          <div className="flex items-center gap-3">
            <DateRangePicker />
            <NewTransactionModal />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              Transações recentes
            </h2>
            <ExportButton transactions={transactions} />
          </div>
          <TransactionsTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
