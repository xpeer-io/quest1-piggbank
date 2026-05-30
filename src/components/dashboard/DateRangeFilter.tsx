"use client"

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import type { DateRange } from "@/types";
import {
  formatDisplayDate,
  formatUrlDate,
  isValidDateRange,
  exceedsMaxRange,
  isDateInFuture,
} from "@/lib/date";

const PRESETS = [
  {
    label: "Últimos 7 dias",
    range: (): DateRange => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Últimos 30 dias",
    range: (): DateRange => ({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Últimos 90 dias",
    range: (): DateRange => ({
      from: startOfDay(subDays(new Date(), 90)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Mês atual",
    range: (): DateRange => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
];

function getRangeError(range: DateRange): string | null {
  if (!isValidDateRange(range)) {
    return "A data inicial deve ser igual ou anterior à data final.";
  }

  if (isDateInFuture(range.from) || isDateInFuture(range.to)) {
    return "Datas futuras não são permitidas.";
  }

  if (exceedsMaxRange(range)) {
    return "O intervalo não pode exceder 12 meses.";
  }

  return null;
}

export function DateRangeFilter({ initialRange }: { initialRange: DateRange }) {
  const [tempRange, setTempRange] = useState<DateRange>(initialRange);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setTempRange(initialRange);
  }, [initialRange]);

  const presets = useMemo(
    () => PRESETS.map((preset) => ({ label: preset.label, range: preset.range() })),
    [],
  );

  const errorMessage = getRangeError(tempRange);
  const canApply = !errorMessage;

  const displayLabel = `${formatDisplayDate(initialRange.from)} - ${formatDisplayDate(
    initialRange.to,
  )}`;

  const applyRange = async () => {
    if (!canApply) {
      return;
    }

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("from", formatUrlDate(tempRange.from));
    params.set("to", formatUrlDate(tempRange.to));

    const nextUrl = `${pathname}?${params.toString()}`;
    await router.replace(nextUrl);
    setIsOpen(false);
  };

  const cancelSelection = () => {
    setTempRange(initialRange);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
        <CalendarIcon className="size-4" />
        {displayLabel}
        <ChevronDown className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="w-[min(420px,100vw)] space-y-4 p-4" side="bottom" align="end">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => setTempRange(preset.range)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Data inicial
              </p>
              <CalendarComponent
                mode="single"
                selected={tempRange.from}
                onSelect={(date) => date && setTempRange({ ...tempRange, from: startOfDay(date) })}
                disabled={(date) => date > tempRange.to || isDateInFuture(date)}
                showOutsideDays={false}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Data final
              </p>
              <CalendarComponent
                mode="single"
                selected={tempRange.to}
                onSelect={(date) => date && setTempRange({ ...tempRange, to: endOfDay(date) })}
                disabled={(date) => date < tempRange.from || isDateInFuture(date)}
                showOutsideDays={false}
              />
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancelSelection}>
              Cancelar
            </Button>
            <Button variant="default" size="sm" onClick={applyRange} disabled={!canApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
