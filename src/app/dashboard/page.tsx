import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getTransactions } from "@/lib/api";
import { getDefaultDateRange, parseUrlDate } from "@/lib/date";
import { endOfDay, startOfDay } from "date-fns";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ start?: string; end?: string }> }) {
  const resolvedSearchParams = await searchParams;
  let dateRange = getDefaultDateRange();
  if (resolvedSearchParams?.start && resolvedSearchParams?.end) {
    try {
      const from = startOfDay(parseUrlDate(resolvedSearchParams.start));
      const to = endOfDay(parseUrlDate(resolvedSearchParams.end));
      dateRange = { from, to };
    } catch (e) {
      dateRange = getDefaultDateRange();
    }
  }
  const filters = { dateRange };
  const transactions = await getTransactions(filters);

  return (
    <DashboardClient
      initialTransactions={transactions}
      initialDateRange={dateRange}
    />
  );
}
