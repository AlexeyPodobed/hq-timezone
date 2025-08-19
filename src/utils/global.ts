import { format, parseISO, isValid, differenceInMinutes } from "date-fns";
import { enUS } from "date-fns/locale";
import { toZonedTime, format as tzFormat } from "date-fns-tz";

export const rem = (rem: number) =>
  rem * (typeof window === "undefined" ? 16 : +getComputedStyle(document.documentElement).fontSize.replace("px", ""));

export const getCurrentDate = () => new Date();

export function formatMonthDate(date: Date, showYear: boolean = true): string {
  return format(date, showYear ? "MMM d, yyyy" : "MMM d");
}

export const formatDateFromDateTime = (dateStr: string): string => {
  const date = parseISO(dateStr.replace(" ", "T"));
  return isValid(date) ? format(date, "EEEE, MMMM d, yyyy") : "";
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const to12h = (h24: number) => ({ hours: h24 % 12 || 12, ampm: h24 >= 12 ? "PM" : "AM" });

export const normalizeDateTime = (s: string) => s.replace(" ", "T");

export const extractTime = (s: string) => normalizeDateTime(s).split("T")[1] ?? s;

export const toLocalDate = (s: string) => parseISO(normalizeDateTime(s));

export const normDayMinutes = (mins: number) => ((mins % 1440) + 1440) % 1440;

export const floorTo30 = (mins: number) => Math.floor(mins / 30) * 30;

export const toMinutes = (s?: string): number => {
  if (!s) return 0;
  const t = extractTime(s);
  const [hh, mm] = t.split(":");
  const h = Number(hh) || 0;
  const m = Number(mm) || 0;
  return h * 60 + m;
};

export const minutesToHHMM = (mins: number) => {
  const m = normDayMinutes(mins);
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${pad2(h)}:${pad2(r)}`;
};

export const diffMinutesSameTZ = (a: string, b: string) => {
  const start = toLocalDate(a);
  const end = toLocalDate(b);
  let mins = differenceInMinutes(end, start);
  if (mins < 0) mins += 1440;
  return mins;
};

export const calcDayLength = (sunRise?: string, sunSet?: string): string | null => {
  if (!sunRise || !sunSet) return null;
  const diffMin = diffMinutesSameTZ(sunRise, sunSet);
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `${h}h ${m}m`;
};

export function getTimeDifferenceByTZ(timezoneId: string): string {
  const now = new Date();
  const zoned = toZonedTime(now, timezoneId);
  const diffHours = Math.round((zoned.getTime() - now.getTime()) / 3600000);
  const sign = diffHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diffHours)}`;
}

export function formatTimeZoneVerbose(timezoneId: string, date = new Date()): string {
  const short = tzFormat(date, "zzz", {
    timeZone: timezoneId,
    locale: enUS,
  });
  const long = tzFormat(date, "zzzz", {
    timeZone: timezoneId,
    locale: enUS,
  });
  return `(${short}) ${long}`;
}

export function getTimeZoneAbbr(timezoneId: string, date = new Date()): string {
  return tzFormat(date, "zzz", { timeZone: timezoneId });
}

export function formatDayMonthInTZ(timezoneId: string, date = new Date()): string {
  return tzFormat(date, "d MMM", { timeZone: timezoneId });
}

export const buildTzDayLabel = (tzId?: string) => (tzId ? `${getTimeZoneAbbr(tzId)} ${formatDayMonthInTZ(tzId)}` : "");
