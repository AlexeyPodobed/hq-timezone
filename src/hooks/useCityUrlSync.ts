"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

import type { CityFull } from "@/types/cities";
import { applyCityUrlParam, CityUrlParamKey, sortCityUrlParams, stringifyCityUrlParams } from "@/utils/cityUrlParams";

export const useCityUrlSync = () => {
  const pathname = usePathname();

  return useCallback(
    (key: CityUrlParamKey, cities: Array<CityFull | null | undefined>) => {
      const params = new URLSearchParams(window.location.search);

      applyCityUrlParam(params, key, cities);

      const sortedParams = sortCityUrlParams(params);
      const query = stringifyCityUrlParams(sortedParams);

      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname]
  );
};
