"use client";

import { memo, useEffect, useRef } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon.tsx";
import { useCitySelect } from "@/hooks/useCitySelect";
import type { CityFull } from "@/types/cities";

interface DiffrenceExtraSelectProps {
  cities: CityFull[];
  id: string;
  onChange?: (id: string, value: CityFull | null) => void;
  isLastItem?: boolean;
  addNewSelect: () => void;
}

export const DiffrenceExtraSelect = memo<DiffrenceExtraSelectProps>(({ cities, id, onChange, isLastItem, addNewSelect }) => {
  const city = useCitySelect(cities, { storageKey: `diffrenceExtraCity:${id}` });
  const { isFetching } = city;

  const previous = useRef<CityFull | null>(null);

  useEffect(() => {
    if (city.selected?.name === previous.current?.name) return;

    previous.current = city.selected;
    onChange?.(id, city.selected ?? null);
  }, [city.selected, id, onChange]);

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
          value={city.selected?.name ?? ""}
          onChange={city.selectByName}
          onSearchChange={city.setSearch}
          getSelectedLabel={(value) => value}
          placeholder="Select city"
          searchable
          isFetching={isFetching}
          variant="yellow"
        />
      </div>
    </>
  );
});

DiffrenceExtraSelect.displayName = "DiffrenceExtraSelect";
