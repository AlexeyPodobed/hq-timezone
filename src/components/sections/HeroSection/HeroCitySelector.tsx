"use client";

import { memo, useState, useCallback, useEffect, useMemo } from "react";

import { getCity, getCityTime } from "@/api/cities";
import { CustomSelect } from "@/components/base/CustomSelect";
import { useDebounce } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";

import { HeroCityList } from "./HeroCityList";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
}

const uniqueByName = (list: CityFull[]) => {
  const seen = new Set<string>();
  return list.filter((c) => {
    const key = c.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities }) => {
  const [city, setCity] = useState<CityFull>(cities[0]);
  const [search, setSearch] = useState("");
  const [extraCities, setExtraCities] = useState<CityFull[]>([]);
  const debounced = useDebounce(search, 300);

  const allCities = useMemo(() => uniqueByName([...cities, ...extraCities]), [cities, extraCities]);

  useEffect(() => {
    const term = debounced.trim();

    const ac = new AbortController();
    if (!term) {
      setExtraCities([]);
      ac.abort();
      return;
    }

    (async () => {
      try {
        const { data } = await getCity({ q: term, maxRows: 5 }, ac.signal);
        const enriched = await Promise.all(
          (data.geonames ?? []).map(async (city) => {
            const { data: timeData } = await getCityTime({ lat: city.lat, lng: city.lng }, ac.signal);
            return { ...city, timeData };
          })
        );
        setExtraCities(enriched);
      } catch (err: any) {
        if (err?.name !== "AbortError") console.log("City search failed:", err);
      }
    })();

    return () => ac.abort();
  }, [debounced]);

  const handleCityChange = useCallback((selectedCity: CityFull) => {
    setCity(selectedCity);
  }, []);

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={allCities.map((c) => ({ label: c.name, value: c.name }))}
          value={city?.name ?? ""}
          onChange={(name) => {
            const selected = allCities.find((c) => c.name.toLowerCase() === name.toLowerCase());
            if (selected) {
              setCity(selected);
              setSearch("");
              setExtraCities([]);
            }
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
