"use client";

import clsx from "clsx";
import { memo } from "react";

import { useMounted } from "@/hooks/useMounted";
import { useTimeDisplayValue } from "@/hooks/useTimeDisplayValue";
import { useTimeStore } from "@/store/timeStore";
import { pad2, to12h } from "@/utils/date";

import { Seconds } from "./Seconds";
import TimeFallback from "./TimeFallback";

interface TimeProps {
  time?: string; // "YYYY-MM-DD HH:MM[:SS]" or "HH:MM[:SS]"
  timezoneId?: string;
  live?: boolean;
  showSeconds?: boolean;
  className?: string;
}

const TimeView = memo(
  ({
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
  }
);

TimeView.displayName = "TimeView";

export const Time = memo<TimeProps>(({ time, timezoneId, live = true, showSeconds = true, className }) => {
  const mounted = useMounted();
  const is24hStore = useTimeStore((s) => s.is24h);
  const is24h = mounted ? is24hStore : true;
  const [h24, m] = useTimeDisplayValue({ time, timezoneId, live, mounted, showSeconds });

  const placeholder = !mounted || h24 === undefined || m === undefined;

  return (
    <TimeView
      is24h={is24h}
      className={className}
      showSeconds={showSeconds}
      placeholder={placeholder}
      h24={h24}
      m={m}
    />
  );
});

Time.displayName = "Time";

export default Time;
