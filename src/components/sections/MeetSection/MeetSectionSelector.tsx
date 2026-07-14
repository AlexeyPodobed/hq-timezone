"use client";

import clsx from "clsx";
import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { MEET_CITY_A_STORAGE_KEY, MEET_CITY_B_STORAGE_KEY, MEET_EXTRA_CITY_STORAGE_PREFIX, MEET_EXTRA_IDS_STORAGE_KEY } from "@/consts/storageKeys";
import { useCitySectionSelection } from "@/hooks/useCitySectionSelection";
import { useCityUrlSync } from "@/hooks/useCityUrlSync";
import { useSectionExtraCities } from "@/hooks/useSectionExtraCities";
import { CityFull } from "@/types/cities";
import { CITY_URL_PARAM_KEYS } from "@/utils/cityUrlParams";

import { MeetSectionExtraSelect } from "./MeetSectionExtraSelect";
import { MeetSectionResultsList } from "./MeetSectionResultsList";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  initialSelectedCities?: CityFull[];
  className?: string;
}

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, initialSelectedCities = [], className }) => {
  const syncCityUrl = useCityUrlSync();
  const { aCity, bCity, initialExtraCities } = useCitySectionSelection({
    cities,
    initialSelectedCities,
    aStorageKey: MEET_CITY_A_STORAGE_KEY,
    bStorageKey: MEET_CITY_B_STORAGE_KEY,
  });
  const { extraIds, extraSelected, isMaxReached, handleAddExtra, handleChangeExtra, handleDeleteExtra } = useSectionExtraCities({
    sectionKey: CITY_URL_PARAM_KEYS.meet,
    cities,
    baseCities: [aCity.selected, bCity.selected],
    initialCities: initialExtraCities,
    extraIdsStorageKey: MEET_EXTRA_IDS_STORAGE_KEY,
    extraCityStoragePrefix: MEET_EXTRA_CITY_STORAGE_PREFIX,
    restoreFromStorage: initialSelectedCities.length === 0,
  });

  const syncMeetCities = (nextACity = aCity.selected, nextBCity = bCity.selected) => {
    syncCityUrl(CITY_URL_PARAM_KEYS.meet, [nextACity, nextBCity, ...Object.values(extraSelected).filter(Boolean)]);
  };

  const handleSelectACity = (value: string) => {
    const city = aCity.selectByName(value);
    if (city) syncMeetCities(city, bCity.selected);
  };

  const handleSelectBCity = (value: string) => {
    const city = bCity.selectByName(value);
    if (city) syncMeetCities(aCity.selected, city);
  };

  return (
    <div className={clsx("meet-section__selector", className)}>
      <div className="meet-section__selects">
        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City A</h3>
          <CustomSelect
            options={aCity.options}
            value={aCity.selectedValue}
            onChange={handleSelectACity}
            onSearchChange={aCity.setSearch}
            getSelectedLabel={aCity.getSelectedLabel}
            placeholder="Select city"
            searchable
            isFetching={aCity.isFetching}
            isError={aCity.isError}
            variant="yellow"
          />
        </div>

        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City B</h3>
          <CustomSelect
            options={bCity.options}
            value={bCity.selectedValue}
            onChange={handleSelectBCity}
            onSearchChange={bCity.setSearch}
            getSelectedLabel={bCity.getSelectedLabel}
            placeholder="Select city"
            searchable
            isFetching={bCity.isFetching}
            isError={bCity.isError}
            variant="yellow"
          />
        </div>

        {extraIds.map((id, index) => (
          <MeetSectionExtraSelect
            key={id}
            id={id}
            index={index}
            cities={cities}
            initialSelectedCity={initialExtraCities[index]}
            onChange={handleChangeExtra}
          />
        ))}

        {!isMaxReached && (
          <div
            className="cursor-pointer transition-opacity hover:opacity-50"
            onClick={() => {
              handleAddExtra();
            }}
          >
            <Icon
              name="plus"
              className="text-2xl lg:text-[2.875rem] text-yellow"
            />
          </div>
        )}
      </div>

      <MeetSectionResultsList
        aCity={aCity.selected}
        bCity={bCity.selected}
        extraSelected={extraSelected}
        onDelete={handleDeleteExtra}
      />
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";
