"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import { CityFull } from "@/types/cities";

import { MeetSectionExtraSelect } from "./MeetSectionExtraSelect";
import { MeetSectionResultsList } from "./MeetSectionResultsList";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

const STORAGE_KEY = "meetExtraIds";

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, className }) => {
  const aCity = useCitySelect(cities, { storageKey: "meetCityA" });
  const bCity = useCitySelect(cities, { storageKey: "meetCityB", defaultCity: 1 });

  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [extraSelected, setExtraSelected] = useState<Record<string, CityFull | null>>({});

  const isMaxReached = extraIds.length >= 10;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    try {
      const parsed = JSON.parse(raw || "[]");
      if (Array.isArray(parsed)) {
        setExtraIds(parsed);
      }
    } catch (e) {
      console.warn("Failed to parse meetExtraIds");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(extraIds));
  }, [extraIds]);

  const handleAdd = useCallback(() => {
    if (isMaxReached) return;
    const newId = uuidv4();
    setExtraIds((prev) => [...prev, newId]);
  }, [isMaxReached]);

  const handleExtraChange = useCallback((id: string, value: CityFull | null) => {
    setExtraSelected((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleDeleteExtra = useCallback((id: string) => {
    setExtraIds((prev) => prev.filter((i) => i !== id));

    setExtraSelected((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`meetExtraCity:${id}`);
    }
  }, []);

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
            onChange={handleExtraChange}
          />
        ))}

        {!isMaxReached && (
          <div
            className="cursor-pointer transition-opacity hover:opacity-50"
            onClick={handleAdd}
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
        onDelete={handleDeleteExtra}
      />
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";
