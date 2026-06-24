import { debounceDelayTime } from "@/hooks/useDebounce";
import { CityFull } from "@/types/cities";

import { DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX, DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH, DEFAULT_CITY_SELECT_STORAGE_KEY } from "./constants";
import { CitySelectOption, ParsedCityValue, ResolvedCitySelectOptions, UseCitySelectOptions } from "./types";

export const normalizeCityName = (value: string) => value.trim().toLowerCase();

export const isValidCity = (value: unknown): value is CityFull => {
  if (!value || typeof value !== "object") return false;

  const city = value as Partial<CityFull>;
  return typeof city.name === "string" && typeof city.timezone === "string";
};

export const areCitiesEqual = (left: Pick<CityFull, "name" | "timezone">, right: Pick<CityFull, "name" | "timezone">) => {
  return normalizeCityName(left.name) === normalizeCityName(right.name) && left.timezone === right.timezone;
};

const normalizeCityPart = (value: string | null | undefined) => value?.trim().toLowerCase() ?? "";

const getCityKey = (city: CityFull) => {
  if (city.id) return `id:${city.id}`;

  return [normalizeCityPart(city.name), normalizeCityPart(city.country_name), normalizeCityPart(city.timezone)].join("|");
};

export const deduplicateCities = (cities: CityFull[]) => {
  const uniqueCities = new Map<string, CityFull>();

  for (const city of cities) {
    const key = getCityKey(city);

    if (!uniqueCities.has(key)) uniqueCities.set(key, city);
  }

  return Array.from(uniqueCities.values());
};

export const resolveCitySelectOptions = (opts: UseCitySelectOptions): ResolvedCitySelectOptions => ({
  storageKey: opts.storageKey ?? DEFAULT_CITY_SELECT_STORAGE_KEY,
  debounceMs: opts.debounceMs ?? debounceDelayTime,
  defaultCity: opts.defaultCity ?? DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX,
  minSearchLength: opts.minSearchLength ?? DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH,
});

const sanitizeTimezoneWord = (value?: string | null) => {
  if (!value) return "";
  return value
    .replace(/\btimezone\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const withInactiveLabel = (label: string, isInactive?: boolean) => {
  return isInactive ? `${label} (Inactive)` : label;
};

export const toCityOption = (city: CityFull): CitySelectOption => {
  const parts = [city.name, city.region, city.country_name].map((part) => sanitizeTimezoneWord(part)).filter(Boolean);

  return {
    label: withInactiveLabel(parts.join(", "), city.isTimezoneNotActive),
    value: toCitySelectValue(city),
  };
};

export const toCitySelectValue = (city?: Partial<CityFull> | null) => {
  return JSON.stringify({
    name: city?.name ?? "",
    timezone: city?.timezone ?? "",
    isTimezoneNotActive: city?.isTimezoneNotActive,
  });
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

export const getCitySelectedLabel = (value: string) => {
  const parsed = parseCityValue(value);
  if (!parsed) return value;

  return withInactiveLabel(parsed.name, parsed.isTimezoneNotActive);
};
