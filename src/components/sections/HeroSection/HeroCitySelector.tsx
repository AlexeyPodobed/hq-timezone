"use client";

import { memo, useState, useCallback, useEffect, useMemo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";
import { getCityTimeViaProxy, getCityViaProxy } from "@/utils/cities";

import { HeroCityList } from "./HeroCityList";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
}

const uniqueByName = (list: CityFull[]) => {
  const map = new Map<string, CityFull>();
  for (const c of list) {
    const key = c.name.trim().toLowerCase();
    if (!map.has(key)) map.set(key, c);
  }
  return Array.from(map.values());
};

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities }) => {
  const [city, setCity] = useState<CityFull>(cities[0]);
  const [search, setSearch] = useState("");
  const [extraCities, setExtraCities] = useState<CityFull[]>([]);
  const debounced = useDebounce(search, 300);

  const allCities = useMemo(() => uniqueByName([...cities, ...extraCities]), [cities, extraCities]);

  const selectCity = useCallback(
    (selected: CityFull) => {
      setCity(selected);
      setSearch("");
      sessionStorage.setItem("selectedHeroCity", JSON.stringify(selected));

      setExtraCities((prev) => {
        const exists = [...cities, ...prev].some((c) => c.name.toLowerCase() === selected.name.toLowerCase());
        return exists ? prev : [...prev, selected];
      });
    },
    [cities]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("selectedHeroCity");
    if (!saved) return;

    try {
      const parsed: CityFull = JSON.parse(saved);
      selectCity(parsed);
    } catch {
      console.log("Invalid session city");
    }
  }, [selectCity]);

  useEffect(() => {
    const term = debounced.trim();
    const ac = new AbortController();

    if (!term) return;

    (async () => {
      try {
        const { data } = await getCityViaProxy({ q: term, maxRows: 5 }, ac.signal);
        const enriched = await Promise.all(
          (data.geonames ?? []).map(async (c) => {
            const { data: timeData } = await getCityTimeViaProxy({ lat: c.lat, lng: c.lng }, ac.signal);
            return { ...c, timeData };
          })
        );
        setExtraCities(enriched);
      } catch (err: any) {
        if (err?.name !== "AbortError") console.log("City search failed:", err);
      }
    })();

    return () => ac.abort();
  }, [debounced]);

  const handleCityChange = useCallback(
    (selected: CityFull) => {
      selectCity(selected);
    },
    [selectCity]
  );

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={allCities.map((c) => ({ label: c.name, value: c.name }))}
          value={city?.name ?? ""}
          onChange={(name) => {
            const selected = allCities.find((c) => c.name.toLowerCase() === name.toLowerCase());
            if (selected) selectCity(selected);
          }}
          onSearchChange={setSearch}
          placeholder="Select city"
          searchable
        />
      </div>

      <div className="hero-section__main-content">
        <HeroMainTime city={city} />
      </div>

      <HeroCityList
        cities={cities}
        onSelect={handleCityChange}
      />
    </>
  );
});

HeroCitySelector.displayName = "HeroCitySelector";
