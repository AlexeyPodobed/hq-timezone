"use client";

import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { useCitySelect } from "@/hooks/useCitySelect";
import { CityFull } from "@/types/cities";

import { HeroCityList } from "./HeroCityList";
// import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
}

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities }) => {
  const { selected, options, setSearch, selectCity, selectByName } = useCitySelect(cities, {
    storageKey: "selectedHeroCity",
    debounceMs: 300,
  });

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={options}
          value={selected?.name ?? ""}
          onChange={selectByName}
          onSearchChange={setSearch}
          placeholder={"Select city"}
          searchable
        />
      </div>

      <div className="hero-section__main-content">{/* <HeroMainTime city={selected} /> */}</div>

      <HeroCityList
        cities={cities}
        onSelect={selectCity}
      />
    </>
  );
});

HeroCitySelector.displayName = "HeroCitySelector";
