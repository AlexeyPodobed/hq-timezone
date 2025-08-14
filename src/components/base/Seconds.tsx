"use client";

import { memo, useEffect, useState } from "react";

export const Seconds = memo(() => {
  const [seconds, setSeconds] = useState(new Date().getSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return <span className="seconds">:{pad(seconds)}</span>;
});

Seconds.displayName = "Seconds";
