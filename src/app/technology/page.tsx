import type { Metadata } from "next";
import { EdImage } from "@/components/editorial/EdImage";
import { PlatformExplorer, type ExplorerTab } from "@/components/editorial/PlatformExplorer";
import { SectionIntro } from "@/components/editorial/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatRow } from "@/components/ui/StatRow";
import { Heading } from "@/components/ui/Typography";
import { assistPoints, chargingSteps, cockpitPoints, driveCards, platformTabs, technologyStats } from "@/data/editorial";
import { imageProps } from "@/data/editorial-images";

export const metadata: Metadata = {
  title: "Technology",
  description: "One platform, three drive layouts, a shared thermal loop and software that improves over the air: the engineering behind the ORVANE concept lineup.",
};

export default function Page() {
  const tabs: ExplorerTab[] = platformTabs.map((t) => ({ ...t, image: t.visual === "thermal" ? null : imageProps(t.visual, t.alt) }));

  return (
    <>
      <PageHeader
        eyebrow="Technology"
        title="Engineered to stay out of the way."
        intro="One platform sits under all three ORVANE concept models: a low battery, a shared motor family, one thermal loop and one software stack. The aim is a car that feels calm, predictable and quick."
      >
        <div className="mt-14 md:mt-20">
          <StatRow stats={technologyStats} />
        </div>
      </PageHeader>

      <Section tone="carbon" aria-labelledby="platform-title">
        <Container>
          <Reveal>
            <SectionIntro
              id="platform-title"
              eyebrow="Platform explorer"
              title="Four systems, one architecture."
              text="Choose a system to see how it is built and what it does for the driver."
              className="mb-12 md:mb-16"
            />
          </Reveal>
          <PlatformExplorer tabs={tabs} />
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="drive-title">
        <Container>
          <Reveal>
            <SectionIntro
              light
              id="drive-title"
              eyebrow="Drive system"
              title="Three layouts. Pick the character."
              text="The same motors, arranged three ways. Every trim in the lineup uses one of them."
            />
          </Reveal>
          <Reveal stagger={0.12} className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
            {driveCards.map((c, i) => (
              <article key={c.layout} className="flex flex-col rounded-sharp border border-ink/15 bg-bone p-6 md:p-8">
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-amber-ink">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 font-display text-2xl font-semibold leading-tight [font-stretch:112%]">{c.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate">{c.text}</p>
                <div className="mt-auto pt-8">
                  <ul className="divide-y divide-ink/15 border-t border-ink/15 text-sm">
                    {c.trims.map((t) => (
                      <li key={`${t.model}-${t.trim}`} className="flex items-baseline justify-between gap-4 py-3">
                        <span>{t.trim}</span>
                        <span className="tabular-nums text-slate">{t.powerKw} kW</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </Reveal>
          <ConceptNote className="mt-8 text-ink" />
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="charging-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <SectionIntro
                id="charging-title"
                eyebrow="Charging"
                title="Charging as a routine, not an event."
                text="The concept treats a charge stop as something the car prepares for. Four steps, almost all of them handled for you."
              />
            </Reveal>
            <Reveal as="ol" stagger={0.1} className="divide-y divide-graphite border-y border-graphite lg:col-span-7">
              {chargingSteps.map((s) => (
                <li key={s.n} className="grid gap-2 py-7 sm:grid-cols-[5rem_1fr] sm:gap-8">
                  <span className="font-display text-3xl font-semibold text-amber [font-stretch:125%]">{s.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold [font-stretch:112%]">{s.title}</h3>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-paper/80">{s.text}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="carbon" spacing="none" className="pb-16 md:pb-24 xl:pb-40" aria-labelledby="cockpit-title">
        <Reveal variant="mask">
          <EdImage name="ed-cockpit-night" sizes="100vw" className="aspect-[16/9] md:aspect-[21/9]" />
        </Reveal>
        <Container className="mt-12 md:mt-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <SectionIntro id="cockpit-title" eyebrow="Software and cockpit" title="A cabin at night should be quiet." text="Fewer screens, clearer information, and a display that gives the dark road ahead priority." />
            </Reveal>
            <Reveal stagger={0.1} className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
              {cockpitPoints.map((p) => (
                <div key={p.title} className="border-t border-amber pt-5">
                  <h3 className="font-display text-lg font-semibold [font-stretch:112%]">{p.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-paper/80">{p.text}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="assist-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <SectionIntro
                light
                id="assist-title"
                eyebrow="Driver assistance"
                title="Assistance that helps, and never takes over."
                text="The driver stays responsible at all times. These are concept features, described here as design intent."
              />
              <p className="mt-6 max-w-md text-sm leading-relaxed text-slate">
                Extended motorway assistance is offered as the Assist Plus package on Aren and Sola. No safety rating, certification or test result is claimed for this concept.
              </p>
            </Reveal>
            <Reveal stagger={0.1} as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {assistPoints.map((p) => (
                <li key={p.title} className="rounded-sharp bg-bone p-6">
                  <Heading level={3} size="sm">
                    {p.title}
                  </Heading>
                  <p className="mt-3 text-base leading-relaxed text-slate">{p.text}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand eyebrow="Feel the difference" title="Judge it from the driver's seat." text="Request a concept test drive, or build the model that suits you. Nothing is sent or stored in this demonstration." />
    </>
  );
}
