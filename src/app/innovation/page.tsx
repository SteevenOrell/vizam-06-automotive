import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { InnovationSequence, type SequenceItem } from "@/components/editorial/InnovationSequence";
import { SectionIntro } from "@/components/editorial/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { researchStages, researchThemes } from "@/data/editorial";
import { imageProps } from "@/data/editorial-images";

export const metadata: Metadata = pageMetadata({
  title: "Innovation",
  description:
    "Four research directions in the ORVANE concept: aerodynamics, light engineering, circular materials and over-the-air evolution. Ideas, not results.",
  path: "/innovation",
});

export default function Page() {
  const items: SequenceItem[] = researchThemes.map((t) => ({ ...t, img: imageProps(t.image, t.alt) }));

  return (
    <>
      <PageHeader
        eyebrow="Innovation"
        title="Four questions we would keep asking."
        intro="Every ORVANE concept starts as a question. These are the four research directions behind the lineup: what the team would study, build on a rig and test for years before any of it reached a road."
      >
        <ConceptNote className="mt-10 max-w-2xl text-paper">
          Everything on this page is a concept direction for a fictional brand. None of it describes a result that has been achieved, tested or certified.
        </ConceptNote>
      </PageHeader>

      <Section tone="paper" aria-labelledby="themes-title">
        <Container>
          <Reveal>
            <SectionIntro light id="themes-title" eyebrow="Research themes" title="Read down the sequence." text="Each direction has a question, a reason it matters to the driver, and the experiments it would involve." className="mb-14 md:mb-24" />
          </Reveal>
          <InnovationSequence items={items} />
        </Container>
      </Section>

      <Section tone="carbon" aria-labelledby="stages-title">
        <Container>
          <Reveal>
            <SectionIntro id="stages-title" eyebrow="Method" title="From question to car, in three stages." text="A direction only moves forward when the previous stage has answered the question it was asked." />
          </Reveal>
          <Reveal as="ol" stagger={0.12} className="mt-14 grid gap-px overflow-hidden rounded-sharp border border-graphite bg-graphite md:mt-20 md:grid-cols-3">
            {researchStages.map((s) => (
              <li key={s.title} className="bg-carbon p-6 md:p-10">
                <p aria-hidden="true" className="font-display text-7xl font-semibold leading-none text-amber [font-stretch:125%]">
                  {s.n}
                </p>
                <h3 className="mt-8 font-display text-2xl font-semibold [font-stretch:112%]">{s.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-paper/80">{s.text}</p>
              </li>
            ))}
          </Reveal>
          <ConceptNote className="mt-8 text-paper" />
        </Container>
      </Section>

      <CtaBand eyebrow="See where it leads" title="The ideas, in three cars." text="Each model carries a different share of these directions. Explore the lineup or request a concept test drive." />
    </>
  );
}
