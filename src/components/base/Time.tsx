"use client";

import clsx from "clsx";
import { memo, useEffect, useState } from "react";

import { useTimeStore } from "@/store/timeStore";
import { normalizeDateTime } from "@/utils/gloabl";

import { Seconds } from "./Seconds";

interface TimeProps {
  time?: string; // "YYYY-MM-DD HH:MM"
  showSeconds?: boolean;
  className?: string;
}

export const Time = memo<TimeProps>(({ time, showSeconds = true, className }) => {
  const { is24h } = useTimeStore();

  const parseTime = (str?: string) => {
    if (!str) return new Date();
    return new Date(normalizeDateTime(str));
  };

  const [currentTime, setCurrentTime] = useState(parseTime(time));

  useEffect(() => {
    setCurrentTime(parseTime(time));
  }, [time]);

  const hours = is24h ? currentTime.getHours() : currentTime.getHours() % 12 || 12;
  const ampm = is24h ? "" : currentTime.getHours() >= 12 ? "PM" : "AM";
  const minutes = currentTime.getMinutes();

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className={clsx("time", !is24h && "time-ampm", className)}>
      <span className="hours">{pad(hours)}</span>:<span className="minutes">{pad(minutes)}</span>
      {showSeconds !== false && <Seconds />}
      {ampm && <span className="ampm"> {ampm}</span>}
    </span>
  );
});

Time.displayName = "Time";
