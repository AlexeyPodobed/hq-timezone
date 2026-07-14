"use client";

import { memo, useMemo } from "react";

import "./DiffrenceSection.scss";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import {
  DIFFRENCE_CITY_A_STORAGE_KEY,
  DIFFRENCE_CITY_B_STORAGE_KEY,
  DIFFRENCE_EXTRA_CITY_STORAGE_PREFIX,
  DIFFRENCE_EXTRA_IDS_STORAGE_KEY,
} from "@/consts/storageKeys";
import { useCitySectionSelection } from "@/hooks/useCitySectionSelection";
import { useCityUrlSync } from "@/hooks/useCityUrlSync";
import { useSectionExtraCities } from "@/hooks/useSectionExtraCities";
import { CityFull } from "@/types/cities";
import { CITY_URL_PARAM_KEYS } from "@/utils/cityUrlParams";
import { getTimeDiff, formatDiffShort, formatDiffSentence } from "@/utils/timeDiff";
import { getCalculationTimezone } from "@/utils/timezone";

import { DiffrenceCityList } from "./DiffrenceCityList";
import { DiffrenceExtraSelect } from "./DiffrenceExtraSelect";
import { DiffrenceMainTime } from "./DiffrenceMainTime";

export interface DiffrenceSectionSelectorProps {
  cities: CityFull[];
  initialSelectedCities?: CityFull[];
}

export const DiffrenceSectionSelector = memo<DiffrenceSectionSelectorProps>(({ cities, initialSelectedCities = [] }) => {
  const syncCityUrl = useCityUrlSync();
  const { aCity, bCity, initialExtraCities } = useCitySectionSelection({
    cities,
    initialSelectedCities,
    aStorageKey: DIFFRENCE_CITY_A_STORAGE_KEY,
    bStorageKey: DIFFRENCE_CITY_B_STORAGE_KEY,
  });
  const { extraIds, extraSelected, handleAddExtra, handleChangeExtra, handleDeleteExtra } = useSectionExtraCities({
    sectionKey: CITY_URL_PARAM_KEYS.difference,
    cities,
    baseCities: [aCity.selected, bCity.selected],
    initialCities: initialExtraCities,
    extraIdsStorageKey: DIFFRENCE_EXTRA_IDS_STORAGE_KEY,
    extraCityStoragePrefix: DIFFRENCE_EXTRA_CITY_STORAGE_PREFIX,
    restoreFromStorage: initialSelectedCities.length === 0,
  });

  const syncDifferenceCities = (nextACity = aCity.selected, nextBCity = bCity.selected) => {
    syncCityUrl(CITY_URL_PARAM_KEYS.difference, [nextACity, nextBCity, ...Object.values(extraSelected).filter(Boolean)]);
  };

  const handleSelectACity = (value: string) => {
    const city = aCity.selectByName(value);
    if (city) syncDifferenceCities(city, bCity.selected);
  };

  const handleSelectBCity = (value: string) => {
    const city = bCity.selectByName(value);
    if (city) syncDifferenceCities(aCity.selected, city);
  };

  const tzACity = aCity.selected ? getCalculationTimezone(aCity.selected) : "";
  const tzBCity = bCity.selected ? getCalculationTimezone(bCity.selected) : "";

  const diff = useMemo(() => {
    if (!tzACity || !tzBCity) return null;
    return getTimeDiff(tzACity, tzBCity);
  }, [tzACity, tzBCity]);

  const timeDiffrence = useMemo(() => {
    if (!diff) return "";
    return formatDiffShort(diff.hours, diff.minutes);
  }, [diff]);

  const sentence = useMemo(() => {
    if (!diff || !aCity.selected || !bCity.selected) return "";
    return formatDiffSentence(aCity.selected.name, bCity.selected.name, diff);
  }, [diff, aCity.selected, bCity.selected]);

  return (
    <div className="diffrence-section__selector-wrap">
      <div className="diffrence-section__selector">
        <div className="diffrence-section__selects">
          <h3 className="diffrence-section__select-title w-full lg:w-auto">Time Difference Between</h3>

          <div className="diffrence-section__select-wrapper">
            <div className="diffrence-section__select">
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

            <h3 className="diffrence-section__select-title">and</h3>
          </div>

          <div className="diffrence-section__select-wrapper">
            <div className="diffrence-section__select">
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

            {/* Output "and" for second static select, if some of them added */}
            {extraIds.length > 0 && <h3 className="diffrence-section__select-title">and</h3>}

            {/* If no extra selects - show btn. Hide when there are, because last item has this btn */}
            {!extraIds.length && (
              <div
                className="cursor-pointer pr-4 add-diff xl:pr-0 transition-opacity hover:opacity-50"
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

          {extraIds.map((id, index) => (
            <div
              className="diffrence-section__select-wrapper flex-row-reverse"
              key={id}
            >
              <DiffrenceExtraSelect
                id={id}
                cities={cities}
                initialSelectedCity={initialExtraCities[index]}
                onChange={handleChangeExtra}
                isLastItem={index === extraIds.length - 1}
                addNewSelect={handleAddExtra}
              />
            </div>
          ))}
        </div>
      </div>

      <DiffrenceMainTime
        aCity={aCity.selected?.name ?? ""}
        bCity={bCity.selected?.name ?? ""}
        timeDiffrence={timeDiffrence}
        sentence={sentence}
      />

      <DiffrenceCityList
        aCity={aCity.selected}
        bCity={bCity.selected}
        extraSelected={extraSelected}
        onDelete={handleDeleteExtra}
      />
    </div>
  );
});

DiffrenceSectionSelector.displayName = "DiffrenceSectionSelector";
