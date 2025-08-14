import { clsx } from "clsx";
import Image from "next/image";
import { memo } from "react";

import "./HeroSection.scss";
import { Container } from "@/common/Container";
import { CityFull } from "@/types/cities";

import { HeroCitySelector } from "./HeroCitySelector";

export interface HeroSectionProps {
  cities: CityFull[];
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
          <HeroCitySelector
            cities={cities}
            title="What`s the Time in"
          />
        </div>
      </Container>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
