import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { CityFull } from "@/types/cities";
import { fetchCitiesFull } from "@/utils/cities";

export default async function Home() {
  const cityNames = ["New York", "London", "Paris", "Tokyo"];

  const citiesFull: CityFull[] = await fetchCitiesFull(cityNames);

  return (
    <div className="page-wrapper">
      <HeroSection
        cities={citiesFull}
        bgImage="/images/hero-bg.png"
      />
    </div>
  );
}
