import { getCitySunInfo, getCityWp } from "@/api/cities";
import { CityFull } from "@/types/cities";

export const fetchCitiesFullInfo = async (cityNames: string[]): Promise<CityFull[]> => {
  const notFoundCities: string[] = [];

  const cityResults = await Promise.all(cityNames.map((city) => getCityWp(city).catch(() => ({ data: [], status: 500 }))));

  const flatCities = cityResults.flatMap((res, i) => {
    const cityKey = cityNames[i].toLowerCase();

    if (!Array.isArray(res.data)) {
      notFoundCities.push(cityNames[i]);
      return [];
    }

    const matched = res.data.filter((city) => typeof city.name === "string" && city.name.toLowerCase().includes(cityKey));

    if (matched.length === 0) {
      notFoundCities.push(cityNames[i]);
    }

    return matched;
  });

  console.log(`Not found (${notFoundCities.length}):`, notFoundCities);

  const fullResults = await Promise.all(
    flatCities.map(async (city) => {
      try {
        const { data: sunData } = await getCitySunInfo({
          lat: Number(city.latitude),
          lng: Number(city.longitude),
        });
        return { ...city, sunData };
      } catch {
        return null;
      }
    })
  );

  return fullResults.filter(Boolean) as CityFull[];
};
