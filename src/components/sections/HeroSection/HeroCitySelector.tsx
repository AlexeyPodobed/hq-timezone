"use client";

import { memo, useState, useCallback, useEffect } from "react";

import { getCity, getCityTime } from "@/api/cities";
import { CustomSelect } from "@/components/base/CustomSelect";
import { CityFull } from "@/types/cities";

import { HeroCityList } from "./HeroCityList";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
}

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities }) => {
  const [city, setCity] = useState<CityFull>(cities[0]);
  const [search, setSearch] = useState("");
  const [extraCities, setExtraCities] = useState<CityFull[]>([]);

  const allCities = [...cities, ...extraCities.filter((e) => !cities.some((c) => c.name === e.name))];

  useEffect(() => {
    if (!search) {
      setExtraCities([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const { data } = await getCity({ q: search, maxRows: 5 });
        const cityNames = data.geonames;

        const enriched: CityFull[] = await Promise.all(
          cityNames.map(async (city) => {
            const { data: timeData } = await getCityTime({ lat: city.lat, lng: city.lng });
            return { ...city, timeData };
          })
        );

        setExtraCities(enriched);
      } catch (err) {
        console.log("City search failed:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const handleCityChange = useCallback((selectedCity: CityFull) => {
    setCity(selectedCity);
  }, []);

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={allCities.map((c) => c.name)}
          value={city?.name ?? ""}
          onChange={(name) => {
            const selected = allCities.find((c) => c.name === name);
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
