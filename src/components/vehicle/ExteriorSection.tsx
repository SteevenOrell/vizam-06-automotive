import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, TwoTone } from "@/components/ui/Typography";
import { exteriorSlot, getImageSlot } from "@/data/images";
import type { Vehicle } from "@/types";
import { FeatureHotspots } from "./FeatureHotspots";
import { SwitchableImage, type SwitchOption } from "./SwitchableImage";

/** Model page: 3/4 exterior with a paint switcher and numbered feature hotspots (numbered list on phones). */
export function ExteriorSection({ vehicle: v }: { vehicle: Vehicle }) {
  const options: SwitchOption[] = v.colours.flatMap((c) => {
    const slot = getImageSlot(exteriorSlot(v.slug, c.id));
    return slot?.src
      ? [{ id: c.id, label: c.name, detail: `${c.finish} paint`, swatch: c.hex, src: slot.src, width: slot.width, height: slot.height, alt: slot.alt }]
      : [];
  });

  return (
    <Section tone="ink" aria-labelledby="exterior-title">
      <Container>
        <Reveal className="mb-10 max-w-3xl md:mb-14">
          <Eyebrow accent="dark" className="mb-5">
            Exterior design
          </Eyebrow>
          <Heading id="exterior-title" level={2} size="xl">
            <TwoTone muted="Shaped by air," strong="finished by hand." />
          </Heading>
          {v.content.story.map((p) => (
            <p key={p} className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/80 first:mt-6">
              {p}
            </p>
          ))}
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal variant="mask" className="lg:col-span-8">
            <SwitchableImage options={options} defaultId={v.colours[0].id} groupLabel={`${v.name} exterior paint`} sizes="(min-width: 1440px) 856px, (min-width: 1024px) 59vw, 100vw">
              <FeatureHotspots hotspots={v.content.hotspots} label={`${v.name} exterior features`} />
            </SwitchableImage>
          </Reveal>

          <div className="lg:col-span-4">
            <h3 className="font-display text-lg font-semibold [font-stretch:112%]">Exterior features</h3>
            <p className="mt-2 hidden text-sm text-mist md:block">Select a numbered point on the image, or read the list.</p>
            <ol className="mt-6 divide-y divide-graphite border-y border-graphite">
              {v.content.hotspots.map((h, i) => (
                <li key={h.id} className="flex gap-4 py-5">
                  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-amber text-xs font-semibold text-ink">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-display text-base font-semibold [font-stretch:112%]">{h.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-paper/80">{h.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
