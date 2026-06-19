"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./DiffrenceSection.scss";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { useCitySelect } from "@/hooks/useCitySelect/useCitySelect";
import { CityFull } from "@/types/cities";
import { getTimeDiff, formatDiffShort, formatDiffSentence } from "@/utils/timeDiff";

import { DiffrenceCityList } from "./DiffrenceCityList";
import { DiffrenceExtraSelect } from "./DiffrenceExtraSelect";
import { DiffrenceMainTime } from "./DiffrenceMainTime";

export interface DiffrenceSectionSelectorProps {
  cities: CityFull[];
}

const STORAGE_KEY = "diffrenceExtraIds";

export const DiffrenceSectionSelector = memo<DiffrenceSectionSelectorProps>(({ cities }) => {
  const aCity = useCitySelect(cities, { storageKey: "diffrenceCityA" });
  const bCity = useCitySelect(cities, { storageKey: "diffrenceCityB", defaultCity: 1 });
  const isFetchingA = aCity.isFetching;
  const isFetchingB = bCity.isFetching;

  const tzACity = aCity.selected?.timezone;
  const tzBCity = bCity.selected?.timezone;

  const diff = useMemo(() => {
    if (!tzACity || !tzBCity) return null;
    return getTimeDiff(tzACity, tzBCity);
  }, [tzACity, tzBCity]);

  const timeDiffrence = useMemo(() => {
    if (!diff) return "";
    return formatDiffShort(diff.hours, diff.minutes);
  }, [diff]);

  const sentence = useMemo(() => {
    if (!diff || !aCity.selected || !bCity.selected) return "";
    return formatDiffSentence(aCity.selected.name, bCity.selected.name, diff);
  }, [diff, aCity.selected, bCity.selected]);

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
      console.warn("Failed to parse diffrenceExtraIds");
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
      sessionStorage.removeItem(`diffrenceExtraCity:${id}`);
    }
  }, []);

  return (
    <div className="diffrence-section__selector-wrap">
      <div className="diffrence-section__selector">
        <div className="diffrence-section__selects">
          <h3 className="diffrence-section__select-title w-full lg:w-auto">Time Difference Between</h3>

          <div className="diffrence-section__select-wrapper">
            <div className="diffrence-section__select">
              <CustomSelect
                options={aCity.options}
                value={aCity.selectedValue}
                onChange={aCity.selectByName}
                onSearchChange={aCity.setSearch}
                getSelectedLabel={aCity.getSelectedLabel}
                placeholder="Select city"
                searchable
                isFetching={isFetchingA}
                variant="yellow"
              />
            </div>

            <h3 className="diffrence-section__select-title">and</h3>
          </div>

          <div className="diffrence-section__select-wrapper">
            <div className="diffrence-section__select">
              <CustomSelect
                options={bCity.options}
                value={bCity.selectedValue}
                onChange={bCity.selectByName}
                onSearchChange={bCity.setSearch}
                getSelectedLabel={bCity.getSelectedLabel}
                placeholder="Select city"
                searchable
                isFetching={isFetchingB}
                variant="yellow"
              />
            </div>

            {/* Output "and" for second static select, if some of them added */}
            {extraIds.length > 0 && <h3 className="diffrence-section__select-title">and</h3>}

            {/* If no extra selects - show btn. Hide when there are, because last item has this btn */}
            {!extraIds.length && (
              <div
                className="cursor-pointer pr-4 add-diff xl:pr-0 transition-opacity hover:opacity-50"
                onClick={handleAdd}
              >
                <Icon
                  name="plus"
                  className="text-2xl lg:text-[2.875rem] text-yellow"
                />
              </div>
            )}
          </div>

          {extraIds.map((id, index) => (
            <div
              className="diffrence-section__select-wrapper flex-row-reverse"
              key={id}
            >
              <DiffrenceExtraSelect
                id={id}
                cities={cities}
                onChange={handleExtraChange}
                isLastItem={index === extraIds.length - 1}
                addNewSelect={handleAdd}
              />
            </div>
          ))}
        </div>
      </div>

      <DiffrenceMainTime
        aCity={aCity.selected?.name ?? ""}
        bCity={bCity.selected?.name ?? ""}
        timeDiffrence={timeDiffrence}
        sentence={sentence}
      />

      <DiffrenceCityList
        aCity={aCity.selected}
        bCity={bCity.selected}
        extraSelected={extraSelected}
        onDelete={handleDeleteExtra}
      />
    </div>
  );
});

DiffrenceSectionSelector.displayName = "DiffrenceSectionSelector";
