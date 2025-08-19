"use client";

import clsx from "clsx";
import { memo, useMemo, useState, useEffect } from "react";

import { useMounted } from "@/hooks/useMounted";
import { useSecondsTimer } from "@/hooks/useSecondsTimer";
import { useTimeStore } from "@/store/timeStore";
import { extractTime, pad2, to12h } from "@/utils/global";

import { Seconds } from "./Seconds";
import TimeFallback from "./TimeFallback";

interface TimeProps {
  time?: string; // "YYYY-MM-DD HH:MM[:SS]" or "HH:MM[:SS]"
  timezoneId?: string;
  live?: boolean;
  showSeconds?: boolean;
  className?: string;
}

const parseHM = (s: string): [number, number] | null => {
  const t = extractTime(s);
  if (!t) return null;
  const [hh, mm] = t.split(":");
  const h = Number(hh),
    m = Number(mm);
  return Number.isFinite(h) && Number.isFinite(m) ? [h, m] : null;
};

const nowHM = (tz?: string): [number, number] => {
  if (!tz) {
    const d = new Date();
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

  const initialHM = useMemo<[number | undefined, number | undefined]>(() => {
    if (time) {
      const hm = parseHM(time);
      if (hm) return hm;
      return [undefined, undefined];
    }
    if (!mounted) return [undefined, undefined];
    return nowHM(timezoneId);
  }, [time, timezoneId, mounted]);

  const [h24, setH24] = useState<number | undefined>(initialHM[0]);
  const [m, setM] = useState<number | undefined>(initialHM[1]);

  const [initialH, initialM] = initialHM;

  useEffect(() => {
    setH24(initialH);
    setM(initialM);
  }, [initialH, initialM]);

  const secondsTick = useSecondsTimer();
  const minuteTick = useMinuteTick();
  const tickKey = showSeconds ? secondsTick : minuteTick;

  useEffect(() => {
    if (!mounted || !live) return;
    const [hh, mm] = nowHM(timezoneId);
    setH24(hh);
    setM(mm);
  }, [mounted, live, timezoneId, tickKey]);

  const placeholder = !mounted || h24 === undefined || m === undefined;

  return renderView({ is24h, className, showSeconds, placeholder, h24, m });
});

Time.displayName = "Time";

export default Time;
