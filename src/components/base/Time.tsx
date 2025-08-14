"use client";

import clsx from "clsx";
import { memo, useEffect, useMemo, useState, useCallback } from "react";

import { useTimeStore } from "@/store/timeStore";

interface TimeProps {
  className?: string;
  time?: string; // "HH:MM:SS" | "HH:MM"
  disableCounter?: boolean;
  showSeconds?: boolean;
}

export const Time = memo<TimeProps>(({ className, time, disableCounter, showSeconds }) => {
  const { is24h } = useTimeStore();

  const getInitialDate = useCallback(() => {
    if (!time) return new Date();

    const parts = time.split(":").map(Number);
    const d = new Date();
    if (parts.length === 2) {
      const [h, m] = parts;
      d.setHours(h, m, 0, 0);
    } else if (parts.length === 3) {
      const [h, m, s] = parts;
      d.setHours(h, m, s, 0);
    }
    return d;
  }, [time]);

  const [currentTime, setCurrentTime] = useState(getInitialDate);

  useEffect(() => {
    if (disableCounter) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [disableCounter]);

  const { hours, minutes, seconds, ampm } = useMemo(() => {
    let h = currentTime.getHours();
    const m = currentTime.getMinutes();
    const s = currentTime.getSeconds();
    let a = "";

    if (!is24h) {
      a = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
    }

    return { hours: h, minutes: m, seconds: s, ampm: a };
  }, [currentTime, is24h]);

  const pad = useCallback((n: number) => n.toString().padStart(2, "0"), []);

  const shouldShowSeconds = useMemo(() => {
    if (typeof showSeconds === "boolean") return showSeconds;
    if (!time) return true;
    return time.split(":").length === 3;
  }, [time, showSeconds]);

  return (
    <span className={clsx("time", className)}>
      <span>{pad(hours)}</span>:<span>{pad(minutes)}</span>
      {shouldShowSeconds && (
        <>
          :<span>{pad(seconds)}</span>
        </>
      )}
      {ampm && <> {ampm}</>}
    </span>
  );
});

Time.displayName = "Time";
