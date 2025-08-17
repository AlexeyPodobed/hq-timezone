import { clsx } from "clsx";
import { memo } from "react";

import "./MeetSection.scss";
import { Container } from "@/common/Container";
import { ImageWrapper } from "@/common/ImageWrapper";
import { CityFull } from "@/types/cities";

export interface MeetSectionProps {
  cities: CityFull[];
  bgImage?: string;
  className?: string;
}

export const MeetSection = memo<MeetSectionProps>(({ cities, className }) => {
  return (
    <section className={clsx("meet-section", className)}>
      <ImageWrapper
        src=""
        alt=""
        className=""
      />
      <Container>
        <div className="meet-section__inner">
          <h2 className="meet-section__title">When's the Best Time to Meet?</h2>
        </div>
      </Container>
    </section>
  );
});

MeetSection.displayName = "MeetSection";

export default MeetSection;
