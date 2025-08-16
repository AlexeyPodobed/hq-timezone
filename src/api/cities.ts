import { BASE_API } from "@/consts/api";
import { CitiesResponse, CityTime } from "@/types/cities";

import api from "./api";

let cityAC: AbortController | null = null;

export const getCity = async (params: Record<string, any>, signal?: AbortSignal): Promise<{ data: CitiesResponse; status: number }> => {
  cityAC?.abort();
  cityAC = new AbortController();

  try {
    const { data, status } = await api.get(`${BASE_API}/searchJSON`, params, { signal });
    return { data, status };
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.log("GeoNames city fetch error:", error);
    }
    throw error;
  } finally {
    cityAC = null;
  }
};

export const getCityTime = async (params: { lat: string; lng: string }, signal?: AbortSignal): Promise<{ data: CityTime; status: number }> => {
  try {
    const { data, status } = await api.get(`${BASE_API}/timezoneJSON`, { ...params }, { signal });
    return { data, status };
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.log("GeoNames timezone fetch error:", error);
    }
    throw error;
  }
};
