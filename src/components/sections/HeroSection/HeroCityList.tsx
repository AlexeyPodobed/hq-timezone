"use client";

import { memo, useCallback } from "react";

import { Button } from "@/components/base/Button";
import { CityFull } from "@/types/cities";

interface HeroCityListProps {
  cities: CityFull[];
  onSelect?: (city: CityFull) => void;
}

export const HeroCityList = memo<HeroCityListProps>(({ cities, onSelect }) => {
  const handleClick = useCallback(
    (city: CityFull) => {
      onSelect?.(city);
    },
    [onSelect]
  );

  return (
    <div className="flex flex-wrap gap-2.5">
      {cities.map((city) => (
        <Button
          key={city.geonameId}
          onClick={() => handleClick(city)}
          className="w-[11.438rem] line-clamp-1"
        >
          {city.name}
        </Button>
      ))}
    </div>
  );
});

HeroCityList.displayName = "HeroCityList";
