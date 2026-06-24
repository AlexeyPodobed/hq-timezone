import type { CityFull } from "@/types/cities";

export const DEFAULT_CITY_SELECT_STORAGE_KEY = "selectedCity";
export const DEFAULT_CITY_SELECT_DEFAULT_CITY_INDEX = 0;
export const DEFAULT_CITY_SELECT_MIN_SEARCH_LENGTH = 2;

export const FALLBACK_CITY: CityFull = {
  id: "",
  name: "",
  latitude: "",
  longitude: "",
  timezone: "",
  country_name: "",
  region: null,
};
