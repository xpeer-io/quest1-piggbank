"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDisplayDate, isValidDateRange, exceedsMaxRange, isDateInFuture, formatUrlDate } from "@/lib/date";
import type { DateRange } from "@/types";

type DateRangeFilterProps = {
  currentRange: DateRange;
};

export function DateRangeFilter({ currentRange }: DateRangeFilterProps) {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Date | undefined>(currentRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(currentRange?.to);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    setError(null);

    if (!fromDate || !toDate) {
      setError("Selecione ambas as datas");
      return;
    }

    const range: DateRange = { from: fromDate, to: toDate };

    if (!isValidDateRange(range)) {
      setError("Data início deve ser anterior à data fim");
      return;
    }

    if (exceedsMaxRange(range)) {
      setError("Intervalo máximo é de 12 meses");
      return;
    }

    if (isDateInFuture(fromDate) || isDateInFuture(toDate)) {
      setError("Datas futuras não são permitidas");
      return;
    }

    setFromOpen(false);
    setToOpen(false);

    const params = new URLSearchParams();
    params.set("from", formatUrlDate(fromDate));
    params.set("to", formatUrlDate(toDate));

    const pathname = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setError(null);
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
    router.push(pathname);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          {/* Removido o asChild e o <Button> duplicado daqui */}
          <PopoverTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-3">
            {fromDate ? formatDisplayDate(fromDate) : "Data início"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                setFromDate(date);
                setFromOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground text-sm px-1">até</span>

        <Popover open={toOpen} onOpenChange={setToOpen}>
          {/* Removido o asChild e o <Button> duplicado daqui também */}
          <PopoverTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-3">
            {toDate ? formatDisplayDate(toDate) : "Data fim"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                setToDate(date);
                setToOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleApply} size="sm">
        Aplicar
      </Button>

      <Button variant="ghost" onClick={handleClear} size="sm">
        Limpar
      </Button>

      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  );
}
