"use client";

import { useQuery } from "@tanstack/react-query";

import { getCityWp } from "@/api/cities";
import { CITY_SEARCH_CACHE_TIME } from "@/consts/time";
import type { CityFull } from "@/types/cities";

export const cityKeys = {
  all: ["cities"] as const,
  search: (term: string) => [...cityKeys.all, "search", term] as const,
};

const isValidCity = (value: unknown): value is CityFull => {
  if (!value || typeof value !== "object") return false;

  const city = value as Partial<CityFull>;
  return typeof city.name === "string" && typeof city.timezone === "string";
};

interface UseCitySearchParams {
  term: string;
  minSearchLength: number;
}

export function useCitySearch({ term, minSearchLength }: UseCitySearchParams) {
  const normalizedTerm = term.trim().toLowerCase();
  const enabled = normalizedTerm.length >= minSearchLength;

  return useQuery({
    queryKey: cityKeys.search(normalizedTerm),
    queryFn: async ({ signal }) => {
      const { data } = await getCityWp(normalizedTerm, signal);

      return Array.isArray(data) ? data.filter(isValidCity) : [];
    },
    enabled,
    staleTime: CITY_SEARCH_CACHE_TIME,
    gcTime: CITY_SEARCH_CACHE_TIME,
    retry: 1,
  });
}
