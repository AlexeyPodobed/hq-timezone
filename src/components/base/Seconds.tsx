"use client";

import { memo } from "react";

import { useSecondsTimer } from "@/hooks/useSecondsTimer";

const pad = (n: number) => n.toString().padStart(2, "0");

export const Seconds = memo(() => {
  const seconds = useSecondsTimer();
  return <span className="seconds">:{pad(seconds)}</span>;
});
Seconds.displayName = "Seconds";
