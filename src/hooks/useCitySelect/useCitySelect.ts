"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";

import { useCitySearch } from "../useCitySearch";
import { FALLBACK_CITY } from "./constants";
import { readStoredCity, writeStoredCity } from "./storage";
import { UseCitySelectOptions } from "./types";
import {
  areCitiesEqual,
  deduplicateCities,
  getCitySelectedLabel,
  isValidCity,
  parseCityValue,
  resolveCitySelectOptions,
  toCityOption,
  toCitySelectValue,
} from "./utils";

export type { UseCitySelectOptions } from "./types";

export function useCitySelect(initialCities: CityFull[], opts: UseCitySelectOptions = {}) {
  const { storageKey, debounceMs, defaultCity, minSearchLength } = useMemo(() => resolveCitySelectOptions(opts), [opts]);
  const safeInitialCities = useMemo(() => (Array.isArray(initialCities) ? initialCities.filter(isValidCity) : []), [initialCities]);
  const initialSelectedCity = safeInitialCities[defaultCity] ?? safeInitialCities[0] ?? FALLBACK_CITY;

  const [selected, setSelectedCity] = useState(initialSelectedCity);
  const [search, setSearch] = useState("");

  const debounced = useDebounce(search, debounceMs);
  const {
    data: searchResults = [],
    isFetching,
    isError,
  } = useCitySearch({
    term: debounced,
    minSearchLength,
  });

  const allCities = useMemo(
    () => deduplicateCities([...safeInitialCities, ...searchResults, selected].filter(isValidCity)),
    [safeInitialCities, searchResults, selected]
  );
  const options = useMemo(() => allCities.map(toCityOption), [allCities]);
  const selectedValue = useMemo(() => toCitySelectValue(selected), [selected]);

  const selectCity = useCallback(
    (city: CityFull) => {
      if (!isValidCity(city)) return;

      writeStoredCity(storageKey, city);
      setSelectedCity(city);
      setSearch("");
    },
    [storageKey]
  );

  const selectByName = useCallback(
    (value: string) => {
      const parsed = parseCityValue(value);
      if (!parsed) {
        console.error("Invalid value for selectByName:", value);
        return;
      }

      const found = allCities.find((city) => areCitiesEqual(city, parsed));
      if (found) selectCity(found);
    },
    [allCities, selectCity]
  );

  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const restored = readStoredCity(storageKey);
    if (restored) {
      selectCity(restored);
    }
  }, [selectCity, storageKey]);

  return {
    selected,
    selectedValue,
    isFetching,
    isError,
    options,
    allCities,
    getSelectedLabel: getCitySelectedLabel,

    setSearch,
    selectCity,
    selectByName,
  };
}
