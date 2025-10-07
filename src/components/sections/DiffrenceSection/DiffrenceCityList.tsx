import { clsx } from "clsx";
import { memo } from "react";

import "./DiffrenceSection.scss";
import { Icon } from "@/components/base/Icon";
import { Time } from "@/components/base/Time";
import { CityFull } from "@/types/cities";
import { formatDayFullInTZ } from "@/utils/date";

export interface DiffrenceCityListProps {
  aCity: CityFull;
  bCity: CityFull;
  extraSelected?: Record<string, CityFull | null>;
  onDelete?: (id: string) => void;
  className?: string;
}

export const DiffrenceCityList = memo<DiffrenceCityListProps>(({ aCity, bCity, extraSelected = {}, onDelete, className }) => {
  return (
    <div className={clsx("diffrence-section__city-list", className)}>
      {[aCity, bCity].map((city, i) => {
        return (
          <div
            key={i}
            className="diffrence-section__city-item"
          >
            <div className="lg:flex lg:items-center">
              <div className="lg:flex lg:flex-col">
                <h3 className="diffrence-section__city-title">{city.name}</h3>
                <p className="diffrence-section__city-country">{city.country_name}</p>
              </div>
            </div>

            <h4 className="diffrence-section__city-time">
              <Time
                timezoneId={city.timezone}
                showSeconds={false}
              />
              <span className="date">{formatDayFullInTZ(city.timezone)}</span>
            </h4>
          </div>
        );
      })}

      {Object.entries(extraSelected).map(([id, city]) => (
        <div
          key={id}
          className="diffrence-section__city-item relative"
        >
          <div className="lg:flex lg:items-center">
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="diffrence-section__city-title relative lg:static lg:flex lg:items-center lg:gap-4">
                {city?.name}
                <div
                  className="cursor-pointer absolute lg:static -right-8 lg:right-0 top-1/2 lg:top-0 -translate-y-1/2 lg:translate-y-0 transition-opacity hover:opacity-50"
                  onClick={() => onDelete?.(id)}
                >
                  <Icon
                    name="minus"
                    className="text-[1rem] lg:text-[2rem] text-red-700"
                  />
                </div>
              </h3>
              <p className="diffrence-section__city-country">{city?.country_name}</p>
            </div>
          </div>

          <h4 className="diffrence-section__city-time">
            <Time
              timezoneId={city?.timezone}
              showSeconds={false}
            />
            <span className="date">{formatDayFullInTZ(city!.timezone)}</span>
          </h4>
        </div>
      ))}
    </div>
  );
});

DiffrenceCityList.displayName = "DiffrenceCityList";
