"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  formatDisplayDate, 
  formatUrlDate, 
  parseUrlDate, 
  getDefaultDateRange,
  isValidDateRange,
  startOfDay,
  endOfDay,
  getPresetRange,
  isDateInFuture
} from "@/lib/date"
import type { DatePreset } from "@/types"

export function DateRangePicker(
  { className }: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Deriva o estado inicial da URL ou usa o padrão (últimos 30 dias)
  const dateRange = React.useMemo(() => {
    const from = parseUrlDate(searchParams.get("from"))
    const to = parseUrlDate(searchParams.get("to"))

    if (from && to && isValidDateRange({ from, to })) {
      return { 
        from: startOfDay(from), 
        to: endOfDay(to) 
      }
    }
    return getDefaultDateRange()
  }, [searchParams])

  const updateUrl = (range: { from: Date; to: Date }) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("from", formatUrlDate(range.from))
    params.set("to", formatUrlDate(range.to))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      updateUrl({ from: range.from, to: range.to })
    }
  }

  const handlePreset = (preset: DatePreset) => {
    const range = getPresetRange(preset)
    updateUrl(range)
  }

  const presets: { label: string; value: DatePreset }[] = [
    { label: "Hoje", value: "today" },
    { label: "Últimos 7 dias", value: "last7days" },
    { label: "Últimos 30 dias", value: "last30days" },
    { label: "Mês atual", value: "currentMonth" },
    { label: "Ano atual", value: "currentYear" },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          className={cn(buttonVariants({
            variant: "outline",
          }),
          "justify-start text-left font-normal w-[300px]")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                `${formatDisplayDate(dateRange.from)} - ${formatDisplayDate(dateRange.to)}`
              ) : (
                formatDisplayDate(dateRange.from)
              )
            ) : (
              <span>Selecionar período</span>
            )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="end">
          <div className="flex flex-col gap-1 p-3 border-r border-border min-w-[160px]">
            <p className="text-xs font-medium text-muted-foreground mb-1 px-2">
              Atalhos
            </p>
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant="ghost"
                size="sm"
                className="justify-start font-normal"
                onClick={() => handlePreset(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar 
            mode="range" 
            selected={dateRange} 
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => isDateInFuture(date)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}