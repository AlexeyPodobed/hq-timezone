import { clsx } from "clsx";
import { memo } from "react";

import "./DiffrenceSection.scss";
import { Time } from "@/components/base/Time";
import { CityFull } from "@/types/cities";
import { formatDayFullInTZ } from "@/utils/date";

export interface DiffrenceCityListProps {
  aCity: CityFull;
  bCity: CityFull;
  className?: string;
}

export const DiffrenceCityList = memo<DiffrenceCityListProps>(({ aCity, bCity, className }) => {
  return (
    <div className={clsx("diffrence-section__city-list", className)}>
      {[aCity, bCity].map((city, i) => {
        return (
          <div
            key={i}
            className="diffrence-section__city-item"
          >
            <h3 className="diffrence-section__city-title">{city.name}</h3>
            <p className="diffrence-section__city-country">{city.timeData?.countryName}</p>
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
    </div>
  );
});

DiffrenceCityList.displayName = "DiffrenceCityList";
