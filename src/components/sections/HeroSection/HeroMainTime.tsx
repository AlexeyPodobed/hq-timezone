"use client";

import { clsx } from "clsx";
import { DateTime } from "luxon";
import { memo, useEffect, useMemo, useState } from "react";

import "./HeroSection.scss";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Time } from "@/components/base/Time";
import { CityFull } from "@/types/cities";
import { calcDayLength, formatDateFromDateTime, formatTimeZoneVerbose, getLocalTimeInTZ, getTimeDifferenceByTZ } from "@/utils/date";
import { getSunTimesByTimezone } from "@/utils/sun";

export interface HeroMainTimeProps {
  city: CityFull;
  className?: string;
}

export const HeroMainTime = memo<HeroMainTimeProps>(({ city, className }) => {
  const [formattedTimezone, setFormattedTimezone] = useState("");
  const [timeDiff, setTimeDiff] = useState("");

  const { timezone } = city;
  const time = getLocalTimeInTZ(timezone);

  const { sunrise, sunset } = useMemo<{
    sunrise: Date | undefined;
    sunset: Date | undefined;
  }>(() => {
    return getSunTimesByTimezone(timezone);
  }, [timezone]);

  const sunriseStr = sunrise ? DateTime.fromJSDate(sunrise).toFormat("HH:mm:ss") : "";
  const sunsetStr = sunset ? DateTime.fromJSDate(sunset).toFormat("HH:mm:ss") : "";

  const dayLength = useMemo(() => {
    if (!sunrise || !sunset) return null;
    return calcDayLength(sunrise.toISOString(), sunset.toISOString());
  }, [sunrise, sunset]);

  const date = useMemo(() => formatDateFromDateTime(time), [time]);

  useEffect(() => {
    setTimeDiff(getTimeDifferenceByTZ(timezone));
    setFormattedTimezone(formatTimeZoneVerbose(timezone));
  }, [timezone]);

  return (
    <div className={clsx("hero-section__main-time", className)}>
      <div className="hero-section__main-time-block">
        <h3 className="hero-section__main-city">
          {city.name}, {city.country_name}
        </h3>
        <h1 className="hero-section__main-time-value">
          <Time
            time={time}
            timezoneId={timezone}
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
              timezoneId={timezone}
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
              timezoneId={timezone}
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
