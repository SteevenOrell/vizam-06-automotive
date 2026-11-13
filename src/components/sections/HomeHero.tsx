import { getImageProps } from "next/image";
import { RevealLines } from "@/components/motion/RevealLines";
import { ScrollMedia } from "@/components/motion/ScrollMedia";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { Eyebrow } from "@/components/ui/Typography";
import { getImageSlot } from "@/data/images";

/**
 * Immersive full-viewport home hero. Art direction: a portrait crop on phones, the landscape frame from 768px up.
 * On displays wider than 1672px the picture stays in a centred 1672px frame (native width is 1672px) and fades into ink
 * instead of being stretched. Dark gradients keep text above AA contrast; ScrollMedia adds a slow scale and drift on scroll.
 */
export function HomeHero() {
  const desktop = getImageSlot("hero-home-desktop");
  const mobile = getImageSlot("hero-home-mobile");
  if (!desktop?.src || !mobile?.src) throw new Error("Home hero images are missing from the slot registry");

  const alt = desktop.alt;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ src: desktop.src, width: desktop.width, height: desktop.height, alt, sizes: "(min-width: 1672px) 1672px, 100vw", quality: 85 });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ src: mobile.src, width: mobile.width, height: mobile.height, alt, sizes: "100vw", quality: 85, fetchPriority: "high", loading: "eager" });

  return (
    <section aria-label="ORVANE Aren" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-10 mx-auto max-w-[1672px]">
        <ScrollMedia className="h-full w-full" scaleTo={1.14} yPercent={5}>
          <picture>
            <source media="(min-width: 1024px) and (min-aspect-ratio: 11/10)" srcSet={desktopSrcSet} sizes="(min-width: 1672px) 1672px, 100vw" />
            <img {...imgProps} srcSet={mobileSrcSet} alt={alt} className="h-[100svh] min-h-[560px] w-full object-cover object-[32%_center] [@media(min-width:1024px)_and_(min-aspect-ratio:11/10)]:object-left" />
          </picture>
        </ScrollMedia>
      </div>

      {/* Contrast: top for the header and name, left and bottom for the headline block. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(11_12_14/0.55)_0%,rgb(11_12_14/0)_32%,rgb(11_12_14/0)_58%,rgb(11_12_14/0.85)_100%)] lg:bg-[linear-gradient(to_right,rgb(11_12_14/0.78)_0%,rgb(11_12_14/0.35)_34%,rgb(11_12_14/0)_55%),linear-gradient(to_bottom,rgb(11_12_14/0.5)_0%,rgb(11_12_14/0)_30%,rgb(11_12_14/0)_65%,rgb(11_12_14/0.7)_100%)]" />
      <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 hidden w-[max(0px,calc((100vw-1672px)/2+120px))] bg-gradient-to-r from-ink to-transparent min-[1672px]:block" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[max(0px,calc((100vw-1672px)/2+120px))] bg-gradient-to-l from-ink to-transparent min-[1672px]:block" />

      <Container className="grid flex-1 grid-rows-[auto_1fr_auto] pb-10 pt-28 lg:grid-rows-[auto_1fr_auto_auto] lg:pb-14 lg:pt-32">
        <div>
          <Eyebrow accent="dark" className="mb-3 lg:mb-5">
            ORVANE Aren · Concept
          </Eyebrow>
          <p aria-hidden="true" className="font-display text-[clamp(3.75rem,13vw,10.5rem)] font-semibold uppercase leading-[0.82] tracking-[0.02em] [font-stretch:125%]">
            Aren
          </p>
        </div>

        <h1 className="row-start-2 mt-5 max-w-[26rem] self-start font-display lg:whitespace-nowrap text-[clamp(1.75rem,2.6vw,2.75rem)] font-semibold leading-[1.08] [font-stretch:112%] lg:row-start-3 lg:mt-0 lg:self-end">
          <RevealLines lines={["The calm side of", "electric performance."]} immediate />
          <span className="sr-only"> Aren, a grand touring sedan from ORVANE.</span>
        </h1>

        <div className="row-start-3 lg:row-start-4 lg:mt-6">
          <p className="hidden max-w-[22rem] text-base leading-relaxed text-paper/85 lg:block">
            A grand touring sedan with 720 km of concept range and a cabin built to stay quiet. Distance, composed.
          </p>
          <div className="mt-0 flex flex-wrap gap-3 lg:mt-7">
            <LinkButton href="/models/aren" size="lg">
              Explore Aren
            </LinkButton>
            <LinkButton href="/configure?model=aren" variant="ghost" size="lg">
              Configure
            </LinkButton>
          </div>
        </div>
      </Container>

      <div aria-hidden="true" className="absolute bottom-8 right-8 hidden items-center gap-3 text-[0.6875rem] uppercase tracking-[0.24em] text-paper/80 lg:flex lg:right-12">
        <span>Scroll</span>
        <span className="scroll-cue-line relative block h-12 w-px overflow-hidden bg-paper/30" />
      </div>
    </section>
  );
}
