"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { CityFull } from "@/types/cities";

type ExtraSelectedCities = Record<string, CityFull | null>;

interface UseExtraCitySelectsOptions {
  idsStorageKey: string;
  cityStoragePrefix: string;
  initialCities?: CityFull[];
  restoreFromStorage?: boolean;
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

export const useExtraCitySelects = ({
  idsStorageKey,
  cityStoragePrefix,
  initialCities = [],
  restoreFromStorage = true,
  max = DEFAULT_MAX_EXTRA_CITIES,
}: UseExtraCitySelectsOptions) => {
  const initialIds = initialCities.map((_, index) => `url-extra-${index}`);
  const [extraIds, setExtraIds] = useState<string[]>(initialIds);
  const [extraSelected, setExtraSelected] = useState<ExtraSelectedCities>({});
  const [isHydrated, setIsHydrated] = useState(initialCities.length > 0 || !restoreFromStorage);
  const isMaxReached = extraIds.length >= max;

  useEffect(() => {
    if (initialCities.length || !restoreFromStorage) return;

    setExtraIds(readStoredStringArray(idsStorageKey));
    setIsHydrated(true);
  }, [idsStorageKey, initialCities.length, restoreFromStorage]);

  useEffect(() => {
    if (!isHydrated) return;

    writeStoredStringArray(idsStorageKey, extraIds);
  }, [extraIds, idsStorageKey, isHydrated]);

  const addExtra = useCallback(
    (defaultCity?: CityFull) => {
      const id = uuidv4();
      if (extraIds.length >= max) return null;

      setExtraIds((prev) => {
        return [...prev, id];
      });
      if (defaultCity) {
        setExtraSelected((prev) => ({ ...prev, [id]: defaultCity }));
      }

      return id;
    },
    [extraIds.length, max]
  );

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
