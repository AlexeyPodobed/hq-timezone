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
    <div className="hidden md:flex md:flex-wrap md:gap-2.5">
      {cities.map((city) => (
        <Button
          key={city.geonameId}
          onClick={() => handleClick(city)}
          className="lg:min-w-[11.4375rem] line-clamp-1 lg:px-3"
        >
          {city.name}
        </Button>
      ))}
    </div>
  );
});

HeroCityList.displayName = "HeroCityList";
