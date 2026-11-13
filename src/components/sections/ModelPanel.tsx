import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section, type SurfaceTone } from "@/components/ui/Layout";
import { Eyebrow } from "@/components/ui/Typography";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { formatPrice } from "@/lib/configurator";
import type { Vehicle } from "@/types";

interface ModelPanelProps {
  vehicle: Vehicle;
  /** Image on the right when true; alternates down the page. */
  flip?: boolean;
  tone?: SurfaceTone;
}

/** /models: one full-width editorial panel per model with image, concept specs, paint dots and both actions. */
export function ModelPanel({ vehicle: v, flip = false, tone = "ink" }: ModelPanelProps) {
  const titleId = `panel-${v.slug}`;
  return (
    <Section tone={tone} spacing="compact" aria-labelledby={titleId} className="md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal variant="mask" className={flip ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
            <VehicleImage slot={v.images.profile} sizes="(min-width: 1440px) 742px, (min-width: 1024px) 52vw, 100vw" className="aspect-[16/9] rounded-sharp" />
          </Reveal>
          <Reveal className={flip ? "lg:order-1 lg:col-span-5" : "lg:col-span-5"}>
            <Eyebrow accent="dark">{v.category}</Eyebrow>
            <h2 id={titleId} className="mt-3 font-display text-[clamp(2.75rem,6vw,5.5rem)] font-semibold uppercase leading-none tracking-[0.03em] [font-stretch:125%]">
              {v.name}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/80">{v.summary}</p>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-graphite pt-6">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">Power</dt>
                <dd className="mt-1 font-display text-2xl font-semibold [font-stretch:112%]">
                  {v.specs.powerKw}
                  <span className="ml-1 text-sm font-normal text-mist">kW</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">Range</dt>
                <dd className="mt-1 font-display text-2xl font-semibold [font-stretch:112%]">
                  {v.specs.rangeKm}
                  <span className="ml-1 text-sm font-normal text-mist">km</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">0-100</dt>
                <dd className="mt-1 font-display text-2xl font-semibold [font-stretch:112%]">
                  {v.specs.zeroToHundredS.toFixed(1)}
                  <span className="ml-1 text-sm font-normal text-mist">s</span>
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-mist">Concept data · from {formatPrice(v.basePrice)}</p>

            <div className="mt-6 flex items-center gap-3">
              <ul aria-label={`${v.name} paint colours`} className="flex items-center gap-2">
                {v.colours.map((c) => (
                  <li key={c.id}>
                    <span title={c.name} className="block size-5 rounded-full ring-1 ring-paper/30 ring-offset-2 ring-offset-transparent" style={{ backgroundColor: c.hex }}>
                      <span className="sr-only">{c.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <span className="text-sm text-mist">{v.colours.length} paints</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={`/models/${v.slug}`} size="lg">
                Explore {v.name}
              </LinkButton>
              <LinkButton href={`/configure?model=${v.slug}`} size="lg" variant="ghost">
                Configure
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
