"use client";

import { memo, useMemo } from "react";

import { Time } from "@/components/base/Time";
import SwiperComponent from "@/components/swiper/SwiperComponent";
import SwiperNavigation from "@/components/swiper/SwiperNavigation";
import { CityFull } from "@/types/cities";
import { buildTzDayLabel, floorTo30, minutesToHHMM, normDayMinutes, toMinutes } from "@/utils/global";

export interface MeetSectionResultsListProps {
  a: CityFull;
  b: CityFull;
  className?: string;
}

const buildPairsFullDay = (startA: number, diffMinutes: number, step = 30) => {
  const rows = 1440 / step;
  const diff = normDayMinutes(diffMinutes);
  return Array.from({ length: rows }, (_, i) => {
    const a = startA + i * step;
    const b = a + diff;
    return { a: minutesToHHMM(a), b: minutesToHHMM(b) };
  });
};

export const MeetSectionResultsList = memo<MeetSectionResultsListProps>(({ a, b }) => {
  const labelA = useMemo(() => buildTzDayLabel(a.timeData?.timezoneId), [a]);
  const labelB = useMemo(() => buildTzDayLabel(b.timeData?.timezoneId), [b]);

  const startA = useMemo(() => floorTo30(toMinutes(a.timeData?.time)), [a]);
  const diffMinutes = useMemo(() => {
    const A = toMinutes(a.timeData?.time);
    const B = toMinutes(b.timeData?.time);
    const raw = normDayMinutes(B - A);
    return normDayMinutes(floorTo30(raw));
  }, [a, b]);

  const pairs = useMemo(() => buildPairsFullDay(startA, diffMinutes, 30), [startA, diffMinutes]);

  const swiperSettings = {
    slidesPerView: 5,
    navigation: {
      nextEl: ".arrow-next",
      prevEl: ".arrow-prev",
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 5,
      },
    },
  };

  return (
    <div className="meet-section__select-results">
      <div className="meet-section__results-cities">
        <div className="meet-section__results-city">
          <h4>{a.name}</h4>
          <p>{labelA}</p>
        </div>
        <div className="meet-section__results-city">
          <h4>{b.name}</h4>
          <p>{labelB}</p>
        </div>
      </div>

      <div className="meet-section__results-time">
        <SwiperComponent
          settings={swiperSettings}
          className="w-full max-w-full !ml-0 !mr-0 !overflow-visible"
        >
          {pairs.map((p, i) => (
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
