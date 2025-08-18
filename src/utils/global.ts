export const rem = (rem: number) =>
  rem * (typeof window === "undefined" ? 16 : +getComputedStyle(document.documentElement).fontSize.replace("px", ""));

export const getCurrentDate = () => new Date();

export function formatMonthDate(date: Date, showYear: boolean = true): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}${showYear ? `, ${year}` : ""}`;
}

export const getFormattedDateInTZ = (tz: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const to12h = (h24: number) => ({ hours: h24 % 12 || 12, ampm: h24 >= 12 ? "PM" : "AM" });

export const normalizeDateTime = (s: string) => s.replace(" ", "T");

export const extractTime = (s: string) => normalizeDateTime(s).split("T")[1] ?? s;

export const toLocalDate = (s: string) => new Date(normalizeDateTime(s));

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
  const A = toLocalDate(a).getTime();
  const B = toLocalDate(b).getTime();
  let mins = (B - A) / 60000;
  if (mins < 0) mins += 1440;
  return mins;
};

export function getTimeDifferenceByTZ(timezoneId: string): string {
  const now = new Date();
  const cityNowLocal = new Date(now.toLocaleString("en-US", { timeZone: timezoneId }));
  const diffHours = Math.round((cityNowLocal.getTime() - now.getTime()) / 3600000);
  const sign = diffHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diffHours)}`;
}

export function getTimeDifferenceFromString(cityTimeStr: string): string {
  const now = new Date();
  const cityTime = toLocalDate(cityTimeStr);
  const diffHours = Math.round((cityTime.getTime() - now.getTime()) / 3600000);
  const sign = diffHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diffHours)}`;
}

export function formatTimeZoneVerbose(timezoneId: string, date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneId,
    timeZoneName: "long",
    hour: "2-digit",
    minute: "2-digit",
  };

  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

  const tzPart = parts.find((p) => p.type === "timeZoneName");
  const fullName = tzPart?.value;

  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneId,
    timeZoneName: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;

  if (!short || !fullName) return timezoneId;

  const abbr = short.replace(/^[^(]*\(([^)]+)\)/, "$1") || short;

  return `(${abbr}) ${fullName}`;
}

export function getTimeZoneAbbr(timezoneId: string, date = new Date()): string {
  const raw =
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneId,
      timeZoneName: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value || timezoneId;

  const m = raw.match(/\(([^)]+)\)/);
  return m ? m[1] : raw;
}

export function formatDayMonthInTZ(timezoneId: string, date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezoneId,
    day: "numeric",
    month: "short",
  }).format(date);
}

export const buildTzDayLabel = (tzId?: string) => (tzId ? `${getTimeZoneAbbr(tzId)} ${formatDayMonthInTZ(tzId)}` : "");
