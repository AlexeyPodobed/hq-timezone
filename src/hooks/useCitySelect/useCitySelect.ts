"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { debounceDelayTime, useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";

import { useCitySearch } from "../useCitySearch";
import { DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX, DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH, DEFAULT_CITY_SELECT_STORAGE_KEY } from "./constants";
import { readStoredCity, writeStoredCity } from "./storage";
import { UseCitySelectOptions } from "./types";
import { areCitiesEqual, getCitySelectedLabel, parseCityValue, toCityOption, toCitySelectValue } from "./utils";

export type { UseCitySelectOptions } from "./types";

interface CitySelectState {
  selected: CityFull;
  search: string;
}

const FALLBACK_CITY: CityFull = {
  id: "",
  name: "",
  latitude: "",
  longitude: "",
  timezone: "",
  country_name: "",
  region: null,
};

const isValidCity = (value: unknown): value is CityFull => {
  if (!value || typeof value !== "object") return false;

  const city = value as Partial<CityFull>;
  return typeof city.name === "string" && typeof city.timezone === "string";
};

type CitySelectAction = { type: "set-search"; value: string } | { type: "select-city"; city: CityFull };

const citySelectReducer = (state: CitySelectState, action: CitySelectAction): CitySelectState => {
  switch (action.type) {
    case "set-search":
      return { ...state, search: action.value };

    case "select-city":
      return {
        ...state,
        selected: action.city,
        search: "",
      };

    default:
      return state;
  }
};

const normalizeCityPart = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";

const getCityKey = (city: CityFull) => {
  if (city.id) return `id:${city.id}`;

  return [normalizeCityPart(city.name), normalizeCityPart(city.country_name), normalizeCityPart(city.timezone)].join("|");
};

const deduplicateCities = (cities: CityFull[]) => {
  const uniqueCities = new Map<string, CityFull>();

  for (const city of cities) {
    const key = getCityKey(city);

    if (!uniqueCities.has(key)) uniqueCities.set(key, city);
  }

  return Array.from(uniqueCities.values());
};

export function useCitySelect(initialCities: CityFull[], opts: UseCitySelectOptions = {}) {
  const storageKey = opts.storageKey ?? DEFAULT_CITY_SELECT_STORAGE_KEY;
  const debounceMs = opts.debounceMs ?? debounceDelayTime;
  const defaultCity = opts.defaultCity ?? DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX;
  const minSearchLength = opts.minSearchLength ?? DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH;
  const safeInitialCities = useMemo(() => (Array.isArray(initialCities) ? initialCities.filter(isValidCity) : []), [initialCities]);
  const initialSelectedCity = safeInitialCities[defaultCity] ?? safeInitialCities[0] ?? FALLBACK_CITY;

  const [state, dispatch] = useReducer(citySelectReducer, {
    selected: initialSelectedCity,
    search: "",
  });

  const { selected, search } = state;

  const setSearch = useCallback((value: string) => {
    dispatch({ type: "set-search", value });
  }, []);

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
      dispatch({ type: "select-city", city });
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
