import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { Gallery, type GallerySlide } from "@/components/vehicle/Gallery";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { filmStripSlots, galleryEntries } from "@/data/gallery";
import { getImageSlot } from "@/data/images";
import type { GalleryTile } from "@/lib/gallery";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description:
    "Studio, interior, detail and road imagery of the ORVANE concept lineup. AI-generated for this concept.",
  path: "/gallery",
});

function buildTiles(): GalleryTile[] {
  return galleryEntries.flatMap((entry) => {
    const slot = getImageSlot(entry.slot);
    if (!slot?.src) return [];
    return [
      {
        id: entry.slot,
        src: slot.src,
        width: slot.width,
        height: slot.height,
        alt: entry.alt ?? slot.alt,
        caption: entry.caption,
        meta: entry.meta,
        kind: entry.kind,
        model: entry.model,
      },
    ];
  });
}

function buildStrip(): GallerySlide[] {
  return filmStripSlots.flatMap(({ slot: key, caption }) => {
    const slot = getImageSlot(key);
    return slot?.src ? [{ src: slot.src, width: slot.width, height: slot.height, alt: slot.alt, caption }] : [];
  });
}

export default function Page() {
  const tiles = buildTiles();
  const strip = buildStrip();
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Studio and road."
        intro="The five ORVANE concepts in the studio and out on the road: views, cabins, details and the places they were imagined."
      />

      <Section tone="carbon" spacing="compact" aria-labelledby="gallery-grid-title">
        <Container>
          <h2 id="gallery-grid-title" className="sr-only">
            Image gallery
          </h2>
          <GalleryExplorer tiles={tiles} />
          <ConceptNote className="mt-10">All images are AI-generated for this concept. They show no real vehicle, person or place.</ConceptNote>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="film-strip-title" className="overflow-hidden">
        <Container>
          <div className="mb-10 max-w-2xl">
            <Eyebrow accent="dark" className="mb-4">
              Film strip
            </Eyebrow>
            <Heading id="film-strip-title" level={2} size="xl">
              From sketch to platform.
            </Heading>
            <p className="mt-4 text-lg leading-relaxed text-paper/75">Five frames from the making of the lineup: the desk, the clay, the tunnel, the light lab and the platform underneath.</p>
          </div>
          <Gallery slides={strip} label="From sketch to platform" />
        </Container>
      </Section>

      <CtaBand title="See one in motion." text="Pick a model, choose your paint and wheels, or book a concept test drive." />
    </>
  );
}
