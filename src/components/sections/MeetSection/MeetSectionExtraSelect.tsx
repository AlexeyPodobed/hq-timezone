"use client";

import { memo } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { MEET_EXTRA_CITY_STORAGE_PREFIX } from "@/consts/storageKeys";
import { useExtraCitySelection } from "@/hooks/useExtraCitySelection";
import type { CityFull } from "@/types/cities";

interface MeetSectionExtraSelectProps {
  cities: CityFull[];
  index: number;
  id: string;
  initialSelectedCity?: CityFull;
  onChange?: (id: string, value: CityFull | null) => void;
}

export const MeetSectionExtraSelect = memo<MeetSectionExtraSelectProps>(({ cities, index, id, initialSelectedCity, onChange }) => {
  const city = useExtraCitySelection({ cities, id, storagePrefix: MEET_EXTRA_CITY_STORAGE_PREFIX, initialSelectedCity, onChange });
  const { isFetching, isError } = city;

  const label = `City ${String.fromCharCode(67 + index)}`;

  return (
    <div className="meet-section__select">
      <h3 className="meet-section__select-title">{label}</h3>
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
  );
});

MeetSectionExtraSelect.displayName = "MeetSectionExtraSelect";
