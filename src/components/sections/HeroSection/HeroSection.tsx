import { clsx } from "clsx";
import Image from "next/image";
import { memo } from "react";

import "./HeroSection.scss";
import { Container } from "@/common/Container";

import { HeroCityList } from "./HeroCityList";
import { HeroCitySelect } from "./HeroCitySelect";
import { HeroMainTime } from "./HeroMainTime";

export interface HeroSectionProps {
  cities: string[];
  bgImage?: string;
  className?: string;
}

export const HeroSection = memo<HeroSectionProps>(({ cities, bgImage, className }) => {
  return (
    <section className={clsx("hero-section", className)}>
      {bgImage && (
        <Image
          src={bgImage}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          alt="hero-bg"
          sizes="100%"
          width={0}
          height={0}
          priority
          loading="eager"
        />
      )}
      <Container>
        <div className="hero-section__inner">
          <div className="hero-section__selector">
            <h1 className="hero-section__title">What`s the Time in</h1>
            <HeroCitySelect cities={cities} />
          </div>

          <div className="hero-section__main-content">
            <HeroMainTime
              city="New York, USA"
              time="16:07:45"
              date="Thursday, June 5, 2025"
              sunRise="05:24"
              sunSet="20:25"
            />
          </div>

          <HeroCityList cities={cities} />
        </div>
      </Container>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
