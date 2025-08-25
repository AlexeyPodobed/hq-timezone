import { getHomePage } from "@/api/homepage";
import { CardsSection } from "@/components/sections/CardsSection/CardsSection";
import { DiffrenceSection } from "@/components/sections/DiffrenceSection/DiffrenceSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { CityFull } from "@/types/cities";
import { HeroSectionBlock, MeetSectionBlock, PostsSectionBlock } from "@/types/home";
import { fetchCitiesFull } from "@/utils/cities";
import { fetchFrontPageMeta } from "@/utils/homepage";

export async function generateMetadata() {
  try {
    const { title, description, keywords } = await fetchFrontPageMeta();

    return {
      title,
      description,
      keywords,
    };
  } catch (e) {
    console.error("Generate Homepage Metadata fallback:", e);
    return {
      title: "HQ TIMEZONE",
      description: "HQ TIMEZONE",
      keywords: [],
    };
  }
}

export default async function Home() {
  const { data: homepage } = await getHomePage();

  const sections = homepage?.homepage_flexible_content ?? [];
  const heroSection = homepage.homepage_flexible_content.find((section): section is HeroSectionBlock => section.acf_fc_layout === "hero");
  const cityList = heroSection?.cities_list ?? [];

  const citySet = new Set(
    cityList.map(({ city_name, city_timezone }) => `${city_name.toLowerCase()}|${city_timezone.replace(/['"]/g, "").toLowerCase()}`)
  );

  const citiesFull: CityFull[] = await fetchCitiesFull(cityList.map((c) => c.city_name));
  const filteredCities = citiesFull.filter((c) => {
    const key = `${c.name.toLowerCase()}|${c.timeData?.timezoneId.toLowerCase()}`;
    return citySet.has(key);
  });

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
          case "difference": {
            return (
              <DiffrenceSection
                key={`difference-${idx}`}
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
