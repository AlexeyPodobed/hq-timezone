"use client";

import { useEffect, useRef } from "react";

import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import type { CityFull } from "@/types/cities";

interface UseExtraCitySelectionOptions {
  cities: CityFull[];
  id: string;
  storagePrefix: string;
  onChange?: (id: string, value: CityFull | null) => void;
}

export const useExtraCitySelection = ({ cities, id, storagePrefix, onChange }: UseExtraCitySelectionOptions) => {
  const city = useCitySelect(cities, { storageKey: `${storagePrefix}:${id}` });
  const previous = useRef<CityFull | null>(null);

  useEffect(() => {
    if (city.selected?.name === previous.current?.name) return;

    previous.current = city.selected;
    onChange?.(id, city.selected ?? null);
  }, [city.selected, id, onChange]);

  return city;
};
