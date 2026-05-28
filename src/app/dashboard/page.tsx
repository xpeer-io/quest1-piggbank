import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getMetrics, getTransactions } from "@/lib/api";
import { getDefaultDateRange } from "@/lib/date";
import { parse } from "date-fns";

type DashboardPageProps = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const defaultRange = getDefaultDateRange();

  let from = defaultRange.from;
  let to = defaultRange.to;

  if (params.from && params.to) {
    const parsedFrom = parse(params.from, "yyyy-MM-dd", new Date());
    const parsedTo = parse(params.to, "yyyy-MM-dd", new Date());

    if (!isNaN(parsedFrom.getTime()) && !isNaN(parsedTo.getTime())) {
      from = parsedFrom;
      to = parsedTo;
    }
  }

  const filters = { dateRange: { from, to } };

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
        <DashboardClient
          metrics={metrics}
          transactions={transactions}
        />
      </main>
    </div>
  );
}