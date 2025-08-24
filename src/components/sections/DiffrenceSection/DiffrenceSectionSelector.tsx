"use client";

import { clsx } from "clsx";
import { memo, useMemo } from "react";

import "./DiffrenceSection.scss";

import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
import { useCitySelect } from "@/hooks/useCitySelect";
import { CityFull } from "@/types/cities";
import { getTimeDiff, formatDiffShort, formatDiffSentence } from "@/utils/timeDiff";

import { DiffrenceCityList } from "./DiffrenceCityList";
import { DiffrenceMainTime } from "./DiffrenceMainTime";

// import { DiffrenceMainTime } from "./DiffrenceMainTime";

export interface DiffrenceSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

export const DiffrenceSectionSelector = memo<DiffrenceSectionSelectorProps>(({ cities, className }) => {
  const aCity = useCitySelect(cities, { storageKey: "diffrenceCityA" });
  const bCity = useCitySelect(cities, { storageKey: "diffrenceCityB", defaultCity: 1 });

  const tzACity = aCity.selected?.timeData?.timezoneId;
  const tzBCity = bCity.selected?.timeData?.timezoneId;

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

  return (
    <div className={clsx("diffrence-section__selector-wrap", className)}>
      <div className="diffrence-section__selector">
        <div className="diffrence-section__selects">
          <h3 className="diffrence-section__select-title">Time Difference Between</h3>

          <div className="diffrence-section__select">
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

          <h3 className="diffrence-section__select-title">and</h3>

          <div className="diffrence-section__select">
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
            className="cursor-pointer transition-all"
            //   onClick={handleAdd}
          >
            <Icon
              name="plus"
              className="text-[2.875rem] text-yellow"
            />
          </div>
        </div>
      </div>

      <DiffrenceMainTime
        aCity={aCity.selected.name ?? ""}
        bCity={bCity.selected.name ?? ""}
        timeDiffrence={timeDiffrence ?? ""}
        sentence={sentence ?? ""}
      />
      <DiffrenceCityList
        aCity={aCity.selected}
        bCity={bCity.selected}
      />
    </div>
  );
});

DiffrenceSectionSelector.displayName = "DiffrenceSectionSelector";
