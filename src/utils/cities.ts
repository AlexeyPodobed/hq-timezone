import { getCityWp } from "@/api/cities";
import { CityFull } from "@/types/cities";

const isValidCity = (value: unknown): value is CityFull => {
  if (!value || typeof value !== "object") return false;

  const city = value as Partial<CityFull>;
  return typeof city.name === "string" && typeof city.timezone === "string";
};

export const fetchCitiesFull = async (cityNames: string[]): Promise<CityFull[]> => {
  const uniqueCityNames = Array.from(
    new Map(
      cityNames
        .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
        .map((name) => {
          const trimmedName = name.trim();

          return [trimmedName.toLowerCase(), trimmedName] as const;
        })
    ).values()
  );
  if (!uniqueCityNames.length) return [];

  const results = await Promise.all(uniqueCityNames.map((city) => getCityWp(city)));

  const cities = results.flatMap((r) => (Array.isArray(r?.data) ? r.data : [])).filter(isValidCity);

  const citiesFull: CityFull[] = cities;

  return citiesFull;
};
