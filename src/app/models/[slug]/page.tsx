import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container, Section } from "@/components/ui/Layout";
import { StatRow } from "@/components/ui/StatRow";
import { ExteriorSection } from "@/components/vehicle/ExteriorSection";
import { FeatureGroups } from "@/components/vehicle/FeatureGroups";
import { GallerySection } from "@/components/vehicle/GallerySection";
import { InteriorSection } from "@/components/vehicle/InteriorSection";
import { ModelPager } from "@/components/vehicle/ModelPager";
import { SpecsSection } from "@/components/vehicle/SpecsSection";
import { VehicleHero } from "@/components/vehicle/VehicleHero";
import { getVehicle, vehicles } from "@/data/vehicles";
import { formatPrice } from "@/lib/configurator";
import { pageMetadata } from "@/lib/metadata";
import { headlineStats } from "@/lib/vehicle-stats";

// Render the whole route statically; unknown slugs are generated on demand and resolve to notFound().
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/models/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Model not found" };
  return pageMetadata({
    title: `${vehicle.name}, ${vehicle.category.toLowerCase()}`,
    description: `${vehicle.name}, ${vehicle.category.toLowerCase()}. ${vehicle.tagline} Concept data for a fictional ORVANE model.`,
    path: `/models/${vehicle.slug}`,
  });
}

export default async function ModelPage({ params }: PageProps<"/models/[slug]">) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  return (
    <>
      <VehicleHero vehicle={vehicle} />
      <Section tone="ink" spacing="compact" aria-label={`${vehicle.name} at a glance`}>
        <Container>
          <Reveal>
            <StatRow size="lg" stats={headlineStats(vehicle.specs)} />
            <p className="mt-6 text-sm text-mist">Entry trim, from {formatPrice(vehicle.basePrice)} concept price.</p>
          </Reveal>
        </Container>
      </Section>
      <ExteriorSection vehicle={vehicle} />
      <InteriorSection vehicle={vehicle} />
      <SpecsSection vehicle={vehicle} />
      <FeatureGroups vehicle={vehicle} />
      <GallerySection vehicle={vehicle} />
      <CtaBand
        eyebrow={vehicle.name}
        title={`Make the ${vehicle.name} yours.`}
        text={`Configure paint, wheels and interior, or book a concept test drive of the ${vehicle.name}. Nothing is sent or stored in this demonstration.`}
        model={vehicle.slug}
      />
      <ModelPager slug={vehicle.slug} />
    </>
  );
}
