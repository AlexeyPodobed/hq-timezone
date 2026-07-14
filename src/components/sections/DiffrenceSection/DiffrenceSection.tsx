import { clsx } from "clsx";
import { memo } from "react";

import "./DiffrenceSection.scss";
import "@/animations/float-rotate.scss";

import { Container } from "@/common/Container";
import { ImageWrapper } from "@/common/ImageWrapper";
import { CityFull } from "@/types/cities";

import { DiffrenceSectionSelector } from "./DiffrenceSectionSelector";

export interface DiffrenceSectionProps {
  cities: CityFull[];
  initialSelectedCities?: CityFull[];
  className?: string;
}

export const DiffrenceSection = memo<DiffrenceSectionProps>(({ cities, initialSelectedCities, className }) => {
  return (
    <section className={clsx("diffrence-section", className)}>
      <Container>
        <div className="diffrence-section__inner">
          {cities?.length > 0 && (
            <DiffrenceSectionSelector
              cities={cities}
              initialSelectedCities={initialSelectedCities}
            />
          )}
        </div>
      </Container>

      <ImageWrapper
        src="/images/difference-bg.webp"
        alt="section-decor"
        className="diffrence-section__decor"
      />
    </section>
  );
});

DiffrenceSection.displayName = "DiffrenceSection";
