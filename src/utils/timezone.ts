import { toZonedTime } from "date-fns-tz";
import { DateTime } from "luxon";

import type { CityFull } from "@/types/cities";

const TIMEZONE_OFFSET_KEYS = {
  jan: "timezone_gmt_offset_jan",
  jul: "timezone_gmt_offset_jul",
} as const;

const { jan: JAN_OFFSET_KEY, jul: JUL_OFFSET_KEY } = TIMEZONE_OFFSET_KEYS;

type TimezoneOffsetKey = (typeof TIMEZONE_OFFSET_KEYS)[keyof typeof TIMEZONE_OFFSET_KEYS];
type CityTimeCalculationInput = Pick<CityFull, "name" | "timezone" | TimezoneOffsetKey>;

const UTC_OFFSET_TIMEZONE_REGEXP = /^UTC([+-])(\d{2}):(\d{2})$/;

export const normalizeTimezone = (tz?: string): string => (tz ?? "").trim().replaceAll(" ", "_");

export const isUtcOffsetTimezone = (timezoneId?: string) => Boolean(timezoneId && UTC_OFFSET_TIMEZONE_REGEXP.test(timezoneId));

const pad2 = (n: number) => String(n).padStart(2, "0");

const parseGmtOffsetToMinutes = (offset?: string | number | null): number | null => {
  if (offset === null || offset === undefined || offset === "") return null;

  const raw = String(offset).trim().replace(/^GMT/i, "").replace(/^UTC/i, "");
  const match = raw.match(/^([+-])?(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return null;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  return sign * (hours * 60 + minutes);
};

const minutesToUtcOffsetTimezone = (offsetMinutes: number) => {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;

  return `UTC${sign}${pad2(hours)}:${pad2(minutes)}`;
};

const getCurrentSeasonOffsetKey = (timezone: string, date = new Date()): TimezoneOffsetKey => {
  const normalizedTimezone = normalizeTimezone(timezone);
  const now = DateTime.fromJSDate(date).setZone(normalizedTimezone);

  if (now.isValid) {
    const year = now.year;
    const jan = DateTime.fromObject({ year, month: 1, day: 1, hour: 12 }, { zone: normalizedTimezone });
    const jul = DateTime.fromObject({ year, month: 7, day: 1, hour: 12 }, { zone: normalizedTimezone });

    if (jul.isValid && now.offset === jul.offset) return JUL_OFFSET_KEY;
    if (jan.isValid && now.offset === jan.offset) return JAN_OFFSET_KEY;
  }

  // If the IANA timezone cannot be evaluated, keep the same seasonal priority roughly by calendar month.
  const month = date.getUTCMonth();
  return month >= 3 && month <= 8 ? JUL_OFFSET_KEY : JAN_OFFSET_KEY;
};

const getExpectedSeasonalOffsets = (timezone: string, date = new Date()): Record<TimezoneOffsetKey, number | null> => {
  const normalizedTimezone = normalizeTimezone(timezone);
  const now = DateTime.fromJSDate(date).setZone(normalizedTimezone);
  if (!now.isValid) {
    return {
      [JAN_OFFSET_KEY]: null,
      [JUL_OFFSET_KEY]: null,
    };
  }

  const year = now.year;
  const jan = DateTime.fromObject({ year, month: 1, day: 1, hour: 12 }, { zone: normalizedTimezone });
  const jul = DateTime.fromObject({ year, month: 7, day: 1, hour: 12 }, { zone: normalizedTimezone });

  return {
    [JAN_OFFSET_KEY]: jan.isValid ? jan.offset / 60 : null,
    [JUL_OFFSET_KEY]: jul.isValid ? jul.offset / 60 : null,
  };
};

const getValidApiOffset = (city: CityTimeCalculationInput, key: TimezoneOffsetKey, expectedOffsets: Record<TimezoneOffsetKey, number | null>) => {
  const parsedOffsetMinutes = parseGmtOffsetToMinutes(city[key]);
  if (parsedOffsetMinutes === null) return null;

  const offsetHours = parsedOffsetMinutes / 60;
  const expectedOffsetHours = expectedOffsets[key];

  // API uses "0" as an empty counterpart for inactive timezone rows, e.g. PST has jul=0.
  // Keep real GMT+0 zones valid by rejecting zero only when the base timezone expects another offset.
  if (offsetHours === 0 && expectedOffsetHours !== null && expectedOffsetHours !== 0) {
    return null;
  }

  return parsedOffsetMinutes;
};

export const getCalculationTimezone = (city: CityTimeCalculationInput, date = new Date()) => {
  const fallbackTimezone = normalizeTimezone(city.timezone);
  const primaryKey = getCurrentSeasonOffsetKey(fallbackTimezone, date);
  const secondaryKey = primaryKey === JUL_OFFSET_KEY ? JAN_OFFSET_KEY : JUL_OFFSET_KEY;
  const priorityKeys: TimezoneOffsetKey[] = [primaryKey, secondaryKey];
  const expectedOffsets = getExpectedSeasonalOffsets(fallbackTimezone, date);
  const sourceKey = priorityKeys.find((key) => getValidApiOffset(city, key, expectedOffsets) !== null);

  if (!sourceKey) return fallbackTimezone;

  const offsetMinutes = getValidApiOffset(city, sourceKey, expectedOffsets) as number;
  const calculationTimezone = minutesToUtcOffsetTimezone(offsetMinutes);

  // New API fields affect only time math. Labels still use city.timezone as before.
  return calculationTimezone;
};

export const getDateInCalculationTimezone = (timezoneId: string, date = new Date()) => {
  if (!isUtcOffsetTimezone(timezoneId)) return toZonedTime(date, normalizeTimezone(timezoneId));

  const dt = DateTime.fromJSDate(date).setZone(timezoneId);
  return new Date(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second);
};
