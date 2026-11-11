import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatRow } from "@/components/ui/StatRow";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { getVehicle, vehicles } from "@/data/vehicles";
import { formatPrice } from "@/lib/configurator";

// Render the whole route statically; unknown slugs are generated on demand and resolve to notFound().
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/models/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Model not found" };
  return {
    title: `${vehicle.name}, ${vehicle.category.toLowerCase()}`,
    description: `${vehicle.name}: ${vehicle.summary} Concept data, fictional ORVANE model.`,
  };
}

// Stub: Slice A builds the full vehicle detail template.
export default async function ModelPage({ params }: PageProps<"/models/[slug]">) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const s = vehicle.specs;
  return (
    <>
      <PageHeader eyebrow={vehicle.category} title={vehicle.name} intro={vehicle.tagline}>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href={`/configure?model=${vehicle.slug}`} size="lg">
            Configure {vehicle.name}
          </LinkButton>
          <LinkButton href="/test-drive" variant="ghost" size="lg">
            Book a test drive
          </LinkButton>
        </div>
      </PageHeader>
      <Section tone="ink" spacing="compact" aria-label={`${vehicle.name} overview`}>
        <Container className="space-y-10">
          <VehicleImage slot={vehicle.images.hero} priority />
          <StatRow
            stats={[
              { value: String(s.powerKw), unit: "kW", label: "Power" },
              { value: s.zeroToHundredS.toFixed(1), unit: "s", label: "0-100 km/h" },
              { value: String(s.rangeKm), unit: "km", label: "Range" },
              { value: String(s.topSpeedKmh), unit: "km/h", label: "Top speed" },
            ]}
          />
          <p className="text-sm text-mist">From {formatPrice(vehicle.basePrice)} concept price</p>
          <ConceptNote />
        </Container>
      </Section>
    </>
  );
}
