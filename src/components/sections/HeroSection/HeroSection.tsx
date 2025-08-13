import { clsx } from "clsx";
import Image from "next/image";
import { memo } from "react";

import "./HeroSection.scss";
import { Container } from "@/common/Container";
import { Time } from "@/components/base/Time";

import { HeroCitySelect } from "./HeroCitySelect";

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
        <div className="relative z-10 py-24">
          <div className="hero-section__selector">
            <h1 className="hero-section__title">What`s the Time in</h1>
            <HeroCitySelect cities={cities} />
          </div>

          <h1>
            <Time className="min-w-24 flex gap-0.5 justify-center" />
          </h1>
        </div>
      </Container>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
