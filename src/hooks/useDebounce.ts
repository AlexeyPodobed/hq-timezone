"use client";
import { useEffect, useState } from "react";

export const debounceDelayTime = 150;

export function useDebounce<T>(value: T, delay = debounceDelayTime) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
