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

export const formatDateFromDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const to12h = (h24: number) => ({ hours: h24 % 12 || 12, ampm: h24 >= 12 ? "PM" : "AM" });

export const normalizeDateTime = (s: string) => s.replace(" ", "T");

export const extractTime = (s: string) => normalizeDateTime(s).split("T")[1] ?? s;

export const toLocalDate = (s: string) => new Date(normalizeDateTime(s));

export const diffMinutesSameTZ = (a: string, b: string) => {
  const A = toLocalDate(a).getTime();
  const B = toLocalDate(b).getTime();
  let mins = (B - A) / 60000;
  if (mins < 0) mins += 1440;
  return mins;
};

export const calcDayLength = (sunRise?: string, sunSet?: string): string | null => {
  if (!sunRise || !sunSet) return null;
  const diffMin = Math.round(diffMinutesSameTZ(sunRise, sunSet));
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `${h}h ${m}m`;
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
