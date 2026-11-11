import type { Metadata } from "next";
import { Info } from "lucide-react";
import { EdImage } from "@/components/editorial/EdImage";
import { SectionIntro } from "@/components/editorial/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { storyChapters, storyNotice, storyValues } from "@/data/editorial";

export const metadata: Metadata = {
  title: "Brand story",
  description: "An imagined origin for ORVANE, a fictional electric car brand: a workshop by the sea, a single line of light and a calm atelier. A VIZAM concept narrative.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Brand story"
        title="A quieter idea of the electric car."
        intro="Every brand needs an origin. This one is invented, and told here as a design exercise: how the concept imagines ORVANE began, and what it would care about."
      >
        <p data-concept-narrative className="mt-10 flex max-w-2xl items-start gap-3 border-l-2 border-amber pl-4 text-sm leading-relaxed text-paper/90">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber" />
          <span>{storyNotice}</span>
        </p>
      </PageHeader>

      <Section tone="paper" aria-labelledby="origin-title">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variant="mask" className="lg:col-span-7">
              <EdImage name="ed-founding-garage" sizes="(min-width: 1440px) 742px, (min-width: 1024px) 52vw, 100vw" className="aspect-[16/10] rounded-sharp" />
            </Reveal>
            <Reveal className="lg:col-span-5">
              <Eyebrow accent="light" className="mb-5">
                Origin
              </Eyebrow>
              <Heading id="origin-title" level={2} size="lg">
                It starts with a covered car and a single lamp.
              </Heading>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/90">
                <p>The concept imagines a workshop at the end of a coast road, a dust sheet over something half finished and a small team who would rather talk about how a car feels at the end of a long drive than how fast it is off the line.</p>
                <p className="text-slate">Their question is simple and, in this story, unanswered: why do electric cars still feel busy? Too many screens, too many surfaces, too many ways to be impressed.</p>
                <p className="text-slate">The answer the concept gives is subtraction. Fewer parts, one line of light, and a platform calm enough to carry three very different cars.</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="carbon" aria-labelledby="timeline-title">
        <Container>
          <Reveal>
            <SectionIntro id="timeline-title" eyebrow="Imagined timeline" title="Five chapters of a story that has not happened." text="Chapters, not dates. Nothing here refers to a real event, person or place." />
          </Reveal>
          <ol className="relative mt-14 md:mt-20">
            <span aria-hidden="true" className="absolute inset-y-2 left-[1.15rem] w-px bg-graphite lg:left-1/2" />
            {storyChapters.map((c, i) => (
              <Reveal as="li" key={c.n} className="relative grid gap-4 pb-12 pl-14 last:pb-0 lg:grid-cols-2 lg:gap-24 lg:pl-0">
                <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full border border-amber bg-ink font-display text-xs font-semibold text-amber lg:left-1/2 lg:-translate-x-1/2">
                  {c.n}
                </span>
                <div className={i % 2 === 0 ? "lg:col-start-1 lg:pr-12" : "lg:col-start-2 lg:pl-12"}>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber">Chapter {c.n}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold [font-stretch:112%] md:text-3xl">{c.title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/80">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="bone" aria-labelledby="values-title">
        <Container>
          <Reveal>
            <SectionIntro light id="values-title" eyebrow="Values" title="Four things the story would keep returning to." />
          </Reveal>
          <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-px overflow-hidden rounded-sharp border border-ink/15 bg-ink/15 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {storyValues.map((v, i) => (
              <li key={v.title} className="bg-bone p-6 md:p-8">
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-amber-ink">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 font-display text-xl font-semibold [font-stretch:112%]">{v.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate">{v.text}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink" spacing="none" className="pb-16 md:pb-24 xl:pb-40" aria-labelledby="atelier-title">
        <Reveal variant="mask">
          <EdImage name="ed-atelier" sizes="100vw" className="aspect-[16/9] md:aspect-[21/9]" />
        </Reveal>
        <Container className="mt-12 md:mt-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-6">
              <SectionIntro id="atelier-title" eyebrow="The atelier" title="A room, not a factory hall." />
            </Reveal>
            <Reveal className="space-y-5 text-lg leading-relaxed text-paper/80 lg:col-span-6 lg:pt-10">
              <p>In the story, final assembly happens in one bright room with a polished floor and daylight from above. Each car stands on its own platform while a small team finishes it by hand.</p>
              <p>Fewer stations and more time per car is the whole idea. It is slower on paper, and it is what lets the details stay precise.</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <section data-tone="ink" aria-labelledby="closing-title" className="relative isolate flex min-h-[90svh] items-start overflow-hidden lg:min-h-[70svh] lg:items-end bg-ink text-paper">
        <div className="absolute inset-0 -z-10">
          <EdImage name="ed-coast-road" sizes="100vw" className="h-full! object-[72%_60%]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/70 to-ink/0 lg:bg-gradient-to-t lg:via-ink/60 lg:to-ink/10" />
        <Container className="py-16 md:py-24">
          <Eyebrow accent="dark" className="mb-5">
            The road ahead
          </Eyebrow>
          <h2 id="closing-title" className="max-w-3xl font-display text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.02] [font-stretch:112%]">
            The story is invented. The cars are yours to explore.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/90">Meet the three concept models, or request a concept test drive. Nothing is sent or stored in this demonstration.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/models" size="lg">
              Explore the models
            </LinkButton>
            <LinkButton href="/test-drive" size="lg" variant="ghost">
              Book a test drive
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
