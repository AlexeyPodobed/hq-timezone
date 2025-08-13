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

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  let minutes = toMinutes(sunSet) - toMinutes(sunRise);
  if (minutes < 0) minutes += 1440;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h}h ${m}m`;
};

export function formatHours(hours: number, is24h: boolean): { h: number; ampm: string } {
  if (is24h) return { h: hours, ampm: "" };
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return { h, ampm };
}
