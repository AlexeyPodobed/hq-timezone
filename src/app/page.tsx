import { getHomePage } from "@/api/homepage";
import { CardsSection } from "@/components/sections/CardsSection/CardsSection";
import { DiffrenceSection } from "@/components/sections/DiffrenceSection/DiffrenceSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { HeroSectionBlock, MeetSectionBlock, PostsSectionBlock } from "@/types/home";
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

export default async function Home() {
  const { data: homepage } = await getHomePage();
  const sections = getHomeSections(homepage);
  const filteredCities = await fetchHomepageCities(sections);

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
