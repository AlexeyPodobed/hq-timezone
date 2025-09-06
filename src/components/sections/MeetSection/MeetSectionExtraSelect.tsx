"use client";

import { memo, useEffect, useRef } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { useCitySelect } from "@/hooks/useCitySelect";
import type { CityFull } from "@/types/cities";

interface MeetSectionExtraSelectProps {
  cities: CityFull[];
  index: number;
  id: string;
  onChange?: (id: string, value: CityFull | null) => void;
}

export const MeetSectionExtraSelect = memo<MeetSectionExtraSelectProps>(({ cities, index, id, onChange }) => {
  const city = useCitySelect(cities, { storageKey: `meetExtraCity:${id}` });
  const { isFetching } = city;

  const label = `City ${String.fromCharCode(67 + index)}`;

  const previous = useRef<CityFull | null>(null);

  useEffect(() => {
    if (city.selected?.name === previous.current?.name) return;

    previous.current = city.selected;
    onChange?.(id, city.selected ?? null);
  }, [city.selected, id, onChange]);

  return (
    <div className="meet-section__select">
      <h3 className="meet-section__select-title">{label}</h3>
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
  );
});

MeetSectionExtraSelect.displayName = "MeetSectionExtraSelect";
