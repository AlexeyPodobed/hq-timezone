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
            <div className="flex items-center">
              <div className="flex flex-col">
                <h3 className="diffrence-section__city-title">{city.name}</h3>
                <p className="diffrence-section__city-country">{city.timeData?.countryName}</p>
              </div>
            </div>

            <h4 className="diffrence-section__city-time">
              <Time
                time={city.timeData.time}
                timezoneId={city.timeData.timezoneId}
                showSeconds={false}
              />
              <span className="date">{formatDayFullInTZ(city.timeData.timezoneId)}</span>
            </h4>
          </div>
        );
      })}

      {Object.entries(extraSelected).map(([id, city]) => (
        <div
          key={id}
          className="diffrence-section__city-item"
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h3 className="diffrence-section__city-title">{city?.name}</h3>
              <p className="diffrence-section__city-country">{city?.timeData?.countryName}</p>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => onDelete?.(id)}
            >
              <Icon
                name="minus"
                className="text-[2.875rem] text-red-700"
              />
            </div>
          </div>

          <h4 className="diffrence-section__city-time">
            <Time
              time={city?.timeData.time}
              timezoneId={city?.timeData.timezoneId}
              showSeconds={false}
            />
            <span className="date">{formatDayFullInTZ(city!.timeData?.timezoneId)}</span>
          </h4>
        </div>
      ))}
    </div>
  );
});

DiffrenceCityList.displayName = "DiffrenceCityList";
