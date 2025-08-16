import { getCity, getCityTime } from "@/api/cities";
import { BASE_PROXY } from "@/consts/api";
import { CityFull, CityName } from "@/types/cities";

export const fetchCitiesFull = async (cityNames: string[]): Promise<CityFull[]> => {
  const results = await Promise.all(cityNames.map((city) => getCity({ q: city, maxRows: 1 })));
  const cities: CityName[] = results.map((r) => r.data.geonames[0]).filter(Boolean);

  const citiesFull: CityFull[] = await Promise.all(
    cities.map(async (city) => {
      const { data: timeData } = await getCityTime({
        lat: city.lat,
        lng: city.lng,
      });
      return { ...city, timeData };
    })
  );

  return citiesFull;
};

export const getCityViaProxy = (params: Record<string, any>, signal?: AbortSignal) => getCity(params, signal, BASE_PROXY);

export const getCityTimeViaProxy = (params: { lat: string; lng: string }, signal?: AbortSignal) => getCityTime(params, signal, BASE_PROXY);
