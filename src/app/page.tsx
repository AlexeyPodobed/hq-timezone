import { getHomePage } from "@/api/homepage";
import { CardsSection } from "@/components/sections/CardsSection/CardsSection";
import { DiffrenceSection } from "@/components/sections/DiffrenceSection/DiffrenceSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { HeroSectionBlock, MeetSectionBlock, PostsSectionBlock } from "@/types/home";
import type { PageSearchParams } from "@/utils/cityUrlParams";
import { resolveInitialCitySelections } from "@/utils/cityUrlParams";
import { fetchFrontPageMeta } from "@/utils/homepage";
import { fetchHomepageCities, getHomeSections } from "@/utils/homepageCities";

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

interface HomeProps {
  searchParams?: Promise<PageSearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { data: homepage } = await getHomePage();
  const sections = getHomeSections(homepage);
  const filteredCities = await fetchHomepageCities(sections);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialCitySelections = await resolveInitialCitySelections(resolvedSearchParams, filteredCities);

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
                initialSelectedCity={initialCitySelections.hero}
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
                initialSelectedCities={initialCitySelections.meet}
              />
            );
          }
          case "difference": {
            return (
              <DiffrenceSection
                key={`difference-${idx}`}
                cities={filteredCities}
                initialSelectedCities={initialCitySelections.difference}
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
