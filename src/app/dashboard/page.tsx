import DashboardClient from "@/components/dashboard/DashboardClient";
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
      <DashboardClient metrics={metrics} initialTransactions={transactions} />
    </div>
  );
}
