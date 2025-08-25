"use client";

import { memo, useEffect, useRef } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { useCitySelect } from "@/hooks/useCitySelect";
import type { CityFull } from "@/types/cities";

interface DiffrenceExtraSelectProps {
  cities: CityFull[];
  index: number;
  onChange?: (index: number, value: CityFull | null) => void;
}

export const DiffrenceExtraSelect = memo<DiffrenceExtraSelectProps>(({ cities, index, onChange }) => {
  const city = useCitySelect(cities, { storageKey: `diffrenceExtraCity${index}` });

  const previous = useRef<CityFull | null>(null);

  useEffect(() => {
    if (city.selected?.name === previous.current?.name) return;

    previous.current = city.selected;
    onChange?.(index, city.selected ?? null);
  }, [city.selected, index, onChange]);

  return (
    <>
      <h3 className="diffrence-section__select-title">and</h3>

      <div className="diffrence-section__select">
        <CustomSelect
          options={city.options}
          value={city.selected?.name ?? ""}
          onChange={city.selectByName}
          onSearchChange={city.setSearch}
          placeholder="Select city"
          searchable
          variant="yellow"
        />
      </div>
    </>
  );
});

DiffrenceExtraSelect.displayName = "DiffrenceExtraSelect";
