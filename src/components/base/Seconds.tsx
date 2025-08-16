"use client";

import { memo } from "react";

import { useMounted } from "@/hooks/useMounted";
import { useSecondsTimer } from "@/hooks/useSecondsTimer";

const pad = (n: number) => n.toString().padStart(2, "0");

export const Seconds = memo(() => {
  const seconds = useSecondsTimer();
  const mounted = useMounted();

  return (
    <span
      className="seconds"
      suppressHydrationWarning
    >
      :{mounted ? pad(seconds) : "--"}
    </span>
  );
});

Seconds.displayName = "Seconds";
