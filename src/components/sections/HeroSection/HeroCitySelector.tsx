"use client";

import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { SELECTED_HERO_CITY_STORAGE_KEY } from "@/consts/storageKeys";
import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import { useCityUrlSync } from "@/hooks/useCityUrlSync";
import { CityFull } from "@/types/cities";
import { CITY_URL_PARAM_KEYS } from "@/utils/cityUrlParams";

import { HeroCityList } from "./HeroCityList";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroCitySelectProps {
  title: string;
  cities: CityFull[];
  initialSelectedCity?: CityFull;
}

export const HeroCitySelector = memo<HeroCitySelectProps>(({ title, cities, initialSelectedCity }) => {
  const syncCityUrl = useCityUrlSync();
  const { selected, selectedValue, options, isFetching, getSelectedLabel, setSearch, selectCity, selectByName } = useCitySelect(cities, {
    storageKey: SELECTED_HERO_CITY_STORAGE_KEY,
    initialSelectedCity,
  });

  const handleSelectByName = (value: string) => {
    const city = selectByName(value);
    if (city) syncCityUrl(CITY_URL_PARAM_KEYS.hero, [city]);
  };

  const handleSelectCity = (city: CityFull) => {
    selectCity(city);
    syncCityUrl(CITY_URL_PARAM_KEYS.hero, [city]);
  };

  return (
    <>
      <div className="hero-section__selector">
        <h1 className="hero-section__title">{title}</h1>
        <CustomSelect
          options={options}
          value={selectedValue}
          onChange={handleSelectByName}
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
        onSelect={handleSelectCity}
      />
    </>
  );
});

HeroCitySelector.displayName = "HeroCitySelector";
