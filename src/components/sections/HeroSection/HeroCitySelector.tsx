"use client";

import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { SELECTED_HERO_CITY_STORAGE_KEY } from "@/consts/storageKeys";
import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import { CityFull } from "@/types/cities";

import { HeroCityList } from "./HeroCityList";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
}

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities }) => {
  const { selected, selectedValue, options, isFetching, getSelectedLabel, setSearch, selectCity, selectByName } = useCitySelect(cities, {
    storageKey: SELECTED_HERO_CITY_STORAGE_KEY,
  });

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={options}
          value={selectedValue}
          onChange={selectByName}
          onSearchChange={setSearch}
          getSelectedLabel={getSelectedLabel}
          placeholder={"Select city"}
          searchable
          isFetching={isFetching}
        />
      </div>

      <div className="hero-section__main-content">
        <HeroMainTime city={selected} />
      </div>

      <HeroCityList
        cities={cities}
        onSelect={selectCity}
      />
    </>
  );
});

HeroCitySelector.displayName = "HeroCitySelector";
