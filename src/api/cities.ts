import { BASE_API, WP_API } from "@/consts/api";
import { EXPIRE_1_DAY } from "@/consts/time";
import { CityNameWP, SunInfoResult } from "@/types/cities";

import api from "./api";

export const getCityWp = async (city: string, signal?: AbortSignal): Promise<{ data: CityNameWP[]; status: number }> => {
  try {
    const { data, status } = await api.get(`${WP_API}/cities/${encodeURIComponent(city)}`, {
      signal,
    });

    return { data, status };
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.log("City fetch error:", error);
    }
    throw error;
  }
};

export const getCitySunInfo = async (
  { lat, lng }: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<{ data: SunInfoResult; status: number }> => {
  try {
    const { data, status } = await api.get(`${BASE_API}/json`, { lat, lng }, { signal, next: { revalidate: EXPIRE_1_DAY } });

    return { data: data.results, status };
  } catch (error) {
    console.log("Sun API error:", error);
    throw error;
  }
};
