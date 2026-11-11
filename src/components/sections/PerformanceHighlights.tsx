import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { StatRow } from "@/components/ui/StatRow";
import { Eyebrow, Heading, TwoTone } from "@/components/ui/Typography";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { getVehicle } from "@/data/vehicles";
import { headlineStats } from "@/lib/vehicle-stats";

/** Home: large concept figures beside a rear view. Figures come from the Aren Performance trim. */
export function PerformanceHighlights() {
  const aren = getVehicle("aren");
  const trim = aren?.trims.find((t) => t.id === "aren-performance");
  if (!aren || !trim) throw new Error("Aren Performance trim is missing from the vehicle data");

  return (
    <Section tone="ink" aria-labelledby="performance-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="mask" className="lg:col-span-7 lg:order-2">
            <VehicleImage
              slot={aren.images.rear}
              alt="ORVANE Aren seen from the rear three-quarter in a dark studio, with a single red light blade across the tail"
              sizes="(min-width: 1440px) 742px, (min-width: 1024px) 52vw, 100vw"
              className="aspect-[16/9] rounded-sharp"
            />
          </Reveal>
          <div className="lg:col-span-5 lg:order-1">
            <Reveal>
              <Eyebrow accent="dark" className="mb-5">
                Performance
              </Eyebrow>
              <Heading id="performance-title" level={2} size="lg">
                <TwoTone muted="Immediate, then" strong="effortless." />
              </Heading>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/80">
                Three motors, one calibration. Power arrives the instant you ask for it, and the chassis keeps it in a straight, predictable line.
              </p>
            </Reveal>
            <div className="mt-10">
              <LinkButton href="/performance" variant="ghost">
                How it performs
              </LinkButton>
            </div>
          </div>
        </div>
        <Reveal className="mt-14 border-t border-graphite pt-10 md:mt-20">
          <p className="mb-8 text-sm font-medium uppercase tracking-[0.18em] text-paper/80">{trim.name}</p>
          <StatRow size="lg" stats={headlineStats(trim.specs)} />
        </Reveal>
      </Container>
    </Section>
  );
}
