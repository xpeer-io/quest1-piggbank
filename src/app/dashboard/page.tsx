import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getTransactions } from "@/lib/api";
import { getDefaultDateRange } from "@/lib/date";

export default async function DashboardPage() {
  const filters = { dateRange: getDefaultDateRange() };
  const transactions = await getTransactions(filters);
  const initialTransactions = transactions.map((transaction) => ({
    ...transaction,
    date: transaction.date.toISOString(),
  }));

  return <DashboardClient initialTransactions={initialTransactions} />;
}
