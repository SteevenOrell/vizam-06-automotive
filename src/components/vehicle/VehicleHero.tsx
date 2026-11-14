import Image from "next/image";
import { RevealLines } from "@/components/motion/RevealLines";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { Eyebrow } from "@/components/ui/Typography";
import { getImageSlot } from "@/data/images";
import { AREN_HERO_ABOVE_CAR } from "@/data/silhouettes";
import type { Vehicle } from "@/types";

/** Where the car sits in each dark hero on wide screens, so the name and copy avoid it. */
const darkFocus: Record<string, string> = {
  sola: "object-[80%_60%] lg:object-right",
  vire: "object-[52%_60%] lg:object-left",
  tarn: "object-[55%_60%] lg:object-center",
  vanta: "object-[55%_60%] lg:object-center",
};

const maskSvg = (path: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${path}'/></svg>`)}")`;

/** Split a tagline after commas, keeping it to at most two lines. */
export function taglineLines(tagline: string): string[] {
  const parts = tagline.split(/(?<=,) /).filter(Boolean);
  return parts.length > 2 ? [parts.slice(0, -1).join(" "), parts[parts.length - 1]] : parts;
}

function Actions({ vehicle, tone, stack = false }: { vehicle: Vehicle; tone: "dark" | "light"; stack?: boolean }) {
  return (
    <div className={stack ? "flex flex-wrap gap-3 lg:flex-col" : "flex flex-wrap gap-3"}>
      <LinkButton href={`/configure?model=${vehicle.slug}`} size="lg" tone={tone}>
        Configure {vehicle.name}
      </LinkButton>
      <LinkButton href={`/test-drive?model=${vehicle.slug}`} size="lg" variant="ghost" tone={tone}>
        Book a test drive
      </LinkButton>
    </div>
  );
}

/**
 * Model page intro. `paper` (Aren): light stage with the oversized name set behind the car, done with a mask traced from the
 * image's silhouette (reference 03, own typography). `dark` (Sola, Vire): cinematic full-bleed hero with the name overlaid.
 */
export function VehicleHero({ vehicle }: { vehicle: Vehicle }) {
  return vehicle.content.heroTone === "paper" ? <PaperHero vehicle={vehicle} /> : <DarkHero vehicle={vehicle} />;
}

function PaperHero({ vehicle: v }: { vehicle: Vehicle }) {
  const slot = getImageSlot(v.images.hero);
  if (!slot?.src) throw new Error(`Hero image missing for ${v.slug}`);
  const mask = maskSvg(AREN_HERO_ABOVE_CAR);

  return (
    <section aria-label={`${v.name} introduction`} data-tone="paper" className="relative overflow-hidden bg-paper pb-12 pt-24 text-ink md:pt-28 lg:pb-0">
      <div className="mx-auto w-full max-w-[1672px] lg:max-w-[min(1672px,calc((100svh-6rem)*16/9))]">
        <div className="relative">
          <div className="overflow-hidden">
            {/* Phones show a tighter crop of the same stage so the car stays large. */}
            <div className="@container relative -ml-[30%] aspect-video w-[160%] md:ml-0 md:w-full">
              <Image
                src={slot.src}
                alt={slot.alt}
                width={slot.width}
                height={slot.height}
                sizes="(min-width: 1672px) 1672px, (min-width: 768px) 100vw, 160vw"
                quality={85}
                preload
                className="absolute inset-0 h-full w-full [-webkit-mask-image:radial-gradient(ellipse_78%_82%_at_50%_54%,#000_58%,transparent_100%)] [mask-image:radial-gradient(ellipse_78%_82%_at_50%_54%,#000_58%,transparent_100%)]"
              />
              {/* The name is drawn over the image but masked by the car's silhouette, so the car overlaps the letters. */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
              >
                <h1 className="-translate-y-[5cqw] font-display text-[15cqw] md:-translate-y-[8cqw] md:text-[23cqw] font-semibold uppercase leading-none tracking-[0.02em] text-ink [font-stretch:125%]">
                  {v.name}
                </h1>
              </div>
              {/* Guide-line motif */}
              <span aria-hidden="true" className="absolute inset-y-0 left-[25%] border-l border-dashed border-ink/10" />
              <span aria-hidden="true" className="absolute inset-y-0 left-[75%] border-l border-dashed border-ink/10" />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-8 px-5 sm:px-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-10">
            <div className="max-w-sm">
              <Eyebrow accent="light" className="mb-3">
                {v.category}
              </Eyebrow>
              <p className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] [font-stretch:112%]">
                <RevealLines lines={taglineLines(v.tagline)} immediate />
              </p>
            </div>
            <Actions vehicle={v} tone="light" stack />
          </div>
        </div>
      </div>
    </section>
  );
}

function DarkHero({ vehicle: v }: { vehicle: Vehicle }) {
  const slot = getImageSlot(v.images.hero);
  if (!slot?.src) throw new Error(`Hero image missing for ${v.slug}`);
  const lines = taglineLines(v.tagline);

  return (
    <section aria-label={`${v.name} introduction`} className="relative isolate flex flex-col overflow-hidden bg-ink text-paper lg:min-h-[100svh]">
      <div className="relative order-2 aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:-z-10 lg:order-none lg:aspect-auto">
        <div className="absolute inset-0 mx-auto max-w-[1672px]">
          <Image
            src={slot.src}
            alt={slot.alt}
            width={slot.width}
            height={slot.height}
            sizes="(min-width: 1672px) 1672px, 100vw"
            quality={85}
            preload
            className={`h-full w-full object-cover ${darkFocus[v.slug] ?? "object-[70%_60%]"}`}
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--ink)_0%,rgb(11_12_14/0)_32%)] lg:bg-[linear-gradient(to_right,rgb(11_12_14/0.82)_0%,rgb(11_12_14/0.4)_32%,rgb(11_12_14/0)_55%),linear-gradient(to_bottom,rgb(11_12_14/0.5)_0%,rgb(11_12_14/0)_28%,rgb(11_12_14/0)_66%,rgb(11_12_14/0.75)_100%)]" />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[max(0px,calc((100vw-1672px)/2+120px))] bg-gradient-to-r from-ink to-transparent min-[1672px]:block" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[max(0px,calc((100vw-1672px)/2+120px))] bg-gradient-to-l from-ink to-transparent min-[1672px]:block" />
      </div>

      <Container className="order-1 grid flex-1 grid-rows-[auto_auto] pb-6 pt-28 lg:grid-rows-[auto_1fr_auto] lg:pb-14 lg:pt-32">
        <div>
          <Eyebrow accent="dark" className="mb-3 lg:mb-5">
            {v.category}
          </Eyebrow>
          <h1 className="font-display text-[clamp(4rem,17vw,15rem)] font-semibold uppercase leading-[0.85] tracking-[0.02em] [font-stretch:125%]">{v.name}</h1>
        </div>
        <div className="mt-6 lg:col-start-1 lg:row-start-3 lg:mt-0">
          <p className="font-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold leading-[1.1] [font-stretch:112%]">
            <RevealLines lines={lines} immediate />
          </p>
          <p className="mt-4 hidden max-w-sm text-base leading-relaxed text-paper/85 lg:block">{v.summary}</p>
          <div className="mt-6 lg:mt-8">
            <Actions vehicle={v} tone="dark" />
          </div>
        </div>
      </Container>
    </section>
  );
}
