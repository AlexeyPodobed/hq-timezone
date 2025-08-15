"use client";
import { useEffect } from "react";

import { useSecondsStore, attachSecondsTicker, detachSecondsTicker } from "@/store/secondsStore";

export function useSecondsTimer() {
  const seconds = useSecondsStore((s) => s.seconds);
  useEffect(() => {
    attachSecondsTicker();
    return () => detachSecondsTicker();
  }, []);
  return seconds;
}
