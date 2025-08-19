import { getCityTime, getCityWp } from "@/api/cities";
import { BASE_PROXY } from "@/consts/api";
import { CityFull } from "@/types/cities";

export const fetchCitiesFull = async (cityNames: string[]): Promise<CityFull[]> => {
  const results = await Promise.all(cityNames.map((city) => getCityWp(city)));

  const cities = results.flatMap((r) => r.data).filter(Boolean);

  const citiesFull: CityFull[] = await Promise.all(
    cities.map(async (city) => {
      const { data: timeData } = await getCityTime({ lat: city.latitude, lng: city.longitude });
      return { ...city, timeData };
    })
  );

  return citiesFull;
};

export const getCityTimeViaProxy = (params: { lat: string; lng: string }, signal?: AbortSignal) => getCityTime(params, signal, BASE_PROXY);
