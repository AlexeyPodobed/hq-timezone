"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCityWp, getCitySunInfo } from "@/api/cities";
import { useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";
import { isoToHM, secsToHumanHM } from "@/utils/global";

export interface UseCitySelectOptions {
  storageKey?: string;
  debounceMs?: number;
  maxRows?: number;
  defaultCity?: number;
}

const uniqueByName = (list: CityFull[]) => {
  const map = new Map<string, CityFull>();
  for (const c of list) {
    const key = c.name.trim().toLowerCase();
    if (!map.has(key)) map.set(key, c);
  }
  return Array.from(map.values());
};

export function useCitySelect(initialCities: CityFull[], opts: UseCitySelectOptions = {}) {
  const storageKey = opts.storageKey ?? "selectedCity";
  const debounceMs = opts.debounceMs ?? 300;
  const defaultCity = opts.defaultCity ?? 0;

  const [selected, setSelected] = useState<CityFull>(initialCities[defaultCity]);
  const [search, setSearch] = useState("");
  const [extraCities, setExtraCities] = useState<CityFull[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const debounced = useDebounce(search, debounceMs);

  const allCities = useMemo(() => uniqueByName([...initialCities, ...extraCities]), [initialCities, extraCities]);
  const options = useMemo(() => allCities.map((c) => ({ label: c.name, value: c.name })), [allCities]);

  const selectCity = useCallback(
    (c: CityFull) => {
      setSelected(c);
      setSearch("");

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(c));
        } catch (e) {
          console.log("sessionStorage set failed:", e);
        }
      }

      setExtraCities(() => {
        const inInitial = initialCities.some((x) => x.name.toLowerCase() === c.name.toLowerCase());
        return inInitial ? [] : [c];
      });
    },
    [initialCities, storageKey]
  );

  const selectByName = useCallback(
    (name: string) => {
      const found = allCities.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (found) selectCity(found);
    },
    [allCities, selectCity]
  );

  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    if (typeof window === "undefined") return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return;
      const parsed: CityFull = JSON.parse(raw);
      if (parsed?.name) selectCity(parsed);
    } catch {
      console.log("sessionStorage parse failed");
    }
  }, [selectCity, storageKey]);

  useEffect(() => {
    const term = debounced.trim();
    if (term !== "") return;

    const inInitial = initialCities.some((x) => x.name.toLowerCase() === selected.name.toLowerCase());
    setExtraCities(inInitial ? [] : [selected]);
  }, [debounced, initialCities, selected]);

  useEffect(() => {
    const term = debounced.trim();
    if (!term) return;

    const ac = new AbortController();
    setIsFetching(true);

    (async () => {
      try {
        const { data } = await getCityWp(term, ac.signal);
        if (!Array.isArray(data)) {
          setExtraCities([]);
          return;
        }

        const enriched = await Promise.all(
          data.map(async (city) => {
            const { latitude, longitude, timezone } = city;
            if (!latitude || !longitude) return null;

            try {
              const { data: sunDataRaw } = await getCitySunInfo(
                {
                  latitude: Number(latitude),
                  longitude: Number(longitude),
                  daily: "sunrise,sunset,daylight_duration",
                  timezone: timezone || "auto",
                },
                ac.signal
              );

              const sunData = {
                sunrise: isoToHM(sunDataRaw.daily.sunrise?.[0]),
                sunset: isoToHM(sunDataRaw.daily.sunset?.[0]),
                daylight_duration: secsToHumanHM(sunDataRaw.daily.daylight_duration?.[0]),
              };

              return { ...city, sunData } as CityFull;
            } catch {
              return null;
            }
          })
        );

        setExtraCities(enriched.filter((c): c is CityFull => c !== null));
      } catch (err: any) {
        if (err?.name !== "AbortError") console.log("City search failed:", err);
      } finally {
        setIsFetching(false);
      }
    })();

    return () => ac.abort();
  }, [debounced]);

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
