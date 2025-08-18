"use client";

import { clsx } from "clsx";
import { memo, useMemo } from "react";

import "./MeetSection.scss";
import { CustomSelect } from "@/components/base/CustomSelect";
import { Icon } from "@/components/base/Icon";
// import { Time } from "@/components/base/Time";
import { useCitySelect } from "@/hooks/useCitySelect";
import { CityFull } from "@/types/cities";
import { buildTzDayLabel } from "@/utils/global";

export interface MeetSectionSelectorProps {
  cities: CityFull[];
  className?: string;
}

// const buildPairsFullDay = (startA: number, diffMinutes: number, step = 30) => {
//   const rows = 1440 / step;
//   const diff = normDayMinutes(diffMinutes);
//   return Array.from({ length: rows }, (_, i) => {
//     const a = startA + i * step;
//     const b = a + diff;
//     return { a: minutesToHHMM(a), b: minutesToHHMM(b) };
//   });
// };

export const MeetSectionSelector = memo<MeetSectionSelectorProps>(({ cities, className }) => {
  const aCity = useCitySelect(cities, { storageKey: "meetCityA" });
  const bCity = useCitySelect(cities, { storageKey: "meetCityB", defaultCity: 1 });

  const aLabel = useMemo(() => buildTzDayLabel(aCity.selected?.timezone), [aCity.selected]);
  const bLabel = useMemo(() => buildTzDayLabel(bCity.selected?.timezone), [bCity.selected]);

  // const diffMinutes = useMemo(() => {
  //   const A = toMinutes(aCity.selected?.timezone);
  //   const B = toMinutes(bCity.selected?.timezone);
  //   const raw = normDayMinutes(B - A);
  //   return normDayMinutes(floorTo30(raw));
  // }, [aCity.selected, bCity.selected]);

  // const startA = useMemo(() => floorTo30(toMinutes(aCity.selected?.timeData?.time)), [aCity.selected]);
  // const pairs = useMemo(() => buildPairsFullDay(startA, diffMinutes, 30), [startA, diffMinutes]);

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
            placeholder={"Select city"}
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
            placeholder={"Select city"}
            searchable
            variant="yellow"
          />
        </div>

        <div className="cursor-pointer">
          <Icon
            name="plus"
            className="text-[2.875rem] text-yellow"
          />
        </div>
      </div>

      <div className="meet-section__select-results">
        <div className="meet-section__results-cities">
          <div className="meet-section__results-city">
            <h4>{aCity.selected?.name}</h4>
            <p>{aLabel}</p>
          </div>
          <div className="meet-section__results-city">
            <h4>{bCity.selected?.name}</h4>
            <p>{bLabel}</p>
          </div>
        </div>

        <div className="meet-section__results-time">
          {/* {pairs.map((p, i) => (
            <div
              key={i}
              className="meet-section__time-item"
            >
              <div className="meet-section__item-time meet-section__item-time-aCity">
                <Time
                  time={p.a}
                  live={false}
                  showSeconds={false}
                />
              </div>
              <div className="meet-section__item-time meet-section__item-time-bCity">
                <Time
                  time={p.b}
                  live={false}
                  showSeconds={false}
                />
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
});

MeetSectionSelector.displayName = "MeetSectionSelector";

export default MeetSectionSelector;
