import { getCityWp } from "@/api/cities";
import { CityFull } from "@/types/cities";

export const fetchCitiesFull = async (cityNames: string[]): Promise<CityFull[]> => {
  const results = await Promise.all(cityNames.map((city) => getCityWp(city)));

  const cities = results.flatMap((r) => r.data).filter(Boolean);

  const citiesFull: CityFull[] = cities;

  return citiesFull;
};
