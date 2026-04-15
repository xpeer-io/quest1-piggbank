export type DateRange = {
  from: Date;
  to: Date;
};

export type MetricSummary = {
  label: string;
  value: number;
  currency: boolean;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  category: string;
};

export type DashboardFilters = {
  dateRange: DateRange;
};
