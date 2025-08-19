import { BASE_API, WP_API } from "@/consts/api";
import { EXPIRE_1_DAY } from "@/consts/time";
import { CityNameWP, CityTime } from "@/types/cities";

import api from "./api";

type BaseUrl = string;

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

export const getCityTime = async (
  params: { lat: string; lng: string },
  signal?: AbortSignal,
  baseUrl: BaseUrl = BASE_API
): Promise<{ data: CityTime; status: number }> => {
  try {
    const { data, status } = await api.get(`${baseUrl}/timezoneJSON`, params, { signal, next: { revalidate: EXPIRE_1_DAY } });
    // console.log("getCityTime:", data);
    return { data, status };
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.log("GeoNames timezone fetch error:", error);
    }
    throw error;
  }
};
