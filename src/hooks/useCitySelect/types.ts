import { CityFull } from "@/types/cities";

export interface UseCitySelectOptions {
  storageKey?: string;
  debounceMs?: number;
  defaultCity?: number;
  minSearchLength?: number;
  initialSelectedCity?: CityFull;
}

export interface ResolvedCitySelectOptions {
  storageKey: string;
  debounceMs: number;
  defaultCity: number;
  minSearchLength: number;
  initialSelectedCity?: CityFull;
}

export interface CitySelectOption {
  label: string;
  value: string;
}

export interface ParsedCityValue {
  name: string;
  timezone: CityFull["timezone"];
  isTimezoneNotActive?: CityFull["isTimezoneNotActive"];
}
