import { CityFull } from "@/types/cities";

export interface UseCitySelectOptions {
  storageKey?: string;
  debounceMs?: number;
  defaultCity?: number;
  minSearchLength?: number;
}

export interface CitySelectOption {
  label: string;
  value: string;
}

export interface ParsedCityValue {
  name: string;
  timezone: CityFull["timezone"];
}
