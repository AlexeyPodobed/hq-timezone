import { format, parseISO, differenceInMinutes, addMinutes, startOfDay, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { DateTime } from "luxon";

export const getLocalTimeInTZ = (tz: string): string => {
  const localDate = toZonedTime(new Date(), tz);
  return format(localDate, "HH:mm:ss"); // or "yyyy-MM-dd HH:mm:ss"
};

export const parseTzTime = (timeStr: string) => parseISO(timeStr.replace(" ", "T"));

export function formatMonthDate(date: DateTime | Date, showYear: boolean = true): string {
  if (date instanceof Date) {
    return format(date, showYear ? "MMM d, yyyy" : "MMM d");
  }
  return date.toFormat(showYear ? "MMM d, yyyy" : "MMM d");
}

export const formatDateFromDateTime = (timezone: string): string => {
  if (!timezone) return "";
  const date = DateTime.now().setZone(timezone);
  return date.isValid ? date.toFormat("EEEE, MMMM d, yyyy") : "";
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
  const dt = DateTime.fromJSDate(date).setZone(timezoneId).setLocale("en");

  const rawShort = dt.offsetNameShort;
  const rawLong = dt.offsetNameLong;

  const short = rawShort ?? "";
  const long = rawLong ?? "";

  let displayShort = short;

  if (displayShort.startsWith("GMT")) {
    displayShort = getAbbreviationFromLongName(long);
  }

  return `(${displayShort}) ${long}`;
}

function getAbbreviationFromLongName(longName: string): string {
  if (!longName) return "";
  return longName
    .split(" ")
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

export const getNextDayLabel = (time: string | undefined) => {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const base = addDays(startOfDay(new Date()), 1);
  const result = addMinutes(base, hours * 60 + minutes);
  return format(result, "d MMM");
};

export const formatDayMonthInTZ = (tz: string) => {
  const zoned = toZonedTime(new Date(), tz);
  return format(zoned, "dd MMM");
};

export const buildTzDayLabel = (tzId?: string): string => {
  if (!tzId) return "";

  const verbose = formatTimeZoneVerbose(tzId); // → (CDT) Central Daylight Time
  const match = verbose.match(/\((.*?)\)/);
  const abbr = match?.[1] ?? "GMT";
  const day = formatDayMonthInTZ(tzId); // → 11 Sep

  return `${abbr} ${day}`; // → CDT 11 Sep
};

export const formatDayFullInTZ = (tz: string, date = new Date()): string => {
  const zoned = toZonedTime(date, tz);
  return format(zoned, "d MMMM"); // e.g., "24 August"
};
