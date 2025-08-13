"use client";

import { memo, useCallback } from "react";

import { Button } from "@/components/base/Button";

interface HeroCityListProps {
  cities: string[];
  onSelect?: (city: string) => void;
}

export const HeroCityList = memo<HeroCityListProps>(({ cities, onSelect }) => {
  const handleClick = useCallback(
    (city: string) => {
      onSelect?.(city);
    },
    [onSelect]
  );

  return (
    <div className="flex flex-wrap gap-2.5">
      {cities.map((city) => (
        <Button
          key={city}
          onClick={() => handleClick(city)}
          className="w-[11.438rem] line-clamp-1"
        >
          {city}
        </Button>
      ))}
    </div>
  );
});

HeroCityList.displayName = "HeroCityList";
