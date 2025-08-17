"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";
import { getCityViaProxy, getCityTimeViaProxy } from "@/utils/cities";

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
  const maxRows = opts.maxRows ?? 5;
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
        const { data } = await getCityViaProxy({ q: term, maxRows }, ac.signal);
        const base = data.geonames ?? [];
        const enriched = await Promise.all(
          base.map(async (c) => {
            const { data: timeData } = await getCityTimeViaProxy({ lat: c.lat, lng: c.lng }, ac.signal);
            return { ...c, timeData } as CityFull;
          })
        );
        setExtraCities(enriched);
      } catch (err: any) {
        if (err?.name !== "AbortError") console.log("City search failed:", err);
      } finally {
        setIsFetching(false);
      }
    })();

    return () => ac.abort();
  }, [debounced, maxRows]);

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
