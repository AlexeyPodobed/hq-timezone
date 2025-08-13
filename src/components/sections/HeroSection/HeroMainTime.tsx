import { clsx } from "clsx";
import { memo, useMemo } from "react";

import "./HeroSection.scss";
import { Button } from "@/components/base/Button";
import { Time } from "@/components/base/Time";
import { calcDayLength } from "@/utils/gloabl";

export interface HeroMainTimeProps {
  city: string;
  time: string;
  date: string;
  sunRise?: string;
  sunSet?: string;
  className?: string;
}

export const HeroMainTime = memo<HeroMainTimeProps>(({ city, time, date, sunRise, sunSet, className }) => {
  const dayLength = useMemo(() => calcDayLength(sunRise, sunSet), [sunRise, sunSet]);

  return (
    <div className={clsx("hero-section__main-time", className)}>
      <div className="hero-section__main-time-block">
        {!!city && <h3 className="hero-section__main-city">{city}</h3>}
        {!!time && (
          <h1 className="hero-section__main-time-value">
            <Time time={time} />
          </h1>
        )}
        {date && <div className="hero-section__main-date">{date}</div>}
      </div>
      <div className="hero-section__main-sun">
        {sunRise && (
          <Button
            asChild
            className="w-[12.063rem]"
          >
            <Time
              time={sunRise}
              disableCounter
            />
          </Button>
        )}
        {sunSet && (
          <Button
            asChild
            className="w-[12.063rem]"
          >
            <Time
              time={sunSet}
              disableCounter
            />
          </Button>
        )}
        {dayLength && <span className="hero-section__main-day-time">{dayLength}</span>}
      </div>
    </div>
  );
});

HeroMainTime.displayName = "HeroMainTime";
