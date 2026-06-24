"use client";

import clsx from "clsx";
import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { MEET_CITY_A_STORAGE_KEY, MEET_CITY_B_STORAGE_KEY, MEET_EXTRA_CITY_STORAGE_PREFIX, MEET_EXTRA_IDS_STORAGE_KEY } from "@/consts/storageKeys";
import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import { useExtraCitySelects } from "@/hooks/useExtraCitySelects";
import { CityFull } from "@/types/cities";

import { MeetSectionExtraSelect } from "./MeetSectionExtraSelect";
import { MeetSectionResultsList } from "./MeetSectionResultsList";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, className }) => {
  const aCity = useCitySelect(cities, { storageKey: MEET_CITY_A_STORAGE_KEY });
  const bCity = useCitySelect(cities, { storageKey: MEET_CITY_B_STORAGE_KEY, defaultCity: 1 });
  const { extraIds, extraSelected, isMaxReached, addExtra, changeExtra, deleteExtra } = useExtraCitySelects({
    idsStorageKey: MEET_EXTRA_IDS_STORAGE_KEY,
    cityStoragePrefix: MEET_EXTRA_CITY_STORAGE_PREFIX,
  });

  return (
    <div className={clsx("meet-section__selector", className)}>
      <div className="meet-section__selects">
        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City A</h3>
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

        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City B</h3>
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

        {extraIds.map((id, index) => (
          <MeetSectionExtraSelect
            key={id}
            id={id}
            index={index}
            cities={cities}
            onChange={changeExtra}
          />
        ))}

        {!isMaxReached && (
          <div
            className="cursor-pointer transition-opacity hover:opacity-50"
            onClick={addExtra}
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
        onDelete={deleteExtra}
      />
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";
