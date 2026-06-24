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
import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import { useExtraCitySelects } from "@/hooks/useExtraCitySelects";
import { CityFull } from "@/types/cities";
import { getTimeDiff, formatDiffShort, formatDiffSentence } from "@/utils/timeDiff";
import { getCalculationTimezone } from "@/utils/timezone";

import { DiffrenceCityList } from "./DiffrenceCityList";
import { DiffrenceExtraSelect } from "./DiffrenceExtraSelect";
import { DiffrenceMainTime } from "./DiffrenceMainTime";

export interface DiffrenceSectionSelectorProps {
  cities: CityFull[];
}

export const DiffrenceSectionSelector = memo<DiffrenceSectionSelectorProps>(({ cities }) => {
  const aCity = useCitySelect(cities, { storageKey: DIFFRENCE_CITY_A_STORAGE_KEY });
  const bCity = useCitySelect(cities, { storageKey: DIFFRENCE_CITY_B_STORAGE_KEY, defaultCity: 1 });

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

  const { extraIds, extraSelected, addExtra, changeExtra, deleteExtra } = useExtraCitySelects({
    idsStorageKey: DIFFRENCE_EXTRA_IDS_STORAGE_KEY,
    cityStoragePrefix: DIFFRENCE_EXTRA_CITY_STORAGE_PREFIX,
  });

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
                onChange={aCity.selectByName}
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
                onChange={bCity.selectByName}
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
                onClick={addExtra}
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
                onChange={changeExtra}
                isLastItem={index === extraIds.length - 1}
                addNewSelect={addExtra}
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
        onDelete={deleteExtra}
      />
    </div>
  );
});

DiffrenceSectionSelector.displayName = "DiffrenceSectionSelector";
