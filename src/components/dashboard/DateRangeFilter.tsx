import type { ChangeEvent } from "react";
import type { DateRange } from "@/types";
import { Button } from "@/components/ui/button";
import { formatUrlDate, getDefaultDateRange } from "@/lib/date";
import { parseISO, startOfDay, endOfDay } from "date-fns";

type DateRangeFilterProps = {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  onReset?: () => void;
  errorMessage?: string | null;
};

export function DateRangeFilter({
  dateRange,
  onChange,
  onReset,
  errorMessage,
}: DateRangeFilterProps) {
  const handleDateChange = (field: "from" | "to") => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    if (!value) {
      return;
    }

    const nextRange: DateRange = {
      from:
        field === "from"
          ? startOfDay(parseISO(value))
          : dateRange.from,
      to:
        field === "to"
          ? endOfDay(parseISO(value))
          : dateRange.to,
    };

    onChange(nextRange);
  };

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <label htmlFor="date-range-from" className="flex flex-col gap-2 text-sm text-muted-foreground">
            Data inicial
            <input
              id="date-range-from"
              aria-label="Data inicial"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="date"
              value={formatUrlDate(dateRange.from)}
              onChange={handleDateChange("from")}
            />
          </label>

          <label htmlFor="date-range-to" className="flex flex-col gap-2 text-sm text-muted-foreground">
            Data final
            <input
              id="date-range-to"
              aria-label="Data final"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="date"
              value={formatUrlDate(dateRange.to)}
              onChange={handleDateChange("to")}
            />
          </label>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-sm text-muted-foreground">
            Período personalizado do dashboard.
          </div>
          <Button type="button" variant="secondary" onClick={onReset ?? (() => onChange(getDefaultDateRange()))}>
            Limpar filtro
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
