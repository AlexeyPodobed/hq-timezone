"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { CityFull } from "@/types/cities";

type ExtraSelectedCities = Record<string, CityFull | null>;

interface UseExtraCitySelectsOptions {
  idsStorageKey: string;
  cityStoragePrefix: string;
  max?: number;
}

const DEFAULT_MAX_EXTRA_CITIES = 10;

const readStoredStringArray = (storageKey: string): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

const writeStoredStringArray = (storageKey: string, value: string[]) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(storageKey, JSON.stringify(value));
};

export const useExtraCitySelects = ({ idsStorageKey, cityStoragePrefix, max = DEFAULT_MAX_EXTRA_CITIES }: UseExtraCitySelectsOptions) => {
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [extraSelected, setExtraSelected] = useState<ExtraSelectedCities>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const isMaxReached = extraIds.length >= max;

  useEffect(() => {
    setExtraIds(readStoredStringArray(idsStorageKey));
    setIsHydrated(true);
  }, [idsStorageKey]);

  useEffect(() => {
    if (!isHydrated) return;

    writeStoredStringArray(idsStorageKey, extraIds);
  }, [extraIds, idsStorageKey, isHydrated]);

  const addExtra = useCallback(() => {
    setExtraIds((prev) => {
      if (prev.length >= max) return prev;

      return [...prev, uuidv4()];
    });
  }, [max]);

  const changeExtra = useCallback((id: string, value: CityFull | null) => {
    setExtraSelected((prev) => ({ ...prev, [id]: value }));
  }, []);

  const deleteExtra = useCallback(
    (id: string) => {
      setExtraIds((prev) => prev.filter((item) => item !== id));

      setExtraSelected((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`${cityStoragePrefix}:${id}`);
      }
    },
    [cityStoragePrefix]
  );

  return {
    extraIds,
    extraSelected,
    isMaxReached,
    addExtra,
    changeExtra,
    deleteExtra,
  };
};
