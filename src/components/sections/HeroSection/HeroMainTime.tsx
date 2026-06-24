"use client";

import { clsx } from "clsx";
import { DateTime } from "luxon";
import { memo, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Time } from "@/components/base/Time";
import { CityFull } from "@/types/cities";
import { calcDayLength, formatCityTimeZoneVerbose, formatDateFromDateTime, getLocalTimeInTZ, getTimeDifferenceByTZ } from "@/utils/date";
import { getSunTimesByTimezone } from "@/utils/sun";
import { getCalculationTimezone, normalizeTimezone } from "@/utils/timezone";

import "./HeroSection.scss";

export interface HeroMainTimeProps {
  city: CityFull;
  className?: string;
}

export const HeroMainTime = memo<HeroMainTimeProps>(({ city, className }) => {
  const [timeDiff, setTimeDiff] = useState("");

  const { timezone, latitude, longitude } = city;
  const timezoneId = normalizeTimezone(timezone);
  const calculationTimezoneId = getCalculationTimezone(city);

  const time = getLocalTimeInTZ(calculationTimezoneId);

  const { sunrise, sunset } = useMemo(() => getSunTimesByTimezone(timezoneId, { latitude, longitude }), [timezoneId, latitude, longitude]);

  const sunriseStr = sunrise ? DateTime.fromJSDate(sunrise).toFormat("HH:mm:ss") : "";
  const sunsetStr = sunset ? DateTime.fromJSDate(sunset).toFormat("HH:mm:ss") : "";

  const dayLength = useMemo(() => {
    if (!sunrise || !sunset) return null;
    return calcDayLength(sunrise.toISOString(), sunset.toISOString());
  }, [sunrise, sunset]);

  const date = useMemo(() => formatDateFromDateTime(calculationTimezoneId), [calculationTimezoneId]);
  const formattedTimezone = useMemo(() => formatCityTimeZoneVerbose(city), [city]);

  useEffect(() => {
    setTimeDiff(getTimeDifferenceByTZ(calculationTimezoneId));
  }, [calculationTimezoneId]);

  return (
    <div className={clsx("hero-section__main-time", className)}>
      <div className="hero-section__main-time-block">
        <h3 className="hero-section__main-city">
          {city.name}, {city.country_name}
          {city.isTimezoneNotActive ? " (Inactive)" : ""}
        </h3>
        <h1 className="hero-section__main-time-value">
          <Time
            time={time}
            timezoneId={calculationTimezoneId}
          />
        </h1>
        <div className="hero-section__main-date">{date}</div>
      </div>

      <div className="hero-section__main-col-left">
        <div className="hero-section__main-sun">
          <Button
            asChild
            className="hero-section__main-sun__btn"
          >
            <Icon
              name="sun"
              className="text-light-blue text-[1.5625rem] lg:text-[30px]"
            />
            <Time
              time={sunriseStr}
              showSeconds={false}
              timezoneId={timezoneId}
              live={false}
            />
          </Button>
          <Button
            asChild
            className="hero-section__main-sun__btn"
          >
            <Icon
              name="moon"
              className="text-light-blue text-[1.5625rem] lg:text-[30px]"
            />
            <Time
              time={sunsetStr}
              showSeconds={false}
              timezoneId={timezoneId}
              live={false}
            />
          </Button>
          <span className="hero-section__main-day-time">{dayLength}</span>
        </div>

        <div className={clsx("hero-section__main-info", className)}>
          <Button
            asChild
            variant="black"
            size="lg"
            className="w-full cursor-default"
          >
            <span className="line-clamp-1 whitespace-break-spaces">{formattedTimezone}</span>
          </Button>
          <Button
            asChild
            variant="black"
            size="lg"
            className="w-full cursor-default"
          >
            <span className="line-clamp-1 whitespace-break-spaces">{timeDiff} Hours from your time</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

HeroMainTime.displayName = "HeroMainTime";
