import {
  format,
  subDays,
  isAfter,
  differenceInMonths,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
} from "date-fns";
import type { DateRange } from "@/types";

export const DATE_DISPLAY_FORMAT = "dd/MM/yyyy";
export const DATE_URL_FORMAT = "yyyy-MM-dd";
export const MAX_DATE_RANGE_MONTHS = 12;

export function formatDisplayDate(date: Date | string): string {
  let d: Date;
  if (typeof date === "string") {
    const parsed = parseISO(date);
    d = isValid(parsed) ? parsed : new Date(date);
  } else {
    d = date;
  }

  return format(d, DATE_DISPLAY_FORMAT);
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
  return !isAfter(range.from, range.to);
}

export function exceedsMaxRange(range: DateRange): boolean {
  return differenceInMonths(range.to, range.from) > MAX_DATE_RANGE_MONTHS;
}

export function isDateInFuture(date: Date): boolean {
  return isAfter(startOfDay(date), startOfDay(new Date()));
}

export function parseDateParam(value?: string): Date | null {
  if (!value) {
    return null;
  }

  const parsedDate = parseISO(value);
  return isValid(parsedDate) ? parsedDate : null;
}

export function getDateRangeFromSearchParams(
  params: { from?: string | string[]; to?: string | string[] },
): DateRange | null {
  const fromValue = Array.isArray(params.from) ? params.from[0] : params.from;
  const toValue = Array.isArray(params.to) ? params.to[0] : params.to;

  const parsedFrom = parseDateParam(fromValue);
  const parsedTo = parseDateParam(toValue);

  if (!parsedFrom || !parsedTo) {
    return null;
  }

  const range: DateRange = {
    from: startOfDay(parsedFrom),
    to: endOfDay(parsedTo),
  };

  if (!isValidDateRange(range) || exceedsMaxRange(range)) {
    return null;
  }

  if (isDateInFuture(range.to)) {
    return null;
  }

  return range;
}
