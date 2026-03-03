"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { debounceDelayTime, useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";

import { useCitySearch } from "../useCitySearch";
import { DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX, DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH, DEFAULT_CITY_SELECT_STORAGE_KEY } from "./constants";
import { readStoredCity, writeStoredCity } from "./storage";
import { UseCitySelectOptions } from "./types";
import { areCitiesEqual, isCityInList, parseCityValue, toCityOption } from "./utils";

export type { UseCitySelectOptions } from "./types";

interface CitySelectState {
  selected: CityFull;
  search: string;
  extraCities: CityFull[];
}

type CitySelectAction =
  | { type: "set-search"; value: string }
  | { type: "select-city"; city: CityFull; extraCities: CityFull[] }
  | { type: "set-extra-cities"; cities: CityFull[] };

const citySelectReducer = (state: CitySelectState, action: CitySelectAction): CitySelectState => {
  switch (action.type) {
    case "set-search":
      return { ...state, search: action.value };
    case "select-city":
      return { ...state, selected: action.city, search: "", extraCities: action.extraCities };
    case "set-extra-cities":
      return { ...state, extraCities: action.cities };
    default:
      return state;
  }
};

// const uniqueByName = (list: CityFull[]) => {
//   const map = new Map<string, CityFull>();
//   for (const c of list) {
//     const key = `${c.name.trim().toLowerCase()}|${c.country_name?.trim().toLowerCase()}`;
//     if (!map.has(key)) map.set(key, c);
//   }
//   return Array.from(map.values());
// };

export function useCitySelect(initialCities: CityFull[], opts: UseCitySelectOptions = {}) {
  const storageKey = opts.storageKey ?? DEFAULT_CITY_SELECT_STORAGE_KEY;
  const debounceMs = opts.debounceMs ?? debounceDelayTime;
  const defaultCity = opts.defaultCity ?? DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX;
  const minSearchLength = opts.minSearchLength ?? DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH;

  const [state, dispatch] = useReducer(citySelectReducer, {
    selected: initialCities[defaultCity],
    search: "",
    extraCities: [],
  });
  const { selected, search, extraCities } = state;

  const setSearch = useCallback((value: string) => {
    dispatch({ type: "set-search", value });
  }, []);

  const setExtraCities = useCallback((cities: CityFull[]) => {
    dispatch({ type: "set-extra-cities", cities });
  }, []);

  const debounced = useDebounce(search, debounceMs);
  const { isFetching } = useCitySearch({ term: debounced, minSearchLength, onResults: setExtraCities });

  const allCities = useMemo(() => [...initialCities, ...extraCities], [initialCities, extraCities]);
  const options = useMemo(() => allCities.map(toCityOption), [allCities]);

  const selectCity = useCallback(
    (c: CityFull) => {
      writeStoredCity(storageKey, c);

      const inInitial = isCityInList(initialCities, c);
      dispatch({ type: "select-city", city: c, extraCities: inInitial ? [] : [c] });
    },
    [initialCities, storageKey]
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

  useEffect(() => {
    const term = debounced.trim();
    if (term.length >= minSearchLength) return;

    const inInitial = isCityInList(initialCities, selected);
    setExtraCities(inInitial ? [] : [selected]);
  }, [debounced, initialCities, minSearchLength, selected]);

  return {
    selected,
    isFetching,
    options,
    allCities,

    setSearch,
    selectCity,
    selectByName,
  };
}
