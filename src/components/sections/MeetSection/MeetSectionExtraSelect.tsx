"use client";

import { memo, useEffect, useRef } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { useCitySelect } from "@/hooks/useCitySelect";
import type { CityFull } from "@/types/cities";

type Props = {
  cities: CityFull[];
  index: number;
  onChange?: (index: number, value: CityFull | null) => void;
};

export const MeetSectionExtraSelect = memo(function MeetSectionExtraSelect({ cities, index, onChange }: Props) {
  const city = useCitySelect(cities, { storageKey: `meetExtraCity${index}` });
  const label = `City ${String.fromCharCode(67 + index)}`;

  const previous = useRef<CityFull | null>(null);

  useEffect(() => {
    if (city.selected?.name === previous.current?.name) return;

    previous.current = city.selected;
    onChange?.(index, city.selected ?? null);
  }, [city.selected, index, onChange]);

  return (
    <div className="meet-section__select">
      <h3 className="meet-section__select-title">{label}</h3>
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
  );
});
