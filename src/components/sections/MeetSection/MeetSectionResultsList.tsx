"use client";

import { addMinutes } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { memo, useMemo } from "react";

import { Icon } from "@/components/base/Icon";
import { Time } from "@/components/base/Time";
import SwiperComponent from "@/components/swiper/SwiperComponent";
import SwiperNavigation from "@/components/swiper/SwiperNavigation";
import { CityFull } from "@/types/cities";
import { buildTzDayLabel } from "@/utils/global";

export interface MeetSectionResultsListProps {
  a: CityFull;
  b: CityFull;
  extraSelected?: Record<number, CityFull | null>;
  onDelete?: (index: number) => void;
  className?: string;
}

const buildUtcPairsFullDay = (baseUtc: Date, step = 30, count = 48, timezones: string[]) => {
  return Array.from({ length: count }, (_, i) => {
    const utc = addMinutes(baseUtc, i * step);
    return timezones.map((tz) => toZonedTime(utc, tz));
  });
};

export const MeetSectionResultsList = memo<MeetSectionResultsListProps>(({ a, b, extraSelected = {}, onDelete }) => {
  const labelA = useMemo(() => buildTzDayLabel(a.timeData?.timezoneId), [a]);
  const labelB = useMemo(() => buildTzDayLabel(b.timeData?.timezoneId), [b]);

  const allTimezones = useMemo(() => {
    const extras = Object.values(extraSelected)
      .filter(Boolean)
      .map((c) => c!.timeData?.timezoneId);
    return [a.timeData?.timezoneId, b.timeData?.timezoneId, ...extras.filter(Boolean)] as string[];
  }, [a, b, extraSelected]);

  const baseUtc = useMemo(() => {
    const now = new Date();
    const mins = now.getUTCMinutes();
    now.setUTCMinutes(mins < 30 ? 0 : 30, 0, 0);
    return now;
  }, []);

  const pairs = useMemo(() => buildUtcPairsFullDay(baseUtc, 30, 48, allTimezones), [baseUtc, allTimezones]);

  const isMidnight = (date: Date) => format(date, "HH:mm").startsWith("00:00");

  const swiperSettings = {
    slidesPerView: 5,
    navigation: {
      nextEl: ".arrow-next",
      prevEl: ".arrow-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 16 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 5 },
    },
  };

  return (
    <div className="meet-section__select-results">
      <div className="meet-section__results-cities">
        <div className="meet-section__results-city">
          <div className="meet-section__results-flex">
            <h4>{a.name}</h4>
            <p>{labelA}</p>
          </div>
        </div>
        <div className="meet-section__results-city">
          <div className="meet-section__results-flex">
            <h4>{b.name}</h4>
            <p>{labelB}</p>
          </div>
        </div>
        {Object.entries(extraSelected)
          .filter(([, city]) => city !== null)
          .map(([index, city]) => (
            <div
              key={index}
              className="meet-section__results-city"
            >
              <div className="meet-section__results-flex">
                <h4>{city?.name}</h4>
                <p>{buildTzDayLabel(city!.timeData?.timezoneId)}</p>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => onDelete?.(Number(index))}
              >
                <Icon
                  name="minus"
                  className="text-[2.875rem] text-red-700"
                />
              </div>
            </div>
          ))}
      </div>

      <div className="meet-section__results-time">
        <SwiperComponent
          settings={swiperSettings}
          className="w-full max-w-full !ml-0 !mr-0 !overflow-visible"
        >
          {pairs.map((row, i) => (
            <div
              key={i}
              className="meet-section__time-item"
            >
              {row.map((date, j) => (
                <div
                  key={j}
                  className="meet-section__item-time"
                >
                  <Time
                    time={format(date, "HH:mm")}
                    live={false}
                    showSeconds={false}
                  />
                  {isMidnight(date) && <div className="meet-section__item-new-day">{format(date, "dd MMM")}</div>}
                </div>
              ))}
            </div>
          ))}
        </SwiperComponent>

        <SwiperNavigation
          prevClassName="arrow-prev"
          nextClassName="arrow-next"
          direction="both"
          className="meet-section__results-nav"
        />
      </div>
    </div>
  );
});

MeetSectionResultsList.displayName = "MeetSectionResultsList";
