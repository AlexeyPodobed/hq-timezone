// HeroCitySelector.tsx
"use client";

import { memo, useState, useCallback } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { CityFull } from "@/types/cities";

import { HeroCityList } from "./HeroCityList";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
}

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities }) => {
  console.log("HeroCitySelector", cities);

  const [city, setCity] = useState<CityFull>(cities[0]);

  const handleCityChange = useCallback((selectedCity: CityFull) => {
    setCity(selectedCity);
  }, []);

  console.log("city", city);

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={cities.map((c) => c.name)}
          value={city?.name ?? ""}
          onChange={(name) => {
            const selected = cities.find((c) => c.name === name);
            if (selected) setCity(selected);
          }}
          placeholder="Select city"
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
