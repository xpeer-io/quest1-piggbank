import {
  format,
  parse,
  subDays,
  isAfter,
  isBefore,
  isSameDay,
  differenceInMonths,
  differenceInDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  startOfYear,
  isValid,
  eachDayOfInterval,
} from "date-fns";
import type { DateRange, DatePreset, AggregationLevel } from "@/types";

export const DATE_DISPLAY_FORMAT = "dd/MM/yyyy";
export const DATE_URL_FORMAT = "yyyy-MM-dd";
export const MAX_DATE_RANGE_MONTHS = 12;

export { startOfDay, endOfDay };

export function formatDisplayDate(date: Date): string {
  return format(date, DATE_DISPLAY_FORMAT);
}

export function formatUrlDate(date: Date): string {
  return format(date, DATE_URL_FORMAT);
}

export function parseUrlDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const parsed = parse(dateStr, DATE_URL_FORMAT, new Date());
  return isValid(parsed) ? parsed : null;
}

export function getDefaultDateRange(): DateRange {
  return {
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  };
}

export function getPresetRange(preset: DatePreset): DateRange {
  const now = new Date();
  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "last7days":
      return { from: startOfDay(subDays(now, 7)), to: endOfDay(now) };
    case "last30days":
      return getDefaultDateRange();
    case "currentMonth":
      return { from: startOfMonth(now), to: endOfDay(now) };
    case "currentYear":
      return { from: startOfYear(now), to: endOfDay(now) };
    default:
      return getDefaultDateRange();
  }
}

export function isValidDateRange(range: DateRange): boolean {
  if (!range.from || !range.to) return false;
  
  const isChronological = isAfter(range.to, range.from) || isSameDay(range.to, range.from);
  const isWithinLimit = !exceedsMaxRange(range);
  const isStartNotFuture = !isDateInFuture(range.from);

  return isChronological && isWithinLimit && isStartNotFuture;
}

export function getRecommendedAggregation(range: DateRange): AggregationLevel {
  if (!range.from || !range.to) return "day";

  // Usamos Math.abs para garantir consistência e +1 para incluir ambos os dias
  const days = Math.abs(differenceInDays(range.to, range.from)) + 1;
  
  if (days > 90) return "month";
  if (days > 30) return "week";
  return "day";
}

/**
 * Útil para preencher lacunas nos gráficos gerando a lista completa de dias do intervalo
 */
export function getDateSeries(range: DateRange): Date[] {
  return eachDayOfInterval({ start: range.from, end: range.to });
}

export function exceedsMaxRange(range: DateRange): boolean {
  return differenceInMonths(range.to, range.from) > MAX_DATE_RANGE_MONTHS;
}

export function isDateInFuture(date: Date): boolean {
  // Considera futuro apenas se for estritamente após o início do dia de hoje
  return isAfter(startOfDay(date), startOfDay(new Date()));
}
