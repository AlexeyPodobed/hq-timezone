"use client";

import { clsx } from "clsx";
import { addMinutes } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { memo, useMemo } from "react";

import { Time } from "@/components/base/Time";
import { MeetSectionResultsCity } from "@/components/sections/MeetSection/MeetSectionResultsCity.tsx";
import SwiperComponent from "@/components/swiper/SwiperComponent";
import SwiperNavigation from "@/components/swiper/SwiperNavigation";
import { useTimeStore } from "@/store/timeStore.ts";
import { CityFull } from "@/types/cities";
import { buildTzDayLabel } from "@/utils/date";
import { formatDiffHours, getSignedHourDiff } from "@/utils/timeDiff";

export interface MeetSectionResultsListProps {
  aCity: CityFull;
  bCity: CityFull;
  extraSelected?: Record<number, CityFull | null>;
  onDelete?: (id: string) => void;
  className?: string;
}

const buildUtcPairsFullDay = (baseUtc: Date, step = 30, count = 48, timezones: string[]) => {
  return Array.from({ length: count }, (_, i) => {
    const utc = addMinutes(baseUtc, i * step);
    return timezones.map((tz) => toZonedTime(utc, tz));
  });
};

export const MeetSectionResultsList = memo<MeetSectionResultsListProps>(({ aCity, bCity, extraSelected = {}, onDelete }) => {
  const labelA = useMemo(() => buildTzDayLabel(aCity.timeData?.timezoneId), [aCity]);
  const labelB = useMemo(() => buildTzDayLabel(bCity.timeData?.timezoneId), [bCity]);

  const tzACity = aCity?.timeData.timezoneId;
  const tzBCity = bCity?.timeData.timezoneId;

  const bCityDiffShort = useMemo(() => {
    if (!tzACity || !tzBCity) return "";
    const diff = getSignedHourDiff(tzACity, tzBCity);
    return formatDiffHours(diff);
  }, [tzACity, tzBCity]);

  const extraDiffs = useMemo(() => {
    const result: Record<string, string> = {};
    if (!tzACity) return result;

    for (const [id, city] of Object.entries(extraSelected)) {
      const tz = city?.timeData?.timezoneId;
      if (!tz) continue;

      const diff = getSignedHourDiff(tzACity, tz);
      result[id] = formatDiffHours(diff);
    }

    return result;
  }, [extraSelected, tzACity]);

  const allTimezones = useMemo(() => {
    const extras = Object.values(extraSelected)
      .filter(Boolean)
      .map((c) => c!.timeData?.timezoneId);
    return [aCity.timeData?.timezoneId, bCity.timeData?.timezoneId, ...extras.filter(Boolean)] as string[];
  }, [aCity, bCity, extraSelected]);

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
  };

  const is24hStore = useTimeStore((s) => s.is24h);

  return (
    <div className="meet-section__select-results">
      <div className="meet-section__results-cities">
        <MeetSectionResultsCity
          name={aCity.name}
          label={labelA}
        />
        <MeetSectionResultsCity
          name={bCity.name}
          diffShort={bCityDiffShort}
          label={labelB}
        />
        {Object.entries(extraSelected)
          .filter(([, city]) => city !== null)
          .map(([id, city]) => (
            <MeetSectionResultsCity
              key={id}
              name={city?.name}
              label={buildTzDayLabel(city!.timeData?.timezoneId)}
              diffShort={extraDiffs[id]}
              removeCallback={() => onDelete?.(id)}
              showRemoveBtn={true}
            />
          ))}
      </div>
      <div
        className={clsx(
          "meet-section__results-time",
          is24hStore ? "meet-section__results-time--24h-format" : "meet-section__results-time--12h-format"
        )}
      >
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
