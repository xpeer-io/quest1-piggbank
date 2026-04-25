"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { formatDisplayDate, isValidDateRange } from "@/lib/date"
import type { DateRange } from "@/types"
import { CalendarIcon } from "lucide-react"

type DateRangeFilterProps = {
  onFilterChange: (range: DateRange) => void
  initialRange: DateRange
  isLoading?: boolean
}

export function DateRangeFilter({
  onFilterChange,
  initialRange,
  isLoading = false,
}: DateRangeFilterProps) {
  const [localRange, setLocalRange] = useState<DateRange>(initialRange)
  const [error, setError] = useState<string>("")
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)

  const handleApplyFilter = () => {
    setError("")

    if (!isValidDateRange(localRange)) {
      setError("Data inicial não pode ser maior que a data final")
      return
    }

    onFilterChange(localRange)
    setOpenStart(false)
    setOpenEnd(false)
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return
    setLocalRange((prev) => ({ ...prev, from: date }))
    setError("")
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return
    setLocalRange((prev) => ({ ...prev, to: date }))
    setError("")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <button
            onClick={() => setOpenStart(true)}
            className="inline-flex w-40 items-center justify-start rounded-lg border border-border bg-card px-3 py-2 text-sm font-normal transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayDate(localRange.from)}
          </button>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={localRange.from}
              onSelect={handleStartDateChange}
              disabled={(date) => date > localRange.to}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <button
            onClick={() => setOpenEnd(true)}
            className="inline-flex w-40 items-center justify-start rounded-lg border border-border bg-card px-3 py-2 text-sm font-normal transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayDate(localRange.to)}
          </button>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={localRange.to}
              onSelect={handleEndDateChange}
              disabled={(date) => date < localRange.from}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleApplyFilter}
          disabled={isLoading}
          className="px-6"
        >
          {isLoading ? "Carregando..." : "Aplicar"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
