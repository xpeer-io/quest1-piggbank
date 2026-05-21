import {
  format,
  parseISO,
  subDays,
  isAfter,
  isBefore,
  differenceInMonths,
  startOfDay,
  endOfDay,
  isValid as isValidDate,
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

export function parseUrlDate(value: string): Date | null {
  const parsed = parseISO(value);
  return isValidDate(parsed) ? parsed : null;
}

export function getToday(): Date {
  return startOfDay(new Date());
}

export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

export function getEndOfDay(date: Date): Date {
  return endOfDay(date);
}

export function getDefaultDateRange(): DateRange {
  return {
    from: getStartOfDay(subDays(new Date(), 30)),
    to: getEndOfDay(new Date()),
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
