import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { getTransactions } from "@/lib/api";
import { getDateRangeFromSearchParams, getDefaultDateRange } from "@/lib/date";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[]; to?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const dateRange =
    getDateRangeFromSearchParams(resolvedSearchParams) ?? getDefaultDateRange();
  const filters = { dateRange };
  const transactions = await getTransactions(filters);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            🐷 piggbank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
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
          <DateRangeFilter initialRange={dateRange} />
        </div>

        <DashboardClient 
          key={`${dateRange.from.getTime()}-${dateRange.to.getTime()}`}
          initialTransactions={transactions} 
        />
      </main>
    </div>
  );
}
