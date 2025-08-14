import { getCity, getCityTime } from "@/api/cities";
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
