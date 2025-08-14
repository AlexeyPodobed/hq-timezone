export const rem = (rem: number) =>
  rem * (typeof window === "undefined" ? 16 : +getComputedStyle(document.documentElement).fontSize.replace("px", ""));

export function formatMonthDate(date: Date, showYear: boolean = true): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}${showYear ? `, ${year}` : ""}`;
}

export const calcDayLength = (sunRise?: string, sunSet?: string): string | null => {
  if (!sunRise || !sunSet) return null;

  const rise = new Date(sunRise);
  const set = new Date(sunSet);

  let diffMinutes = (set.getTime() - rise.getTime()) / 1000 / 60;
  if (diffMinutes < 0) diffMinutes += 1440;

  const h = Math.floor(diffMinutes / 60);
  const m = Math.round(diffMinutes % 60);

  return `${h}h ${m}m`;
};

export function getTimeDifference(cityTimeStr: string): string {
  const now = new Date();
  const cityTime = new Date(cityTimeStr.replace(" ", "T"));

  const diffHours = Math.round((cityTime.getTime() - now.getTime()) / (1000 * 60 * 60));
  const sign = diffHours >= 0 ? "+" : "-";

  return `${sign}${Math.abs(diffHours)}`;
}
