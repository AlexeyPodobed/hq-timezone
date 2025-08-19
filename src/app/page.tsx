import { getHomePage } from "@/api/homepage";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
// import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { CityFull } from "@/types/cities";
import { fetchCitiesFull } from "@/utils/cities";

export default async function Home() {
  const { data: homepage } = await getHomePage();

  const heroSection = homepage.homepage_flexible_content.find((section) => section.acf_fc_layout === "hero");
  const cityNames: string[] = heroSection?.cities_list?.map((c) => c.city_name) ?? [];

  const citiesFull: CityFull[] = await fetchCitiesFull(cityNames);

  console.log(citiesFull);

  return (
    <div className="page-wrapper">
      <HeroSection
        cities={citiesFull}
        bgImage={heroSection?.background_image?.url}
      />

      {/* <MeetSection cities={citiesFull} /> */}
    </div>
  );
}
