"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DateRange } from "@/types";
import {
  formatUrlDate,
  isValidDateRange,
  exceedsMaxRange,
  getDefaultDateRange,
} from "@/lib/date";
import { parseISO, startOfDay, endOfDay, subDays } from "date-fns";

type RouterLike = {
  replace: (url: string) => void;
};

type Props = {
  value?: DateRange;
  onApply?: (range: DateRange) => void;
  router?: RouterLike;
  pathname?: string;
  searchParams?: URLSearchParams;
};

export function DateRangeFilter({ value, onApply, router, pathname, searchParams }: Props) {
  const nextRouter = router ?? useRouter();
  const nextPathname = pathname ?? usePathname();
  const nextSearchParams = searchParams ?? useSearchParams();

  const initial = value ?? getDefaultDateRange();

  const [from, setFrom] = useState(() => formatUrlDate(initial.from));
  const [to, setTo] = useState(() => formatUrlDate(initial.to));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // sync when external value changes
    if (value) {
      setFrom(formatUrlDate(value.from));
      setTo(formatUrlDate(value.to));
    }
  }, [value]);

  function applyRange(useAggregation = false) {
    const fromDate = startOfDay(parseISO(from));
    const toDate = endOfDay(parseISO(to));
    const range: DateRange = { from: fromDate, to: toDate };
    if (!isValidDateRange(range)) {
      setError("Período inválido: verifique as datas");
      return;
    }
    setError(null);
    if (onApply) {
      onApply(range);
      return;
    }

    const params = new URLSearchParams(Object.fromEntries(nextSearchParams?.entries() ?? []));
    params.set("start", formatUrlDate(range.from));
    params.set("end", formatUrlDate(range.to));
    if (useAggregation) params.set("aggregation", "month");
    nextRouter.replace(`${nextPathname}?${params.toString()}`);
  }

  function applyPreset(days: number) {
    const fromDate = startOfDay(subDays(new Date(), days - 1));
    const toDate = endOfDay(new Date());
    setFrom(formatUrlDate(fromDate));
    setTo(formatUrlDate(toDate));
    applyRange();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
        <label className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">De</span>
          <input
            aria-label="start"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-transparent text-sm"
          />
        </label>
        <span className="text-muted-foreground">—</span>
        <label className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">Até</span>
          <input
            aria-label="end"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-transparent text-sm"
          />
        </label>
        <button className="ml-2 rounded bg-primary px-3 py-1 text-sm text-primary-foreground" onClick={() => applyRange()}>
          Aplicar
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-sm text-muted-foreground" onClick={() => applyPreset(7)}>
          7d
        </button>
        <button className="text-sm text-muted-foreground" onClick={() => applyPreset(30)}>
          30d
        </button>
        <button className="text-sm text-muted-foreground" onClick={() => applyPreset(90)}>
          90d
        </button>
      </div>

      {error && <div className="text-xs text-destructive">{error}</div>}

      {exceedsMaxRange({ from: parseISO(from), to: parseISO(to) }) && (
        <div className="ml-2 rounded bg-yellow-100 px-2 py-1 text-xs text-foreground">Intervalo grande — agregação possível</div>
      )}
    </div>
  );
}

export default DateRangeFilter;
