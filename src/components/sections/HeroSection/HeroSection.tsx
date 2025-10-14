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
          className="hero-section__bg"
          alt="hero-bg"
          sizes="100%"
          fill
          priority
          blurDataURL="/images/hero-bg-mob.webp"
        />
      )}
      <Container>
        <div className="hero-section__inner">
          {cities?.length > 0 && (
            <HeroCitySelector
              cities={cities}
              title="What's the Time in"
            />
          )}
        </div>
      </Container>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
