import { CityFull } from "@/types/cities";

import { CitySelectOption, ParsedCityValue } from "./types";

export const normalizeCityName = (value: string) => value.trim().toLowerCase();

export const areCitiesEqual = (left: Pick<CityFull, "name" | "timezone">, right: Pick<CityFull, "name" | "timezone">) => {
  return normalizeCityName(left.name) === normalizeCityName(right.name) && left.timezone === right.timezone;
};

export const isCityInList = (cities: CityFull[], target: Pick<CityFull, "name" | "timezone">) => {
  return cities.some((city) => areCitiesEqual(city, target));
};

const sanitizeTimezoneWord = (value?: string | null) => {
  if (!value) return "";
  return value
    .replace(/\btimezone\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const toCityOption = (city: CityFull): CitySelectOption => {
  const parts = [city.name, city.region, city.country_name].map((part) => sanitizeTimezoneWord(part)).filter(Boolean);

  return {
    label: parts.join(", "),
    value: JSON.stringify({ name: city.name, timezone: city.timezone }),
  };
};

export const parseCityValue = (value: string): ParsedCityValue | null => {
  try {
    const parsed = JSON.parse(value) as ParsedCityValue;

    if (!parsed?.name || !parsed?.timezone) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};
