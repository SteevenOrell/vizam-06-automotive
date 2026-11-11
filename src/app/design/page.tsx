import type { Metadata } from "next";
import { EdImage } from "@/components/editorial/EdImage";
import { SectionIntro } from "@/components/editorial/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Eyebrow, TwoTone } from "@/components/ui/Typography";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { Gallery, type GallerySlide } from "@/components/vehicle/Gallery";
import { designPrinciples, designProcess, lightBladeNotes } from "@/data/editorial";
import { imageProps } from "@/data/editorial-images";
import { vehicles } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "Design philosophy",
  description: "How ORVANE concept cars are drawn: composed, honest and precise. Process, the single light blade, and the paints and interiors behind the three models.",
};

export default function Page() {
  const aren = vehicles[0];
  const slides: GallerySlide[] = vehicles.map((v) => {
    const img = imageProps(v.images.profile);
    return { ...img, caption: `${v.name}, ${v.category.toLowerCase()}` };
  });

  return (
    <>
      <PageHeader
        tone="paper"
        eyebrow="Design philosophy"
        title={<TwoTone muted="Shape follows" strong="composure." />}
        intro="An ORVANE concept is drawn the way a calm person speaks: with few words, in the right order. These are the three ideas we hold every line against."
      />

      <Section tone="bone" className="relative overflow-hidden" aria-labelledby="principles-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mx-auto grid max-w-[1440px] grid-cols-3 px-5 sm:px-8 lg:px-12 xl:px-16">
          <span className="border-l border-dashed border-ink/15" />
          <span className="border-l border-dashed border-ink/15" />
          <span className="border-x border-dashed border-ink/15" />
        </div>
        <Container className="relative">
          <Eyebrow accent="light" className="mb-6">
            Principles
          </Eyebrow>
          <h2 id="principles-title" className="sr-only">
            Design principles
          </h2>
          <ol>
            {designPrinciples.map((p) => (
              <Reveal as="li" key={p.n} className="grid gap-6 border-t border-ink/20 py-10 first:border-t-0 md:py-14 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  <p className="font-display text-sm font-semibold tracking-[0.18em] text-amber-ink">{p.n}</p>
                  <h3 className="mt-4 font-display text-[clamp(1.75rem,9vw,4.5rem)] font-semibold uppercase leading-[0.92] tracking-[0.01em] lg:text-[clamp(2.75rem,6vw,5.5rem)] [font-stretch:125%]">{p.title}</h3>
                </div>
                <div className="lg:col-span-5 lg:pt-8">
                  <p className="text-lg leading-relaxed text-ink/90">{p.text}</p>
                  <p className="mt-5 border-l-2 border-amber-ink pl-4 text-base text-slate">{p.inCar}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="process-title">
        <Container>
          <Reveal>
            <SectionIntro id="process-title" eyebrow="Process" title="From pencil to light." text="Four stages, always in the same order. Each one answers a question the previous one could not." />
          </Reveal>
          <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12 lg:gap-8">
            <Reveal variant="mask" className="lg:col-span-7">
              <EdImage name="ed-sketch-desk" sizes="(min-width: 1440px) 742px, (min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] rounded-sharp" />
            </Reveal>
            <Reveal variant="mask" className="lg:col-span-5 lg:mt-24">
              <EdImage name="ed-clay-studio" sizes="(min-width: 1440px) 530px, (min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] rounded-sharp lg:aspect-[4/5]" />
            </Reveal>
          </div>
          <Reveal as="ol" stagger={0.1} className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {designProcess.map((s) => (
              <li key={s.n} className="border-t border-amber pt-5">
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-amber">{s.n}</p>
                <h3 className="mt-4 font-display text-xl font-semibold [font-stretch:112%]">{s.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-paper/80">{s.text}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="carbon" aria-labelledby="light-title">
        <Container>
          <Reveal>
            <SectionIntro
              id="light-title"
              eyebrow="Signature"
              title={<TwoTone muted="One blade of light." strong="Three faces." />}
              text="The light blade replaces lamps, badges and chrome. It is the one piece of decoration on an ORVANE, and it does a job: greeting, signalling, lighting the road."
            />
          </Reveal>
          <Reveal as="ul" stagger={0.12} className="mt-14 grid gap-8 md:mt-20 md:grid-cols-3">
            {lightBladeNotes.map((n) => (
              <li key={n.slot} className="flex flex-col">
                <VehicleImage slot={n.slot} sizes="(min-width: 1440px) 420px, (min-width: 768px) 30vw, 100vw" className="aspect-[4/3] rounded-sharp" />
                <h3 className="mt-5 font-display text-xl font-semibold [font-stretch:112%]">{n.model}</h3>
                <p className="mt-2 text-base leading-relaxed text-paper/80">{n.text}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="palette-title">
        <Container>
          <Reveal>
            <SectionIntro light id="palette-title" eyebrow="Colour and material" title="A small palette, chosen slowly." text="Five paints and three interiors, shared by the whole lineup. Swatches are approximate on screen; the names match the configurator." />
          </Reveal>

          <h3 className="mt-14 text-xs font-medium uppercase tracking-[0.24em] text-amber-ink md:mt-20">Exterior paints</h3>
          <Reveal as="ul" stagger={0.08} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {aren.colours.map((c) => (
              <li key={c.id} className="flex flex-col">
                <span aria-hidden="true" className="block aspect-[4/3] rounded-sharp border border-ink/15" style={{ backgroundColor: c.hex }} />
                <span className="mt-3 font-display text-lg font-semibold [font-stretch:112%]">{c.name}</span>
                <span className="text-sm capitalize text-slate">{c.finish} &middot; {c.hex}</span>
              </li>
            ))}
          </Reveal>

          <h3 className="mt-14 text-xs font-medium uppercase tracking-[0.24em] text-amber-ink">Interiors</h3>
          <Reveal as="ul" stagger={0.08} className="mt-6 grid gap-4 sm:grid-cols-3">
            {aren.interiors.map((i) => (
              <li key={i.id} className="flex flex-col rounded-sharp bg-bone p-4">
                <span aria-hidden="true" className="block h-24 rounded-sharp border border-ink/15" style={{ backgroundColor: i.swatch }} />
                <span className="mt-4 font-display text-lg font-semibold [font-stretch:112%]">{i.name}</span>
                <span className="mt-1 text-sm leading-relaxed text-slate">{i.material}</span>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="silhouettes-title">
        <Container>
          <Reveal>
            <SectionIntro id="silhouettes-title" eyebrow="Silhouettes" title="Three profiles, one family." text="Seen from the side, the three cars share a shoulder line and a low, forward-set cabin. Swipe, or use the arrows." className="mb-12 md:mb-16" />
          </Reveal>
          <Gallery slides={slides} label="ORVANE side views" />
          <ConceptNote className="mt-8" />
        </Container>
      </Section>

      <CtaBand eyebrow="See it in colour" title="Choose your paint and interior." text="Build any model in the configurator, then ask for a concept test drive. Nothing is sent or stored in this demonstration." />
    </>
  );
}
