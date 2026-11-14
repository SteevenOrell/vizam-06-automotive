import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { CtaBand } from "@/components/sections/CtaBand";
import { ModelPanel } from "@/components/sections/ModelPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { vehicles } from "@/data/vehicles";

export const metadata: Metadata = pageMetadata({
  title: "Models",
  description:
    "Aren, Sola, Vire, Tarn and Vanta: five electric ORVANE concept models compared side by side.",
  path: "/models",
});

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Lineup"
        title="Five ways to go electric."
        intro="A grand touring sedan, a performance SUV, a two-door coupé, an electric pickup and a track coupé. Different bodies, one engineering idea: power that stays composed."
      />
      {vehicles.map((v, i) => (
        <ModelPanel key={v.slug} vehicle={v} flip={i % 2 === 1} tone={i % 2 === 0 ? "ink" : "carbon"} />
      ))}
      <ComparisonTable />
      <CtaBand
        title="Not sure which one is yours?"
        text="Configure each model side by side, or request a concept test drive and compare how they feel."
      />
    </>
  );
}
