"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCityWp } from "@/api/cities";
import { debounceDelayTime, useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";
import { getCityTimeViaProxy } from "@/utils/cities";

export interface UseCitySelectOptions {
  storageKey?: string;
  debounceMs?: number;
  defaultCity?: number;
  enrichWithTimeData?: boolean;
}

// const uniqueByName = (list: CityFull[]) => {
//   const map = new Map<string, CityFull>();
//   for (const c of list) {
//     const key = `${c.name.trim().toLowerCase()}|${c.country_name?.trim().toLowerCase()}`;
//     if (!map.has(key)) map.set(key, c);
//   }
//   return Array.from(map.values());
// };

export function useCitySelect(initialCities: CityFull[], opts: UseCitySelectOptions = {}) {
  const storageKey = opts.storageKey ?? "selectedCity";
  const debounceMs = opts.debounceMs ?? debounceDelayTime;
  const defaultCity = opts.defaultCity ?? 0;
  const { enrichWithTimeData = false } = opts;

  const [selected, setSelected] = useState<CityFull>(initialCities[defaultCity]);
  const [search, setSearch] = useState("");
  const [extraCities, setExtraCities] = useState<CityFull[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const debounced = useDebounce(search, debounceMs);

  const allCities = useMemo(() => [...initialCities, ...extraCities], [initialCities, extraCities]);
  const options = useMemo(
    () =>
      allCities.map((c) => ({
        label: `${c.name}, ${c.country_name} ${c.region ? `, ${c.region}` : ""}`,
        value: JSON.stringify({ name: c.name, timezone: c.timezone }),
      })),
    [allCities]
  );

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
        const inInitial = initialCities.some((x) => x.name.toLowerCase() === c.name.toLowerCase() && x.timezone === c.timezone);
        return inInitial ? [] : [c];
      });
    },
    [initialCities, storageKey]
  );

  const selectByName = useCallback(
    (value: string) => {
      try {
        const { name, timezone } = JSON.parse(value);
        const found = allCities.find((c) => c.name.toLowerCase() === name.toLowerCase() && c.timezone === timezone);
        if (found) selectCity(found);
      } catch (err) {
        console.error("Invalid value for selectByName:", value, err);
      }
    },
    [allCities, selectCity]
  );

  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    if (typeof window === "undefined") return;
    restoredRef.current = true;

    (async () => {
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (!raw) return;
        const parsed: CityFull = JSON.parse(raw);

        if (!parsed?.name) return;

        if (enrichWithTimeData && !parsed.timeData) {
          try {
            const { data: timeData } = await getCityTimeViaProxy({ lat: parsed.latitude, lng: parsed.longitude });
            selectCity({ ...parsed, timeData });
          } catch (err) {
            console.warn("Failed to restore timeData:", err);
            selectCity(parsed);
          }
        } else {
          selectCity(parsed);
        }
      } catch {
        console.log("sessionStorage parse failed");
      }
    })();
  }, [selectCity, storageKey]);

  useEffect(() => {
    const term = debounced.trim();
    if (term !== "") return;

    const inInitial = initialCities.some((x) => x.name.toLowerCase() === selected.name.toLowerCase());
    setExtraCities(inInitial ? [] : [selected]);
  }, [debounced, selected]);

  const prevDebouncedRef = useRef("");

  useEffect(() => {
    const term = debounced.trim();

    if (!term || term === prevDebouncedRef.current) return;
    prevDebouncedRef.current = term;

    const ac = new AbortController();
    setIsFetching(true);

    (async () => {
      try {
        if (ac.signal.aborted) return;

        const { data } = await getCityWp(term, ac.signal);

        const enriched = enrichWithTimeData
          ? await Promise.all(
              data.map(async (c) => {
                if (ac.signal.aborted) return null;
                const { data: timeData } = await getCityTimeViaProxy({ lat: c.latitude, lng: c.longitude }, ac.signal);
                return { ...c, timeData } as CityFull;
              })
            ).then((res) => res.filter(Boolean) as CityFull[])
          : (data as CityFull[]);

        setExtraCities(enriched);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.log("City search failed:", err);
        }
      } finally {
        setIsFetching(false);
      }
    })();

    return () => {
      ac.abort();
    };
  }, [debounced, enrichWithTimeData]);

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
