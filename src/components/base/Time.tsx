"use client";

import clsx from "clsx";
import { memo, useEffect, useState } from "react";

import { useMounted } from "@/hooks/useMounted";
import { useSecondsTimer } from "@/hooks/useSecondsTimer";
import { useTimeStore } from "@/store/timeStore";
import { pad2, to12h } from "@/utils/global";

import { Seconds } from "./Seconds";
import TimeFallback from "./TimeFallback";

interface TimeProps {
  time?: string; // "HH:MM[:SS]"
  timezoneId?: string;
  live?: boolean;
  showSeconds?: boolean;
  className?: string;
}

const parseHM = (s: string): [number, number] | undefined => {
  const parts = s.trim().split(":");
  if (parts.length < 2) return;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  return Number.isFinite(h) && Number.isFinite(m) ? [h, m] : undefined;
};

const nowHM = (tz?: string): [number, number] => {
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
  const sec = useSecondsTimer();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (sec === 0) setTick((t) => t + 1);
  }, [sec]);
  return tick;
};

const renderView = ({
  is24h,
  className,
  showSeconds,
  placeholder,
  h24,
  m,
}: {
  is24h: boolean;
  className?: string;
  showSeconds: boolean;
  placeholder: boolean;
  h24?: number;
  m?: number;
}) => {
  const base = clsx("time", !is24h && "time-ampm", className);

  if (placeholder) {
    return (
      <span
        className={base}
        suppressHydrationWarning
      >
        <TimeFallback showSeconds={showSeconds} />
        {!is24h && <span className="ampm"> --</span>}
      </span>
    );
  }

  const { hours, ampm } = is24h ? { hours: h24 as number, ampm: "" } : to12h(h24 as number);

  return (
    <span className={base}>
      <span className="hours">{pad2(hours)}</span>:<span className="minutes">{pad2(m as number)}</span>
      {showSeconds && <Seconds />}
      {ampm && <span className="ampm"> {ampm}</span>}
    </span>
  );
};

export const Time = memo<TimeProps>(({ time, timezoneId, live = true, showSeconds = true, className }) => {
  const mounted = useMounted();
  const is24hStore = useTimeStore((s) => s.is24h);
  const is24h = mounted ? is24hStore : true;

  const [h24, setH24] = useState<number | undefined>(undefined);
  const [m, setM] = useState<number | undefined>(undefined);

  const secondsTick = useSecondsTimer();
  const minuteTick = useMinuteTick();

  const tick = showSeconds ? secondsTick : minuteTick;

  useEffect(() => {
    if (!mounted) return;

    if (time) {
      const parsed = parseHM(time);
      if (parsed) {
        setH24(parsed[0]);
        setM(parsed[1]);
        return;
      }
    }

    const [hh, mm] = nowHM(timezoneId);
    setH24(hh);
    setM(mm);
  }, [mounted, time, timezoneId]);

  useEffect(() => {
    if (!mounted || !live || time) return;
    const [hh, mm] = nowHM(timezoneId);
    setH24(hh);
    setM(mm);
  }, [mounted, live, time, timezoneId, tick]);

  const placeholder = !mounted || h24 === undefined || m === undefined;

  return renderView({ is24h, className, showSeconds, placeholder, h24, m });
});

Time.displayName = "Time";

export default Time;
