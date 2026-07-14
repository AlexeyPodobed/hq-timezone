"use client";

import { useMemo } from "react";

import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import type { CityFull } from "@/types/cities";

interface UseCitySectionSelectionOptions {
  cities: CityFull[];
  aStorageKey: string;
  bStorageKey: string;
  initialSelectedCities?: CityFull[];
  bDefaultCity?: number;
}

export const useCitySectionSelection = ({
  cities,
  aStorageKey,
  bStorageKey,
  initialSelectedCities = [],
  bDefaultCity = 1,
}: UseCitySectionSelectionOptions) => {
  const initialACity = initialSelectedCities[0];
  const initialBCity = initialSelectedCities[1];
  const initialExtraCities = useMemo(() => initialSelectedCities.slice(2), [initialSelectedCities]);

  const aCity = useCitySelect(cities, {
    storageKey: aStorageKey,
    initialSelectedCity: initialACity,
  });
  const bCity = useCitySelect(cities, {
    storageKey: bStorageKey,
    defaultCity: bDefaultCity,
    initialSelectedCity: initialBCity,
  });

  return {
    aCity,
    bCity,
    initialExtraCities,
  };
};
