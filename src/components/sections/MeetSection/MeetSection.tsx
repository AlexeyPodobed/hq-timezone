import { clsx } from "clsx";
import { memo } from "react";

import "./MeetSection.scss";
import { Container } from "@/common/Container";
import { ImageWrapper } from "@/common/ImageWrapper";
import { CityFull } from "@/types/cities";

import { MeetSectionSelector } from "./MeetSectionSelector";

export interface MeetSectionProps {
  title: string;
  cities: CityFull[];
  bgImage?: string;
  className?: string;
}

export const MeetSection = memo<MeetSectionProps>(({ title, cities, className }) => {
  return (
    <section className={clsx("meet-section", className)}>
      <ImageWrapper
        src="/images/match-bg.svg"
        alt="section-decor"
        className="meet-section__decor"
      />
      <Container>
        <div className="meet-section__inner">
          <h2 className="meet-section__title">{title}</h2>
          <div className="meet-section__title"></div>

          {cities?.length > 0 && <MeetSectionSelector cities={cities} />}
        </div>
      </Container>
    </section>
  );
});

MeetSection.displayName = "MeetSection";

export default MeetSection;
