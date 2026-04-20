import { getCityWp } from "@/api/cities";
import { CityFull } from "@/types/cities";

const isValidCity = (value: unknown): value is CityFull => {
  if (!value || typeof value !== "object") return false;

  const city = value as Partial<CityFull>;
  return typeof city.name === "string" && typeof city.timezone === "string";
};

export const fetchCitiesFull = async (cityNames: string[]): Promise<CityFull[]> => {
  const safeCityNames = Array.isArray(cityNames) ? cityNames.filter((name) => typeof name === "string" && name.trim().length > 0) : [];
  if (!safeCityNames.length) return [];

  const results = await Promise.all(safeCityNames.map((city) => getCityWp(city)));

  const cities = results.flatMap((r) => (Array.isArray(r?.data) ? r.data : [])).filter(isValidCity);

  const citiesFull: CityFull[] = cities;

  return citiesFull;
};
