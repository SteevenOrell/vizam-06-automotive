import type { Metadata } from "next";
import { BrandPhilosophy } from "@/components/sections/BrandPhilosophy";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedModels } from "@/components/sections/FeaturedModels";
import { HomeHero } from "@/components/sections/HomeHero";
import { PerformanceHighlights } from "@/components/sections/PerformanceHighlights";
import { TechShowcase } from "@/components/sections/TechShowcase";

export const metadata: Metadata = {
  title: { absolute: "ORVANE | Electric performance, concept by VIZAM" },
  description:
    "ORVANE is a fictional electric performance car brand: grand touring sedan, performance SUV and coupé. A VIZAM portfolio concept.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedModels />
      <BrandPhilosophy />
      <PerformanceHighlights />
      <TechShowcase />
      <CtaBand
        eyebrow="Your turn"
        title="See how calm electric performance feels."
        text="Request a concept test drive, or build your own ORVANE and save it for later. Nothing is sent or stored in this demonstration."
      />
    </>
  );
}
