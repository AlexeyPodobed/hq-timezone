"use client";

import { useEffect, useMemo, useState } from "react";

import { extractTime } from "@/utils/date";
import { getDateInCalculationTimezone, isUtcOffsetTimezone } from "@/utils/timezone";

import { useSecondsTimer } from "./useSecondsTimer";

export type HourMinute = [number, number];
export type OptionalHourMinute = [number | undefined, number | undefined];

interface UseTimeDisplayValueParams {
  time?: string;
  timezoneId?: string;
  live: boolean;
  mounted: boolean;
  showSeconds: boolean;
}

const parseHourMinute = (s: string): HourMinute | null => {
  const t = extractTime(s);
  if (!t) return null;

  const [hh, mm] = t.split(":");
  const h = Number(hh);
  const m = Number(mm);

  return Number.isFinite(h) && Number.isFinite(m) ? [h, m] : null;
};

const getCurrentHourMinute = (tz?: string): HourMinute => {
  if (!tz) {
    const d = new Date();
    return [d.getHours(), d.getMinutes()];
  }

  if (isUtcOffsetTimezone(tz)) {
    const d = getDateInCalculationTimezone(tz);
    return [d.getHours(), d.getMinutes()];
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date());
  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return [hh, mm];
};

const useMinuteTick = () => {
  const seconds = useSecondsTimer();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (seconds === 0) setTick((value) => value + 1);
  }, [seconds]);

  return tick;
};

export const useTimeDisplayValue = ({ time, timezoneId, live, mounted, showSeconds }: UseTimeDisplayValueParams): OptionalHourMinute => {
  const initialHourMinute = useMemo<OptionalHourMinute>(() => {
    if (time) return parseHourMinute(time) ?? [undefined, undefined];
    if (!mounted) return [undefined, undefined];

    return getCurrentHourMinute(timezoneId);
  }, [time, timezoneId, mounted]);

  const [hourMinute, setHourMinute] = useState<OptionalHourMinute>(initialHourMinute);
  const [initialHours, initialMinutes] = initialHourMinute;

  useEffect(() => {
    setHourMinute([initialHours, initialMinutes]);
  }, [initialHours, initialMinutes]);

  const secondsTick = useSecondsTimer();
  const minuteTick = useMinuteTick();
  const tickKey = showSeconds ? secondsTick : minuteTick;

  useEffect(() => {
    if (!mounted || !live) return;

    setHourMinute(getCurrentHourMinute(timezoneId));
  }, [mounted, live, timezoneId, tickKey]);

  return hourMinute;
};
