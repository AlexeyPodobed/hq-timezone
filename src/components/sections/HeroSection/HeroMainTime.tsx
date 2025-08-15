import { clsx } from "clsx";
import { memo, useMemo } from "react";

import "./HeroSection.scss";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Time } from "@/components/base/Time";
import { CityFull } from "@/types/cities";
import { calcDayLength, getTimeDifferenceByTZ } from "@/utils/gloabl";

export interface HeroMainTimeProps {
  city: CityFull;
  className?: string;
}

export const HeroMainTime = memo<HeroMainTimeProps>(({ city, className }) => {
  const { time, sunrise, sunset, timezoneId } = city.timeData;

  console.log("time:", time, "sunrise:", sunrise, "sunset:", sunset);

  const dayLength = useMemo(() => calcDayLength(sunrise, sunset), [sunrise, sunset]);
  const timeDiff = useMemo(() => getTimeDifferenceByTZ(timezoneId), [timezoneId]);
  const date = new Date().toDateString();

  return (
    <div className={clsx("hero-section__main-time", className)}>
      <div className="hero-section__main-time-block">
        <h3 className="hero-section__main-city">{city.name}</h3>
        <h1 className="hero-section__main-time-value">
          <Time time={time} />
        </h1>
        <div className="hero-section__main-date">{date}</div>
      </div>

      <div className="hero-section__main-col-left">
        <div className="hero-section__main-sun">
          <Button
            asChild
            className="w-[12.063rem] h-[5.375rem] cursor-default"
          >
            <Icon
              size="3.07rem"
              name="sun"
              className="text-light-blue"
            />
            <Time
              time={sunrise}
              showSeconds={false}
            />
          </Button>
          <Button
            asChild
            className="w-[12.063rem] h-[5.375rem] cursor-default"
          >
            <Icon
              size="3.07rem"
              name="moon"
              className="text-light-blue"
            />
            <Time
              time={sunset}
              showSeconds={false}
            />
          </Button>
          <span className="hero-section__main-day-time">{dayLength}</span>
        </div>

        <div className={clsx("hero-section__main-info", className)}>
          <Button
            asChild
            variant="black"
            size="lg"
            className="w-full h-[5.375rem] cursor-default"
          >
            {timezoneId}
          </Button>
          <Button
            asChild
            variant="black"
            size="lg"
            className="w-full h-[5.375rem] cursor-default"
          >
            {timeDiff} Hours from your time
          </Button>
        </div>
      </div>
    </div>
  );
});

HeroMainTime.displayName = "HeroMainTime";
