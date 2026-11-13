import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import type { FeatureNote, Vehicle } from "@/types";
import { iconForFeature } from "./featureIcons";

function Group({ id, eyebrow, title, notes }: { id: string; eyebrow: string; title: string; notes: FeatureNote[] }) {
  return (
    <section aria-labelledby={id}>
      <Eyebrow accent="dark" className="mb-4">
        {eyebrow}
      </Eyebrow>
      <Heading id={id} level={2} size="lg">
        {title}
      </Heading>
      <Reveal as="ul" stagger={0.08} className="mt-8 grid gap-4 sm:grid-cols-2">
        {notes.map((n) => {
          const Icon = iconForFeature(n.title);
          return (
            <li key={n.title} className="flex flex-col rounded-sharp border border-graphite bg-carbon p-6">
              <Icon aria-hidden="true" className="size-6 text-amber" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug [font-stretch:112%]">{n.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/80">{n.text}</p>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}

/** Model page: technology and safety features from the data, with icons. */
export function FeatureGroups({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <Section tone="ink">
      <Container className="grid gap-16 xl:grid-cols-2 xl:gap-12">
        <Group id="technology-title" eyebrow="Technology" title="Software and systems" notes={v.content.technologyNotes} />
        <Group id="safety-title" eyebrow="Safety" title="Protection and awareness" notes={v.content.safetyNotes} />
      </Container>
    </Section>
  );
}
