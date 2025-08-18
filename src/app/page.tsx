import { getHomePage } from "@/api/homepage";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { CardsSection } from "@/components/sections/CardsSection/CardsSection";
import { CityFull } from "@/types/cities";
import { fetchCitiesFullInfo } from "@/utils/cities";

export default async function Home() {
  const { data: homepage } = await getHomePage();

  const sections = homepage?.homepage_flexible_content ?? [];

  const heroSection = homepage.homepage_flexible_content.find((section) => section.acf_fc_layout === "hero");
	const cardsSectionData = homepage.homepage_flexible_content.find((section) => section.acf_fc_layout === "posts");

  const cityNames: string[] = heroSection?.cities_list?.map((c) => c.city_name) ?? [];

  const citiesFull: CityFull[] = await fetchCitiesFullInfo(cityNames);

  const filteredCities = citiesFull.filter((city) => cityNames.some((name) => city.name.toLowerCase() === name.toLowerCase()));

  return (
    <div className="page-wrapper">
      {sections.map((block: any, idx: number) => {
        switch (block?.acf_fc_layout) {
          case "hero":
            return (
              <HeroSection
                key={`hero-${idx}`}
                cities={filteredCities}
                bgImage={block?.background_image?.url}
              />
            );
          case "meet":
            return (
              <MeetSection
                key={`meet-${idx}`}
                title={block?.title ?? ""}
                cities={citiesFull}
              />
            );
          case "posts":
            return (
             	<CardsSection posts={cardsSectionData?.posts} key={`posts-${idx}`} />
            );
        }
      })}
    </div>
  );
}
