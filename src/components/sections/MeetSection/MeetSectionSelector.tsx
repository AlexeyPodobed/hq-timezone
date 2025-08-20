"use client";

import clsx from "clsx";
import { memo, useState, useCallback } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { useCitySelect } from "@/hooks/useCitySelect";
import { CityFull } from "@/types/cities";

import { MeetSectionResultsList } from "./MeetSectionResultsList";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, className }) => {
  const [baseA, baseB, ...selectableCities] = cities;

  const aCity = useCitySelect(selectableCities, { storageKey: "meetCityA" });
  const bCity = useCitySelect(selectableCities, { storageKey: "meetCityB", defaultCity: 1 });

  const [addedPairs, setAddedPairs] = useState<{ a: CityFull; b: CityFull }[]>([]);

  const handleAdd = useCallback(() => {
    if (aCity.selected && bCity.selected) {
      setAddedPairs((prev) => [...prev, { a: aCity.selected, b: bCity.selected }]);
    }
  }, [aCity.selected, bCity.selected]);

  return (
    <div className={clsx("meet-section__selector", className)}>
      <div className="meet-section__selects">
        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City A</h3>
          <CustomSelect
            options={aCity.options}
            value={aCity.selected?.name ?? ""}
            onChange={aCity.selectByName}
            onSearchChange={aCity.setSearch}
            placeholder="Select city"
            searchable
            variant="yellow"
          />
        </div>

        <div className="meet-section__select">
          <h3 className="meet-section__select-title">City B</h3>
          <CustomSelect
            options={bCity.options}
            value={bCity.selected?.name ?? ""}
            onChange={bCity.selectByName}
            onSearchChange={bCity.setSearch}
            placeholder="Select city"
            searchable
            variant="yellow"
          />
        </div>

        <div
          className="cursor-pointer"
          onClick={handleAdd}
        >
          <Icon
            name="plus"
            className="text-[2.875rem] text-yellow"
          />
        </div>
      </div>

      <div className="meet-section__select-results-list">
        <MeetSectionResultsList
          a={baseA}
          b={baseB}
        />

        {addedPairs.map((pair, index) => (
          <MeetSectionResultsList
            key={index}
            id={index}
            a={pair.a}
            b={pair.b}
          />
        ))}
      </div>
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";
