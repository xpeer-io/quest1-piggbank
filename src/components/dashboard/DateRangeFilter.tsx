"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DateRangeFilterProps = {
  from: Date;
  to: Date;
};

export function DateRangeFilter({
  from,
  to,
}: DateRangeFilterProps) {
  const router = useRouter();

  const [startDate, setStartDate] = useState(
    from.toISOString().split("T")[0]
  );

  const [endDate, setEndDate] = useState(
    to.toISOString().split("T")[0]
  );

  function applyFilter(
    nextFrom: string,
    nextTo: string
  ) {
    router.push(
      `/dashboard?from=${nextFrom}&to=${nextTo}`
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => {
          const value = e.target.value;

          setStartDate(value);

          applyFilter(value, endDate);
        }}
        className="bg-transparent text-sm text-foreground outline-none"
      />

      <span className="text-muted-foreground">
        até
      </span>

      <input
        type="date"
        value={endDate}
        onChange={(e) => {
          const value = e.target.value;

          setEndDate(value);

          applyFilter(startDate, value);
        }}
        className="bg-transparent text-sm text-foreground outline-none"
      />
    </div>
  );
}