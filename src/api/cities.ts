import { BASE_API } from "@/consts/api";
import { CitiesResponse, CityTime } from "@/types/cities";

import api from "./api";

export const getCity = async (
  params: Record<string, any>
): Promise<{
  data: CitiesResponse;
  status: number;
}> => {
  try {
    const { data, status } = await api.get(`${BASE_API}/searchJSON`, params);
    return { data, status };
  } catch (error) {
    console.log("GeoNames city fetch error:", error);
    throw error;
  }
};

export const getCityTime = async (params: {
  lat: string;
  lng: string;
}): Promise<{
  data: CityTime;
  status: number;
}> => {
  try {
    const { data, status } = await api.get(`${BASE_API}/timezoneJSON`, {
      ...params,
    });
    return { data, status };
  } catch (error) {
    console.log("GeoNames timezone fetch error:", error);
    throw error;
  }
};
