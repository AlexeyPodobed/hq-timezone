"use client";

import { clsx } from "clsx";
import { memo } from "react";

import "./MeetSection.scss";
import { CustomSelect } from "@/components/base/CustomSelect";
import { useCitySelect } from "@/hooks/useCitySelect";
import { CityFull } from "@/types/cities";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, className }) => {
  const a = useCitySelect(cities, { storageKey: "meetCityA" });
  const b = useCitySelect(cities, { storageKey: "meetCityB", defaultCity: 1 });

  return (
    <div className={clsx("meet-section__selector", className)}>
      <div className="meet-section__selects">
        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City A</h3>
          <CustomSelect
            options={a.options}
            value={a.selected?.name ?? ""}
            onChange={a.selectByName}
            onSearchChange={a.setSearch}
            placeholder={"Select city"}
            searchable
            variant="yellow"
          />
        </div>
        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City B</h3>
          <CustomSelect
            options={b.options}
            value={b.selected?.name ?? ""}
            onChange={b.selectByName}
            onSearchChange={b.setSearch}
            placeholder={"Select city"}
            searchable
            variant="yellow"
          />
        </div>
      </div>
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";
export default MeetSectionSelector;
