import { HeroSection } from "@/components/sections/HeroSection/HeroSection";

export default function Home() {
  return (
    <div className="page-wrapper">
      <HeroSection
        cities={["New York", "London", "Paris", "Tokyo"]}
        bgImage="/images/hero-bg.png"
      />
    </div>
  );
}
