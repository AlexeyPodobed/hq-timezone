"use client";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";

import { useTimeStore } from "@/store/timeStore";

interface TimeProps {
  className?: string;
}

export const Time: FC<TimeProps> = ({ className }) => {
  const { is24h } = useTimeStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let ampm = "";

  if (!is24h) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className={clsx("time", className)}>
      <span>{pad(hours)}</span>:<span>{pad(minutes)}</span>:<span>{pad(seconds)}</span> {ampm}
    </span>
  );
};
