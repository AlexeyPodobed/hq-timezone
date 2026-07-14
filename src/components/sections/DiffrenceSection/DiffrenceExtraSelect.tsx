"use client";

import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon.tsx";
import { DIFFRENCE_EXTRA_CITY_STORAGE_PREFIX } from "@/consts/storageKeys";
import { useExtraCitySelection } from "@/hooks/useExtraCitySelection";
import type { CityFull } from "@/types/cities";

interface DiffrenceExtraSelectProps {
  cities: CityFull[];
  id: string;
  initialSelectedCity?: CityFull;
  onChange?: (id: string, value: CityFull | null) => void;
  isLastItem?: boolean;
  addNewSelect: () => void;
}

export const DiffrenceExtraSelect = memo<DiffrenceExtraSelectProps>(({ cities, id, initialSelectedCity, onChange, isLastItem, addNewSelect }) => {
  const city = useExtraCitySelection({ cities, id, storagePrefix: DIFFRENCE_EXTRA_CITY_STORAGE_PREFIX, initialSelectedCity, onChange });
  const { isFetching, isError } = city;

  return (
    <>
      {!isLastItem && <h3 className="diffrence-section__select-title">and</h3>}

      {isLastItem && (
        <div
          className="cursor-pointer pr-4 add-diff transition-opacity hover:opacity-50"
          onClick={addNewSelect}
        >
          <Icon
            name="plus"
            className="text-2xl lg:text-[2.875rem] text-yellow"
          />
        </div>
      )}

      <div className="diffrence-section__select">
        <CustomSelect
          options={city.options}
          value={city.selectedValue}
          onChange={city.selectByName}
          onSearchChange={city.setSearch}
          getSelectedLabel={city.getSelectedLabel}
          placeholder="Select city"
          searchable
          isFetching={isFetching}
          isError={isError}
          variant="yellow"
        />
      </div>
    </>
  );
});

DiffrenceExtraSelect.displayName = "DiffrenceExtraSelect";
