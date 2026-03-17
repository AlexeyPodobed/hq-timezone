import { DateTime } from "luxon";
import SunCalc from "suncalc";

import { getCoordinatesFromTimezone } from "./coordinates";

type CoordinatesLike = {
  latitude?: number | string | null;
  longitude?: number | string | null;
};

const toNumberOrNull = (value?: number | string | null): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function getSunTimesByTimezone(
  timezoneId: string,
  coords?: CoordinatesLike
): {
  sunrise: Date | undefined;
  sunset: Date | undefined;
} {
  const latFromCity = toNumberOrNull(coords?.latitude);
  const lonFromCity = toNumberOrNull(coords?.longitude);

  let lat = latFromCity;
  let lon = lonFromCity;

  if (lat === null || lon === null) {
    try {
      const byTimezone = getCoordinatesFromTimezone(timezoneId);
      lat = byTimezone.lat;
      lon = byTimezone.lon;
    } catch {
      return { sunrise: undefined, sunset: undefined };
    }
  }

  if (lat === null || lon === null) {
    return { sunrise: undefined, sunset: undefined };
  }

  const today = DateTime.now().setZone(timezoneId);
  const localDate = DateTime.fromObject({ year: today.year, month: today.month, day: today.day, hour: 12 }, { zone: timezoneId });

  const utcDate = localDate.toUTC().toJSDate();

  const result = SunCalc.getTimes(utcDate, lat, lon);

  const sunrise = DateTime.fromJSDate(result.sunrise).setZone(timezoneId);
  const sunset = DateTime.fromJSDate(result.sunset).setZone(timezoneId);

  const sunriseLocal = new Date(sunrise.year, sunrise.month - 1, sunrise.day, sunrise.hour, sunrise.minute, sunrise.second, sunrise.millisecond);

  const sunsetLocal = new Date(sunset.year, sunset.month - 1, sunset.day, sunset.hour, sunset.minute, sunset.second, sunset.millisecond);

  return {
    sunrise: sunriseLocal,
    sunset: sunsetLocal,
  };
}
