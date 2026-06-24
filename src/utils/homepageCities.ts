import type { CityFull } from "@/types/cities";
import type { HeroSectionBlock, HomePageAPI, HomePageFlexibleContent } from "@/types/home";

import { fetchCitiesFull } from "./cities";

const isHeroCityItem = (city: unknown): city is { city_name: string; city_timezone: string } => {
  if (!city || typeof city !== "object") return false;

  const value = city as Partial<{ city_name: unknown; city_timezone: unknown }>;
  return typeof value.city_name === "string" && typeof value.city_timezone === "string";
};

const normalizeCityPart = (value: string) => value.trim().replace(/['"]/g, "").toLowerCase();

const buildCityMatchKey = (name: string, timezone: string) => `${normalizeCityPart(name)}|${normalizeCityPart(timezone)}`;

export const getHomeSections = (homepage?: HomePageAPI | null): HomePageFlexibleContent[] => {
  return Array.isArray(homepage?.homepage_flexible_content) ? homepage.homepage_flexible_content : [];
};

export const findHeroSection = (sections: HomePageFlexibleContent[]) => {
  return sections.find((section): section is HeroSectionBlock => section?.acf_fc_layout === "hero");
};

export const fetchHomepageCities = async (sections: HomePageFlexibleContent[]): Promise<CityFull[]> => {
  const heroSection = findHeroSection(sections);
  const cityList = Array.isArray(heroSection?.cities_list) ? heroSection.cities_list : [];
  const validCityList = cityList.filter(isHeroCityItem);
  const citySet = new Set(validCityList.map(({ city_name, city_timezone }) => buildCityMatchKey(city_name, city_timezone)));

  const citiesFull = await fetchCitiesFull(validCityList.map((city) => city.city_name));

  return citiesFull.filter((city) => citySet.has(buildCityMatchKey(city.name, city.timezone)));
};
