import type { MetricSummary } from "@/types";

type MetricsCardProps = {
  metric: MetricSummary;
};

export function MetricsCard({ metric }: MetricsCardProps) {
  const formattedValue = metric.currency
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(metric.value)
    : metric.value.toLocaleString("pt-BR");

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {metric.label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {formattedValue}
      </p>
    </div>
  );
}
