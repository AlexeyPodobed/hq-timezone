import type { CityFull } from "@/types/cities";
import { fetchCitiesFull } from "@/utils/cities";

export const CITY_URL_PARAM_KEYS = {
  hero: "h",
  meet: "m",
  difference: "d",
} as const;

export type CityUrlParamKey = (typeof CITY_URL_PARAM_KEYS)[keyof typeof CITY_URL_PARAM_KEYS];

export interface ParsedUrlCity {
  name: string;
  timezone: string;
}

export interface InitialCitySelections {
  hero?: CityFull;
  meet: CityFull[];
  difference: CityFull[];
}

type SearchParamsValue = string | string[] | undefined;
export type PageSearchParams = Record<string, SearchParamsValue>;

const CITY_SLUG_SEPARATOR = "-";
const CITY_LIST_SEPARATOR = "/";
const SECTION_PARAM_ORDER: CityUrlParamKey[] = [CITY_URL_PARAM_KEYS.hero, CITY_URL_PARAM_KEYS.meet, CITY_URL_PARAM_KEYS.difference];

const normalizeCityPart = (value: string | null | undefined) => value?.trim().replaceAll(" ", "_").replaceAll("/", "_").toLowerCase() ?? "";
const encodeCityPart = (value: string) => value.trim().replaceAll(" ", "_").replaceAll("/", "_");
const decodeCityNamePart = (value: string) => value.replaceAll("_", " ");

const getSingleParamValue = (value: SearchParamsValue) => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const getCityMatchKey = (city: Pick<CityFull, "name" | "timezone"> | ParsedUrlCity) => {
  return `${normalizeCityPart(city.name)}|${normalizeCityPart(city.timezone)}`;
};

const findMatchingCity = (cities: CityFull[], parsed: ParsedUrlCity) => {
  return cities.find((city) => getCityMatchKey(city) === getCityMatchKey(parsed));
};

export const encodeCityUrlSlug = (city: Pick<CityFull, "name" | "timezone">) => {
  return `${encodeCityPart(city.name)}${CITY_SLUG_SEPARATOR}${encodeCityPart(city.timezone)}`;
};

export const decodeCityUrlSlug = (slug: string): ParsedUrlCity | null => {
  const [name, ...timezoneParts] = slug.split(CITY_SLUG_SEPARATOR);
  const timezone = timezoneParts.join(CITY_SLUG_SEPARATOR);

  if (!name || !timezone) return null;

  return {
    name: decodeCityNamePart(name),
    timezone,
  };
};

export const parseCityUrlList = (value: SearchParamsValue): ParsedUrlCity[] => {
  return getSingleParamValue(value)
    .split(CITY_LIST_SEPARATOR)
    .map((slug) => decodeCityUrlSlug(slug.trim()))
    .filter((city): city is ParsedUrlCity => Boolean(city));
};

export const serializeCityUrlList = (cities: Array<CityFull | null | undefined>) => {
  return cities
    .filter((city): city is CityFull => Boolean(city))
    .map(encodeCityUrlSlug)
    .join(CITY_LIST_SEPARATOR);
};

export const applyCityUrlParam = (params: URLSearchParams, key: CityUrlParamKey, cities: Array<CityFull | null | undefined>) => {
  const value = serializeCityUrlList(cities);

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
};

export const sortCityUrlParams = (params: URLSearchParams) => {
  const sortedParams = new URLSearchParams();

  SECTION_PARAM_ORDER.forEach((key) => {
    const value = params.get(key);
    if (value) sortedParams.set(key, value);
  });

  params.forEach((value, key) => {
    if (!SECTION_PARAM_ORDER.includes(key as CityUrlParamKey)) {
      sortedParams.append(key, value);
    }
  });

  return sortedParams;
};

export const stringifyCityUrlParams = (params: URLSearchParams) => {
  return params.toString().replaceAll("%2F", "/");
};

export const resolveInitialCitySelections = async (searchParams: PageSearchParams, baseCities: CityFull[]): Promise<InitialCitySelections> => {
  const parsedHero = parseCityUrlList(searchParams[CITY_URL_PARAM_KEYS.hero]);
  const parsedMeet = parseCityUrlList(searchParams[CITY_URL_PARAM_KEYS.meet]);
  const parsedDifference = parseCityUrlList(searchParams[CITY_URL_PARAM_KEYS.difference]);
  const parsedCities = [...parsedHero, ...parsedMeet, ...parsedDifference];

  if (!parsedCities.length) {
    return { meet: [], difference: [] };
  }

  const missingCityNames = parsedCities.filter((city) => !findMatchingCity(baseCities, city)).map((city) => city.name);
  const fetchedCities = missingCityNames.length ? await fetchCitiesFull(missingCityNames) : [];
  const availableCities = [...baseCities, ...fetchedCities];
  const resolveList = (cities: ParsedUrlCity[]) =>
    cities.map((city) => findMatchingCity(availableCities, city)).filter((city): city is CityFull => Boolean(city));

  return {
    hero: resolveList(parsedHero)[0],
    meet: resolveList(parsedMeet),
    difference: resolveList(parsedDifference),
  };
};
