"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  formatUrlDate,
  getDefaultDateRange,
  getEndOfDay,
  getStartOfDay,
  getToday,
  isDateInFuture,
  isValidDateRange,
  parseUrlDate,
} from "@/lib/date";
import type { DateRange } from "@/types";

type DateRangeFilterProps = {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
};

export function DateRangeFilter({ dateRange, onChange }: DateRangeFilterProps) {
  const [fromValue, setFromValue] = useState(formatUrlDate(dateRange.from));
  const [toValue, setToValue] = useState(formatUrlDate(dateRange.to));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFromValue(formatUrlDate(dateRange.from));
    setToValue(formatUrlDate(dateRange.to));
    setError(null);
  }, [dateRange]);

  const todayValue = formatUrlDate(getToday());

  const handleRangeChange = (nextFrom: string, nextTo: string) => {
    const nextFromDate = parseUrlDate(nextFrom);
    const nextToDate = parseUrlDate(nextTo);

    if (!nextFromDate || !nextToDate) {
      setError("Formato de data inválido");
      return;
    }

    if (isDateInFuture(nextFromDate) || isDateInFuture(nextToDate)) {
      setError("Datas futuras não são permitidas");
      return;
    }

    const proposedRange = {
      from: getStartOfDay(nextFromDate),
      to: getEndOfDay(nextToDate),
    };

    if (!isValidDateRange(proposedRange)) {
      setError("Intervalo inválido");
      return;
    }

    setError(null);
    onChange(proposedRange);
  };

  const handleClear = () => {
    const defaultRange = getDefaultDateRange();
    setFromValue(formatUrlDate(defaultRange.from));
    setToValue(formatUrlDate(defaultRange.to));
    setError(null);
    onChange(defaultRange);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
        <div className="grid gap-2 sm:min-w-[12rem]">
          <label className="grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Início
            </span>
            <input
              aria-label="Data de início"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
              type="date"
              max={todayValue}
              value={fromValue}
              onChange={(event) => {
                const nextValue = event.target.value;
                setFromValue(nextValue);
                handleRangeChange(nextValue, toValue);
              }}
            />
          </label>
        </div>

        <div className="grid gap-2 sm:min-w-[12rem]">
          <label className="grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Fim
            </span>
            <input
              aria-label="Data de fim"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
              type="date"
              max={todayValue}
              value={toValue}
              onChange={(event) => {
                const nextValue = event.target.value;
                setToValue(nextValue);
                handleRangeChange(fromValue, nextValue);
              }}
            />
          </label>
        </div>

        <div className="flex items-center gap-2 self-stretch">
          <Button type="button" variant="outline" onClick={handleClear}>
            Limpar
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
