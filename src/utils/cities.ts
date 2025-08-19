import { getCitySunInfo, getCityWp } from "@/api/cities";
import { CityFull } from "@/types/cities";

import { isoToHM, secsToHumanHM } from "./global";

export const fetchCitiesFullInfo = async (cityNames: string[]): Promise<CityFull[]> => {
  const cityResults = await Promise.all(cityNames.map((city) => getCityWp(city).catch(() => ({ data: [], status: 500 }))));

  const flatCities = cityResults.flatMap((res, i) => {
    const cityKey = cityNames[i].toLowerCase();
    return res.data.filter((city) => typeof city.name === "string" && city.name.toLowerCase().includes(cityKey));
  });

  const fullResults = await Promise.all(
    flatCities.map(async (city) => {
      try {
        const { data } = await getCitySunInfo({
          latitude: Number(city.latitude),
          longitude: Number(city.longitude),
          daily: "sunrise,sunset,daylight_duration",
          timezone: city.timezone || "auto",
        });

        const sunData = {
          sunrise: isoToHM(data.daily.sunrise?.[0]),
          sunset: isoToHM(data.daily.sunset?.[0]),
          daylight_duration: secsToHumanHM(data.daily.daylight_duration?.[0]),
        };

        return { ...city, sunData };
      } catch {
        return null;
      }
    })
  );

  return fullResults.filter(Boolean) as CityFull[];
};
