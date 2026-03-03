"use client";

import { useEffect, useRef, useState } from "react";

import { getCityWp } from "@/api/cities";
import { CityFull } from "@/types/cities";

interface UseCitySearchParams {
  term: string;
  minSearchLength: number;
  onResults: (cities: CityFull[]) => void;
}

export function useCitySearch({ term, minSearchLength, onResults }: UseCitySearchParams) {
  const [isFetching, setIsFetching] = useState(false);
  const prevTermRef = useRef("");

  useEffect(() => {
    const normalizedTerm = term.trim();

    if (normalizedTerm.length < minSearchLength || normalizedTerm === prevTermRef.current) {
      setIsFetching(false);
      return;
    }

    prevTermRef.current = normalizedTerm;

    const abortController = new AbortController();
    setIsFetching(true);

    (async () => {
      try {
        if (abortController.signal.aborted) return;

        const { data } = await getCityWp(normalizedTerm, abortController.signal);
        onResults(data as CityFull[]);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.log("City search failed:", error);
        }
      } finally {
        setIsFetching(false);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [minSearchLength, onResults, term]);

  return { isFetching };
}
