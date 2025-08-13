"use client";

import clsx from "clsx";
import { memo, useEffect, useMemo, useState, useCallback } from "react";

import { useTimeStore } from "@/store/timeStore";
import { formatHours } from "@/utils/gloabl";

interface TimeProps {
  className?: string;
  time?: string; // "HH:MM:SS" | "HH:MM"
  disableCounter?: boolean;
}

export const Time = memo<TimeProps>(({ className, time, disableCounter }) => {
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

  const { h: hours, ampm } = useMemo(() => formatHours(currentTime.getHours(), is24h), [currentTime, is24h]);

  const minutes = useMemo(() => currentTime.getMinutes(), [currentTime]);
  const seconds = useMemo(() => currentTime.getSeconds(), [currentTime]);

  const pad = useCallback((n: number) => n.toString().padStart(2, "0"), []);
  const showSeconds = useMemo(() => time?.split(":").length === 3, [time]);

  return (
    <span className={clsx("time", className)}>
      <span>{pad(hours)}</span>:<span>{pad(minutes)}</span>
      {showSeconds && (
        <>
          :<span>{pad(seconds)}</span>
        </>
      )}
      {ampm && <> {ampm}</>}
    </span>
  );
});

Time.displayName = "Time";
