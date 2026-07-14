"use client";

import { useCallback, useRef } from "react";

import { useCityUrlSync } from "@/hooks/useCityUrlSync";
import { useExtraCitySelects } from "@/hooks/useExtraCitySelects";
import type { CityFull } from "@/types/cities";
import type { CityUrlParamKey } from "@/utils/cityUrlParams";

interface UseSectionExtraCitiesOptions {
  sectionKey: CityUrlParamKey;
  initialCities?: CityFull[];
  cities: CityFull[];
  baseCities: Array<CityFull | null | undefined>;
  extraIdsStorageKey: string;
  extraCityStoragePrefix: string;
  restoreFromStorage?: boolean;
}

export const useSectionExtraCities = ({
  sectionKey,
  initialCities = [],
  cities,
  baseCities,
  extraIdsStorageKey,
  extraCityStoragePrefix,
  restoreFromStorage = true,
}: UseSectionExtraCitiesOptions) => {
  const syncCityUrl = useCityUrlSync();
  const initializedExtraIds = useRef(new Set<string>());
  const defaultExtraCity = cities[0];

  const { extraIds, extraSelected, isMaxReached, addExtra, changeExtra, deleteExtra } = useExtraCitySelects({
    idsStorageKey: extraIdsStorageKey,
    cityStoragePrefix: extraCityStoragePrefix,
    initialCities,
    restoreFromStorage,
  });

  const getExtraCities = useCallback(
    (nextExtraSelected = extraSelected, nextExtraIds = extraIds) => {
      return nextExtraIds.map((id) => nextExtraSelected[id]).filter((city): city is CityFull => Boolean(city));
    },
    [extraIds, extraSelected]
  );

  const syncSectionCities = useCallback(
    (nextExtraSelected = extraSelected, nextExtraIds = extraIds) => {
      syncCityUrl(sectionKey, [...baseCities, ...getExtraCities(nextExtraSelected, nextExtraIds)]);
    },
    [baseCities, extraIds, extraSelected, getExtraCities, sectionKey, syncCityUrl]
  );

  const handleAddExtra = useCallback(() => {
    if (!defaultExtraCity) return;

    const id = addExtra(defaultExtraCity);
    if (!id) return;

    const nextExtraIds = [...extraIds, id];
    initializedExtraIds.current.add(id);
    syncSectionCities(
      {
        ...extraSelected,
        [id]: defaultExtraCity,
      },
      nextExtraIds
    );
  }, [addExtra, defaultExtraCity, extraIds, extraSelected, syncSectionCities]);

  const handleChangeExtra = useCallback(
    (id: string, value: CityFull | null) => {
      const nextExtraSelected = { ...extraSelected, [id]: value };
      const isFirstExtraChange = !initializedExtraIds.current.has(id);

      initializedExtraIds.current.add(id);
      changeExtra(id, value);
      if (isFirstExtraChange) return;

      syncSectionCities(nextExtraSelected);
    },
    [changeExtra, extraSelected, syncSectionCities]
  );

  const handleDeleteExtra = useCallback(
    (id: string) => {
      const nextExtraSelected = { ...extraSelected };
      delete nextExtraSelected[id];

      deleteExtra(id);
      syncCityUrl(sectionKey, [
        ...baseCities,
        ...extraIds
          .filter((item) => item !== id)
          .map((item) => nextExtraSelected[item])
          .filter(Boolean),
      ]);
    },
    [baseCities, deleteExtra, extraIds, extraSelected, sectionKey, syncCityUrl]
  );

  return {
    extraIds,
    extraSelected,
    isMaxReached,
    handleAddExtra,
    handleChangeExtra,
    handleDeleteExtra,
  };
};
