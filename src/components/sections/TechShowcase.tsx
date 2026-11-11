import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, TwoTone } from "@/components/ui/Typography";
import { VehicleImage } from "@/components/ui/VehicleImage";

const features = [
  {
    slot: "aren-detail-light",
    alt: "Close view of the Aren front end with its single continuous light blade",
    title: "One line of light",
    text: "A continuous light blade replaces separate lamps. It greets you, shows charge state and adapts its beam to the road.",
  },
  {
    slot: "aren-detail-cabin",
    alt: "Aren centre console and the lower edge of the curved display, lit by a thin ambient line",
    title: "A cabin that stays out of the way",
    text: "One wide display, a floating console and an ambient line that follows the time of day. Fewer screens, clearer information.",
  },
  {
    slot: "vire-view-rear",
    alt: "Vire seen from the rear three-quarter, with one red light blade across the tail",
    title: "Recognisable after dark",
    text: "Front and rear carry the same single line of light, so every ORVANE is unmistakable at night and quiet in daylight.",
  },
  {
    slot: "vire-detail-cabin",
    alt: "Vire driver area with the machined drive-mode dial on the centre console",
    title: "Controls you can find by feel",
    text: "Physical dials for the things you adjust while driving. Software handles the rest, and keeps improving through over-the-air updates.",
  },
];

/** Home: four technology features with detail imagery, linking to /technology. */
export function TechShowcase() {
  return (
    <Section tone="carbon" aria-labelledby="tech-title">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
          <Reveal className="max-w-3xl">
            <Eyebrow accent="dark" className="mb-5">
              Technology
            </Eyebrow>
            <Heading id="tech-title" level={2} size="xl">
              <TwoTone muted="Engineered in detail." strong="Quiet in use." />
            </Heading>
          </Reveal>
          <LinkButton href="/technology" variant="ghost" className="self-start md:self-auto">
            Explore the technology
          </LinkButton>
        </div>

        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f.title} className="flex flex-col">
              <Reveal variant="mask">
                <VehicleImage slot={f.slot} alt={f.alt} sizes="(min-width: 1440px) 640px, (min-width: 640px) 45vw, 100vw" className="aspect-[4/3] rounded-sharp" />
              </Reveal>
              <h3 className="mt-6 font-display text-2xl font-semibold [font-stretch:112%]">{f.title}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-paper/80">{f.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
