import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CompareChart } from "@/components/editorial/CompareChart";
import { EdImage } from "@/components/editorial/EdImage";
import { ModelSwitcher, type SwitcherModel } from "@/components/editorial/ModelSwitcher";
import { SectionIntro } from "@/components/editorial/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollMedia } from "@/components/motion/ScrollMedia";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { chassisItems, driveModes } from "@/data/editorial";
import { imageProps } from "@/data/editorial-images";
import { vehicles } from "@/data/vehicles";
import { compareBars } from "@/lib/editorial";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Performance",
  description:
    "Concept figures for Aren, Sola and Vire: power, acceleration and range compared, plus chassis, braking and the four drive modes.",
  path: "/performance",
});

const meterLabels = { throttle: "Throttle", damping: "Damping", steering: "Steering" } as const;

function Meter({ label, level }: { label: string; level: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-slate">{label}</span>
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={cn("block h-2 w-6", n <= level ? "bg-amber-ink" : "bg-ink/15")} />
        ))}
      </span>
      <span className="sr-only">{`${level} of 4`}</span>
    </div>
  );
}

export default function Page() {
  const models: SwitcherModel[] = vehicles.map((v) => ({
    slug: v.slug,
    name: v.name,
    category: v.category,
    image: imageProps(v.images.profile),
    trims: v.trims.map((t) => ({ id: t.id, name: t.name, description: t.description, specs: t.specs })),
  }));
  const bars = compareBars(vehicles.map((v) => ({ slug: v.slug, name: v.name, specs: v.specs })));

  return (
    <>
      <section data-tone="ink" aria-labelledby="performance-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-paper">
        <ScrollMedia className="absolute inset-0 -z-10" scaleTo={1.12}>
          <EdImage name="ed-track-vire" priority sizes="100vw" className="h-full! object-[50%_20%]" />
        </ScrollMedia>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
        <Container className="pb-14 pt-32 md:pb-24 md:pt-44">
          <Eyebrow accent="dark" className="mb-5">
            Performance
          </Eyebrow>
          <Heading level={1} size="xl" id="performance-title" className="max-w-4xl">
            Quick, and never in a hurry.
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/90 md:text-xl">
            Every ORVANE concept is tuned for the second after the first push: power that arrives in a straight line, a chassis that keeps it there, brakes you stop noticing.
          </p>
        </Container>
      </section>

      <Section tone="carbon" aria-labelledby="figures-title">
        <Container>
          <Reveal>
            <SectionIntro id="figures-title" eyebrow="Concept figures" title="Pick a model. Pick a trim." text="The figures below update with your choice and come straight from the concept data." className="mb-12 md:mb-16" />
          </Reveal>
          <ModelSwitcher models={models} />
          <ConceptNote className="mt-8" />
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="chassis-title">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variant="mask" className="lg:col-span-7">
              <EdImage name="ed-brake-detail" sizes="(min-width: 1440px) 742px, (min-width: 1024px) 52vw, 100vw" className="aspect-[4/3] rounded-sharp" />
            </Reveal>
            <Reveal className="lg:col-span-5">
              <SectionIntro
                light
                id="chassis-title"
                eyebrow="Chassis and braking"
                title="Control is what makes speed usable."
                text="Power is only half of performance. The rest is how the car breathes through a corner and how calmly it stops."
              />
            </Reveal>
          </div>
          <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-px overflow-hidden rounded-sharp border border-ink/15 bg-ink/15 md:mt-20 md:grid-cols-3">
            {chassisItems.map((c, i) => (
              <li key={c.title} className="bg-paper p-6 md:p-8">
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-amber-ink">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 font-display text-2xl font-semibold [font-stretch:112%]">{c.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate">{c.text}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="compare-title">
        <Container>
          <Reveal>
            <SectionIntro id="compare-title" eyebrow="Side by side" title="Three characters, compared." text="Quickest is not the same as furthest. Each model trades one for the other differently." className="mb-12 md:mb-16" />
          </Reveal>
          <CompareChart bars={bars} />
          <ConceptNote className="mt-8" />
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="modes-title">
        <Container>
          <Reveal>
            <SectionIntro light id="modes-title" eyebrow="Drive modes" title="One dial, four characters." text="A machined dial on the console changes how the car answers. Each step adjusts throttle, damping and steering together." />
          </Reveal>
          <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {driveModes.map((m) => (
              <li key={m.id} className="flex flex-col rounded-sharp bg-bone p-6">
                <h3 className="font-display text-2xl font-semibold [font-stretch:112%]">{m.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate">{m.text}</p>
                <div className="mt-auto pt-6">
                  <div className="divide-y divide-ink/10 border-t border-ink/15">
                    {(Object.keys(meterLabels) as (keyof typeof meterLabels)[]).map((k) => (
                      <Meter key={k} label={meterLabels[k]} level={m.levels[k]} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <CtaBand model="vire" eyebrow="Drive it" title="Numbers explain. Driving convinces." text="Request a concept test drive, or configure the Vire Track and see what the figures mean." />
    </>
  );
}
