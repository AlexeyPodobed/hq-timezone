"use client";

import clsx from "clsx";
import { memo } from "react";

import { useMounted } from "@/hooks/useMounted";
import { useTimeStore } from "@/store/timeStore";
import { extractTime, pad2, to12h } from "@/utils/global";

import { Seconds } from "./Seconds";
import TimeFallback from "./TimeFallback";

interface TimeProps {
  time?: string; // "YYYY-MM-DD HH:MM[:SS]" or "HH:MM[:SS]"
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

export const Time = memo<TimeProps>(({ time, showSeconds = true, className }) => {
  const { is24h } = useTimeStore();
  const mounted = useMounted();

  let h24: number | undefined;
  let m: number | undefined;
  let placeholder = false;

  if (time) {
    const hm = parseHM(time);
    if (hm) [h24, m] = hm;
    else placeholder = true;
  } else if (!mounted) {
    placeholder = true;
  } else {
    const now = new Date();
    h24 = now.getHours();
    m = now.getMinutes();
  }

  return renderView({
    is24h,
    className,
    showSeconds,
    placeholder: placeholder || h24 === undefined || m === undefined,
    h24,
    m,
  });
});

Time.displayName = "Time";

export default Time;
