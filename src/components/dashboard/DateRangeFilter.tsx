"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  formatUrlDate,
  isValidDateRange,
  exceedsMaxRange,
  isDateInFuture,
} from "@/lib/date";
import { parse } from "date-fns";

type DateRangeFilterProps = {
  defaultFrom: string;
  defaultTo: string;
};

export function DateRangeFilter({
  defaultFrom,
  defaultTo,
}: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    setError(null);

    // Parse dates
    const fromDate = parse(from, "yyyy-MM-dd", new Date());
    const toDate = parse(to, "yyyy-MM-dd", new Date());

    // Validation
    if (!isValidDateRange({ from: fromDate, to: toDate })) {
      setError("Data início deve ser anterior à data fim.");
      return;
    }

    if (exceedsMaxRange({ from: fromDate, to: toDate })) {
      setError("Intervalo máximo permitido é de 12 meses.");
      return;
    }

    if (isDateInFuture(toDate)) {
      setError("Data fim não pode ser no futuro.");
      return;
    }

    // Apply filter via query params
    const params = new URLSearchParams(searchParams);
    params.set("from", from);
    params.set("to", to);
    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    router.push("/dashboard");
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="from" className="text-sm font-medium text-foreground">
            De
          </label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="to" className="text-sm font-medium text-foreground">
            Até
          </label>
          <input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={handleApply} className="px-4">
            Aplicar
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="px-4"
          >
            Limpar
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
