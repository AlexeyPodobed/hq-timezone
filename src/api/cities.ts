import { BASE_API } from "@/consts/api";
import { CitiesResponse, CityTime } from "@/types/cities";

import api from "./api";

type BaseUrl = string;

export const getCity = async (
  params: Record<string, any>,
  signal?: AbortSignal,
  baseUrl: BaseUrl = BASE_API
): Promise<{ data: CitiesResponse; status: number }> => {
  try {
    const { data, status } = await api.get(`${baseUrl}/searchJSON`, params, { signal });
    return { data, status };
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.log("GeoNames city fetch error:", error);
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
    const { data, status } = await api.get(`${baseUrl}/timezoneJSON`, params, { signal });
    return { data, status };
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.log("GeoNames timezone fetch error:", error);
    }
    throw error;
  }
};
