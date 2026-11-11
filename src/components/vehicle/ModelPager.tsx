import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Layout";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { getAdjacentVehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types";

function PagerLink({ vehicle, direction }: { vehicle: Vehicle; direction: "prev" | "next" }) {
  const Arrow = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={`/models/${vehicle.slug}`}
      rel={direction}
      className={`group flex min-h-11 items-center gap-5 rounded-sharp border border-graphite p-4 transition-colors duration-300 hover:border-paper md:p-5 ${direction === "next" ? "flex-row-reverse text-right" : ""}`}
    >
      <span className="block w-28 shrink-0 overflow-hidden rounded-sharp md:w-40">
        <VehicleImage slot={vehicle.images.profile} alt="" sizes="160px" className="aspect-[16/9]" />
      </span>
      <span className="flex-1">
        <span className={`flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mist ${direction === "next" ? "justify-end" : ""}`}>
          {direction === "prev" ? <Arrow aria-hidden="true" className="size-4" /> : null}
          {direction === "prev" ? "Previous model" : "Next model"}
          {direction === "next" ? <Arrow aria-hidden="true" className="size-4" /> : null}
        </span>
        <span className={`mt-2 flex flex-col ${direction === "next" ? "items-end" : "items-start"}`}>
          <span className="font-display text-2xl font-semibold uppercase tracking-[0.04em] [font-stretch:125%]">{vehicle.name}</span>
          <span className="mt-1 text-sm text-paper/80">{vehicle.category}</span>
        </span>
      </span>
    </Link>
  );
}

/** Model page: previous and next model, wrapping around the lineup. */
export function ModelPager({ slug }: { slug: string }) {
  const adjacent = getAdjacentVehicles(slug);
  if (!adjacent) return null;
  return (
    <Section tone="ink" spacing="compact">
      <Container>
        <nav aria-label="More models" className="grid gap-4 md:grid-cols-2">
          <PagerLink vehicle={adjacent.prev} direction="prev" />
          <PagerLink vehicle={adjacent.next} direction="next" />
        </nav>
      </Container>
    </Section>
  );
}
