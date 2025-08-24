import { getHomePage } from "@/api/homepage";
// import { CardsSection } from "@/components/sections/CardsSection/CardsSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
// import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { CityFull } from "@/types/cities";
// import { HeroSectionBlock, HomePageAPI, MeetSectionBlock, PostsSectionBlock } from "@/types/home";
import { HeroSectionBlock, HomePageAPI } from "@/types/home";
import { fetchCitiesFull } from "@/utils/cities";

let cache: HomePageAPI | null = null;

async function fetchHomePage() {
  const { data } = await getHomePage();
  cache = data;
  return data;
}

export async function generateMetadata() {
  //  const { meta } = cache ?? (await fetchHomePage()); TODO: add when metadata from api avalible
  const homepage = cache ?? (await fetchHomePage()); // TODO: delete when metadata from api avalible
  const meta = homepage?.meta ?? {}; // TODO: delete when metadata from api avalible

  return {
    title: meta.meta_title ?? "Meta Title Fallback",
    description: meta.meta_description ?? "Meta Desctiption Fallback",
    keywords: (meta.meta_keywords ?? "").split(", "), // TODO: delete when metadata from api avalible
    // keywords: meta.meta_keywords.split(", "), TODO: add when metadata from api avalible
  };
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
          // case "meet": {
          //   const meetBlock = block as MeetSectionBlock;
          //   return (
          //     <MeetSection
          //       key={`meet-${idx}`}
          //       title={meetBlock.title ?? ""}
          //       cities={filteredCities}
          //     />
          //   );
          // }
          // case "posts": {
          //   const postsBlock = block as PostsSectionBlock;
          //   return (
          //     <CardsSection
          //       key={`posts-${idx}`}
          //       posts={postsBlock.posts}
          //     />
          //   );
          // }
        }
      })}
    </div>
  );
}
