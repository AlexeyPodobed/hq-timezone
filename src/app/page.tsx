import { getHomePage } from "@/api/homepage";
import { CardsSection } from "@/components/sections/CardsSection/CardsSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { CityFull } from "@/types/cities";
import { HeroSectionBlock, MeetSectionBlock, PostsSectionBlock } from "@/types/home";
import { fetchCitiesFull } from "@/utils/cities";

export default async function Home() {
  const { data: homepage } = await getHomePage();

  const sections = homepage?.homepage_flexible_content ?? [];
  const heroSection = homepage.homepage_flexible_content.find((section): section is HeroSectionBlock => section.acf_fc_layout === "hero");
  const cityNames: string[] = heroSection?.cities_list.map((c) => c.city_name) ?? [];

  const citiesFull: CityFull[] = await fetchCitiesFull(cityNames);
  const cityNameSet = new Set(cityNames.map((name) => name.toLowerCase()));
  const filteredCities = citiesFull.filter((c) => cityNameSet.has(c.name.toLowerCase()));

  return (
    <div className="page-wrapper">
      {sections.map((block, idx) => {
        switch (block.acf_fc_layout) {
          case "hero": {
            const heroBlock = block as HeroSectionBlock;
            return (
              <HeroSection
                key={`hero-${idx}`}
                cities={filteredCities}
                bgImage={heroBlock.background_image?.url}
              />
            );
          }
          case "meet": {
            const meetBlock = block as MeetSectionBlock;
            return (
              <MeetSection
                key={`meet-${idx}`}
                title={meetBlock.title ?? ""}
                cities={filteredCities}
              />
            );
          }
          case "posts": {
            const postsBlock = block as PostsSectionBlock;
            return (
              <CardsSection
                key={`posts-${idx}`}
                posts={postsBlock.posts}
              />
            );
          }
        }
      })}
    </div>
  );
}
