import { cityMapping } from "city-timezones";

export function getCoordinatesFromTimezone(timezoneId: string) {
  const matches = cityMapping.filter((c) => c.timezone === timezoneId);
  if (!matches.length) throw new Error(`No cities found for ${timezoneId}`);

  const city = matches.sort((a, b) => b.pop - a.pop)[0];
  return { lat: city.lat, lon: city.lng };
}
