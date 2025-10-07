import { DateTime } from "luxon";
import SunCalc from "suncalc";

import { getCoordinatesFromTimezone } from "./coordinates";

export function getSunTimesByTimezone(timezoneId: string): {
  sunrise: Date;
  sunset: Date;
} {
  const { lat, lon } = getCoordinatesFromTimezone(timezoneId);

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
