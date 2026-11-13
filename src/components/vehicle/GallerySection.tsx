import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, TwoTone } from "@/components/ui/Typography";
import { getImageSlot } from "@/data/images";
import type { Vehicle } from "@/types";
import { Gallery, type GallerySlide } from "./Gallery";

/** Model page: scroll-snap gallery of the model's views and details. */
export function GallerySection({ vehicle: v }: { vehicle: Vehicle }) {
  const slides: GallerySlide[] = v.content.gallery.flatMap((item) => {
    const slot = getImageSlot(item.slot);
    return slot?.src ? [{ src: slot.src, width: slot.width, height: slot.height, alt: slot.alt, caption: item.caption }] : [];
  });

  return (
    <Section tone="carbon" aria-labelledby="gallery-title" className="overflow-hidden">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Eyebrow accent="dark" className="mb-5">
            Gallery
          </Eyebrow>
          <Heading id="gallery-title" level={2} size="xl">
            <TwoTone muted="Every angle," strong="up close." />
          </Heading>
        </div>
        <Gallery slides={slides} label={`${v.name} image gallery`} />
      </Container>
    </Section>
  );
}
