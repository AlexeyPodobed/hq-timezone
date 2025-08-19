import { format, parseISO, differenceInHours } from "date-fns";
import { enUS } from "date-fns/locale";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

export const rem = (rem: number) =>
  rem * (typeof window === "undefined" ? 16 : +getComputedStyle(document.documentElement).fontSize.replace("px", ""));

export const getCurrentDate = () => new Date();

export const formatMonthDate = (date: Date, showYear: boolean = true): string => format(date, showYear ? "MMM d, yyyy" : "MMM d");

export const getFormattedDateInTZ = (tz: string): string => formatInTimeZone(new Date(), tz, "EEEE, MMMM d, yyyy");

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const to12h = (h24: number) => ({ hours: h24 % 12 || 12, ampm: h24 >= 12 ? "PM" : "AM" });

export const normalizeDateTime = (s: string) => s.replace(" ", "T");

export function getTimeDifferenceByTZ(timezoneId: string): string {
  const now = new Date();
  const cityNow = toZonedTime(now, timezoneId);
  const diffHours = differenceInHours(cityNow, now);
  const sign = diffHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diffHours)}`;
}

export function formatTimeZoneVerbose(timezoneId: string, date = new Date()): string {
  const long = formatInTimeZone(date, timezoneId, "zzzz", { locale: enUS });
  const short = formatInTimeZone(date, timezoneId, "zzz");
  return `(${short}) ${long}`;
}

export function getTimeZoneAbbr(timezoneId: string, date = new Date()): string {
  return formatInTimeZone(date, timezoneId, "zzz");
}

export function formatDayMonthInTZ(timezoneId: string, date = new Date()): string {
  return formatInTimeZone(date, timezoneId, "d MMM");
}

export const buildTzDayLabel = (tzId?: string) => (tzId ? `${getTimeZoneAbbr(tzId)} ${formatDayMonthInTZ(tzId)}` : "");

export function isoToHM(iso: string | undefined): string {
  if (!iso) return "";
  return format(parseISO(iso), "HH:mm");
}

/** Converts seconds like 48332 → "13h 25m" */
export function secsToHumanHM(seconds: number | undefined): string {
  if (!seconds || isNaN(seconds)) return "";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
}
