import {
  format,
  subDays,
  isAfter,
  isBefore,
  differenceInMonths,
  startOfDay,
  endOfDay,
} from "date-fns";
import type { DateRange } from "@/types";

export const DATE_DISPLAY_FORMAT = "dd/MM/yyyy";
export const DATE_URL_FORMAT = "yyyy-MM-dd";
export const MAX_DATE_RANGE_MONTHS = 12;

export function formatDisplayDate(date: Date): string {
  return format(date, DATE_DISPLAY_FORMAT);
}

export function formatUrlDate(date: Date): string {
  return format(date, DATE_URL_FORMAT);
}

export function getDefaultDateRange(): DateRange {
  return {
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  };
}

export function isValidDateRange(range: DateRange): boolean {
  return isAfter(range.to, range.from);
}

export function exceedsMaxRange(range: DateRange): boolean {
  return differenceInMonths(range.to, range.from) > MAX_DATE_RANGE_MONTHS;
}

export function isDateInFuture(date: Date): boolean {
  return isAfter(date, new Date());
}
