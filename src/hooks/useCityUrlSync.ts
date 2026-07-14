"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { CityFull } from "@/types/cities";
import { applyCityUrlParam, CityUrlParamKey, sortCityUrlParams } from "@/utils/cityUrlParams";

export const useCityUrlSync = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (key: CityUrlParamKey, cities: Array<CityFull | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      applyCityUrlParam(params, key, cities);

      const sortedParams = sortCityUrlParams(params);
      const query = sortedParams.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );
};
