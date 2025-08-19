import { getHomePage } from "@/api/homepage";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { MeetSection } from "@/components/sections/MeetSection/MeetSection";
import { CityFull } from "@/types/cities";
import { fetchCitiesFull } from "@/utils/cities";

export default async function Home() {
  const { data: homepage } = await getHomePage();

  const sections = homepage?.homepage_flexible_content ?? [];

  const heroSection = homepage.homepage_flexible_content.find((section) => section.acf_fc_layout === "hero");
  const cityNames: string[] = heroSection?.cities_list?.map((c) => c.city_name) ?? [];

  const citiesFull: CityFull[] = await fetchCitiesFull(cityNames);

  return (
    <div className="page-wrapper">
      {sections.map((block: any, idx: number) => {
        switch (block?.acf_fc_layout) {
          case "hero":
            return (
              <HeroSection
                key={`hero-${idx}`}
                cities={citiesFull}
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
        }
      })}
    </div>
  );
}
