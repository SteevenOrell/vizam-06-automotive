import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, TwoTone } from "@/components/ui/Typography";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { vehicles } from "@/data/vehicles";

/** Home: the three models as equal-height cards. The whole card links to the detail page; Configure sits above it. */
export function FeaturedModels() {
  return (
    <Section tone="carbon" aria-labelledby="lineup-title">
      <Container>
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          <Eyebrow accent="dark" className="mb-5">
            The lineup
          </Eyebrow>
          <Heading id="lineup-title" level={2} size="xl">
            <TwoTone muted="Three models." strong="One engineering idea." />
          </Heading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
            A sedan, an SUV and a coupé share one platform, one battery philosophy and one rule: power stays composed.
          </p>
        </Reveal>

        <ul className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {vehicles.map((v) => (
            <li key={v.slug} className="flex">
              <article className="group relative flex w-full flex-col overflow-hidden rounded-sharp border border-graphite bg-ink">
                <div className="overflow-hidden">
                  <VehicleImage
                    slot={v.images.profile}
                    sizes="(min-width: 1440px) 416px, (min-width: 1024px) 29vw, (min-width: 768px) 90vw, 100vw"
                    className="aspect-[16/9] transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <Eyebrow accent="dark">{v.category}</Eyebrow>
                  <h3 className="mt-3 font-display text-4xl font-semibold uppercase tracking-[0.04em] [font-stretch:125%]">
                    <Link href={`/models/${v.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {v.name}
                      <span className="sr-only">, {v.category}</span>
                    </Link>
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-paper/80">{v.content.character}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-graphite pt-6">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-mist">Range</dt>
                      <dd className="mt-1 font-display text-2xl font-semibold [font-stretch:112%]">
                        {v.specs.rangeKm}
                        <span className="ml-1 text-sm font-normal text-mist">km</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-mist">0-100 km/h</dt>
                      <dd className="mt-1 font-display text-2xl font-semibold [font-stretch:112%]">
                        {v.specs.zeroToHundredS.toFixed(1)}
                        <span className="ml-1 text-sm font-normal text-mist">s</span>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-mist">Concept data</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
                    <span aria-hidden="true" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-amber">
                      Explore {v.name}
                      <ArrowUpRight className="size-4" />
                    </span>
                    <LinkButton href={`/configure?model=${v.slug}`} variant="ghost" className="relative z-10">
                      Configure<span className="sr-only"> {v.name}</span>
                    </LinkButton>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <ConceptNote className="mt-8 max-w-3xl" />
      </Container>
    </Section>
  );
}
