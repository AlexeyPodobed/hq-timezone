"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { useCitySelect } from "@/hooks/useCitySelect";
import { CityFull } from "@/types/cities";

import { MeetSectionExtraSelect } from "./MeetSectionExtraSelect";
import { MeetSectionResultsList } from "./MeetSectionResultsList";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, className }) => {
  const aCity = useCitySelect(cities, { storageKey: "meetCityA" });
  const bCity = useCitySelect(cities, { storageKey: "meetCityB", defaultCity: 1 });

  const [extraCount, setExtraCount] = useState(0);
  const [extraSelected, setExtraSelected] = useState<Record<number, CityFull | null>>({});

  const handleExtraChange = useCallback((index: number, value: CityFull | null) => {
    setExtraSelected((prev) => ({ ...prev, [index]: value }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem("meetExtraCount");
    if (raw) {
      const parsed = parseInt(raw);
      if (!isNaN(parsed)) {
        setExtraCount(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("meetExtraCount", String(extraCount));
  }, [extraCount]);

  const handleAdd = () => {
    setExtraCount((prev) => prev + 1);
  };

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

        {Array.from({ length: extraCount }).map((_, index) => (
          <MeetSectionExtraSelect
            key={index}
            index={index}
            cities={cities}
            onChange={handleExtraChange}
          />
        ))}

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

      <MeetSectionResultsList
        a={aCity.selected}
        b={bCity.selected}
        extraSelected={extraSelected}
      />
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";
