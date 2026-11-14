import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollMedia } from "@/components/motion/ScrollMedia";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, TwoTone } from "@/components/ui/Typography";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { getImageSlot, interiorSlot } from "@/data/images";
import type { Vehicle } from "@/types";
import { SwitchableImage, type SwitchOption } from "./SwitchableImage";

/** Model page: cabin image with the three interior trims, the feature list and a cabin detail. */
export function InteriorSection({ vehicle: v }: { vehicle: Vehicle }) {
  const options: SwitchOption[] = v.interiors.flatMap((t) => {
    const slot = getImageSlot(interiorSlot(v.slug, t.id));
    return slot?.src
      ? [{ id: t.id, label: t.name, detail: t.material, swatch: t.swatch, src: slot.src, width: slot.width, height: slot.height, alt: slot.alt }]
      : [];
  });

  return (
    <Section tone="carbon" aria-labelledby="interior-title">
      <Container>
        <Reveal className="mb-10 max-w-3xl md:mb-14">
          <Eyebrow accent="dark" className="mb-5">
            Interior design
          </Eyebrow>
          <Heading id="interior-title" level={2} size="xl">
            <TwoTone muted="A cabin with" strong="room to think." />
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">
            {v.interiors.length > 1
              ? "Three interior trims share one layout. Choose the material, and the light, texture and mood of the cabin change with it."
              : `The ${v.name} cabin is shown in Onyx. More trims are in development.`}
          </p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal variant="mask" className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
            <SwitchableImage options={options} defaultId={v.interiors[0].id} groupLabel={`${v.name} interior trim`} sizes="(min-width: 1440px) 742px, (min-width: 1024px) 52vw, 100vw" />
          </Reveal>

          <div className="lg:col-span-5">
            <h3 className="font-display text-lg font-semibold [font-stretch:112%]">Inside the {v.name}</h3>
            <ul className="mt-6 divide-y divide-graphite border-y border-graphite">
              {v.content.interiorNotes.map((n) => (
                <li key={n.title} className="flex gap-4 py-5">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-amber" />
                  <div>
                    <h4 className="font-display text-base font-semibold [font-stretch:112%]">{n.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-paper/80">{n.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* The one scroll-linked vehicle reveal on the page: the cabin detail settles from a slight zoom. */}
            {getImageSlot(`${v.slug}-detail-cabin`)?.src ? (
            <div className="mt-8 overflow-hidden rounded-sharp">
              <ScrollMedia range="self" scaleFrom={1.18} scaleTo={1}>
                <VehicleImage slot={`${v.slug}-detail-cabin`} sizes="(min-width: 1440px) 514px, (min-width: 1024px) 36vw, 100vw" className="aspect-[4/3]" />
              </ScrollMedia>
            </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
