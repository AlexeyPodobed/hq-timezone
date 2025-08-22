"use client";

import { memo, useMemo } from "react";

import { Icon } from "@/components/base/Icon";
import { Time } from "@/components/base/Time";
import SwiperComponent from "@/components/swiper/SwiperComponent";
import SwiperNavigation from "@/components/swiper/SwiperNavigation";
import { CityFull } from "@/types/cities";
import { buildTzDayLabel, floorTo30, getNextDayLabel, minutesToHHMM, normDayMinutes, toMinutes } from "@/utils/global";

export interface MeetSectionResultsListProps {
  a: CityFull;
  b: CityFull;
  extraSelected?: Record<number, CityFull | null>;
  onDelete?: (index: number) => void;
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

export const MeetSectionResultsList = memo<MeetSectionResultsListProps>(({ a, b, extraSelected = {}, onDelete }) => {
  const labelA = useMemo(() => buildTzDayLabel(a.timeData?.timezoneId), [a]);
  const labelB = useMemo(() => buildTzDayLabel(b.timeData?.timezoneId), [b]);

  const startA = useMemo(() => floorTo30(toMinutes(a.timeData?.time)), [a]);
  const diffMinutes = useMemo(() => {
    const A = toMinutes(a.timeData?.time);
    const B = toMinutes(b.timeData?.time);
    const raw = normDayMinutes(B - A);
    return normDayMinutes(floorTo30(raw));
  }, [a, b]);

  const isMidnight = (time: string | undefined) => time?.startsWith("00:00");

  const pairs = useMemo(() => buildPairsFullDay(startA, diffMinutes, 30), [startA, diffMinutes]);

  const extraPairs = useMemo(() => {
    return Object.entries(extraSelected)
      .filter(([, city]) => city !== null)
      .reduce<Record<string, ReturnType<typeof buildPairsFullDay>>>((acc, [index, city]) => {
        const minutesC = toMinutes(city!.timeData?.time);
        const diffC = normDayMinutes(minutesC - toMinutes(a.timeData?.time));
        acc[index] = buildPairsFullDay(startA, floorTo30(diffC), 30);
        return acc;
      }, {});
  }, [extraSelected, a, startA]);

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
              className="meet-section__results-city"
              key={index}
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
          {pairs.map((p, i) => (
            <div
              key={i}
              className="meet-section__time-item"
            >
              <div className="meet-section__item-time">
                <Time
                  time={p.a}
                  live={false}
                  showSeconds={false}
                />

                {isMidnight(p.a) && <div className="meet-section__item-new-day">{getNextDayLabel(p.a)}</div>}
              </div>
              <div className="meet-section__item-time">
                <Time
                  time={p.b}
                  live={false}
                  showSeconds={false}
                />
                {isMidnight(p.b) && <div className="meet-section__item-new-day">{getNextDayLabel(p.b)}</div>}
              </div>

              {Object.entries(extraPairs).map(([index, pairList]) => (
                <div
                  key={index}
                  className="meet-section__item-time"
                >
                  <Time
                    time={pairList[i]?.b}
                    live={false}
                    showSeconds={false}
                  />
                  {isMidnight(pairList[i]?.b) && <div className="meet-section__item-new-day">{getNextDayLabel(pairList[i]?.b)}</div>}
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
