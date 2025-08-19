import { BASE_API, WP_API } from "@/consts/api";
import { EXPIRE_1_DAY } from "@/consts/time";
import { CityNameWP, SunInfoResult } from "@/types/cities";

import api from "./api";

export const getCityWp = async (city: string, signal?: AbortSignal): Promise<{ data: CityNameWP[]; status: number }> => {
  try {
    const { data, status } = await api.get(`${WP_API}/cities/${encodeURIComponent(city)}`, {
      signal,
      next: { revalidate: EXPIRE_1_DAY },
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
  params: Record<string, string | number>,
  signal?: AbortSignal
): Promise<{ data: SunInfoResult; status: number }> => {
  try {
    const { data, status } = await api.get(`${BASE_API}/forecast`, params, {
      signal,
      next: { revalidate: EXPIRE_1_DAY },
    });

    return { data, status };
  } catch (error) {
    console.log("Sun API error:", error);
    throw error;
  }
};
