import { toDate, toZonedTime } from "date-fns-tz";

type DiffResult = {
  hours: number;
  minutes: number;
  relation: "ahead" | "behind" | "same";
};

export function getTimeDiff(tzA: string, tzB: string, date = new Date()): DiffResult {
  const zonedA = toZonedTime(date, tzA);
  const zonedB = toZonedTime(date, tzB);

  const utcA = toDate(zonedA, { timeZone: tzA }).getTime();
  const utcB = toDate(zonedB, { timeZone: tzB }).getTime();

  const delta = Math.round((utcA - utcB) / 60000);
  const abs = Math.abs(delta);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;

  let relation: DiffResult["relation"] = "same";
  if (delta > 0) relation = "ahead";
  else if (delta < 0) relation = "behind";

  return { hours, minutes, relation };
}

export function formatDiffShort(hours: number, minutes?: number): string {
  return `${hours} hr ${String(minutes).padStart(2, "0")} min`;
}

export function getSignedHourDiff(tzA: string, tzB: string, date = new Date()): number {
  const zonedA = toZonedTime(date, tzA);
  const zonedB = toZonedTime(date, tzB);

  const utcA = toDate(zonedA, { timeZone: tzA }).getTime();
  const utcB = toDate(zonedB, { timeZone: tzB }).getTime();

  const deltaMinutes = Math.round((utcA - utcB) / 60000);
  const signedHours = Math.floor(deltaMinutes / 60);

  return signedHours;
}

export function formatDiffHours(hours: number): string {
  if (hours === 0) return "";
  return `${hours > 0 ? "+" : "-"}${Math.abs(hours)}h`;
}

export function formatDiffSentence(a: string, b: string, diff: DiffResult): string {
  if (diff.relation === "same") return `${a} and ${b} are in the same time.`;
  return `${a} is ${diff.hours} ${diff.hours === 1 ? "hour" : "hours"} and ${String(diff.minutes).padStart(2, "0")} ${diff.minutes === 1 ? "minute" : "minutes"} ${diff.relation} ${b}.`;
}
