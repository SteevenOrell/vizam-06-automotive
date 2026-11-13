import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import Image from "next/image";
import { Configurator } from "@/components/configurator/Configurator";
import { STAGE_SIZES } from "@/components/configurator/preload";
import { getImageSlot } from "@/data/images";
import { getDefaultConfig, getStageSlot } from "@/lib/configurator";

export const metadata: Metadata = pageMetadata({
  title: "Configure",
  description:
    "Build an ORVANE concept vehicle: choose model, paint, wheels, interior and packages, with a live concept price.",
  path: "/configure",
});

/**
 * Prerendered stand-in while the configurator hydrates (it reads ?model= / ?step= on the client). It already paints the
 * default model's stage image in the same box, sizes and quality as the live stage, so the largest image does not wait
 * for JavaScript (LCP). The live stage then shows the same file from cache. A deep link to another model shows this
 * default image until hydration, then switches.
 */
function ConfiguratorFallback() {
  const stage = getImageSlot(getStageSlot(getDefaultConfig("aren"), "exterior"));
  return (
    <div aria-hidden="true" className="lg:flex lg:h-[max(100dvh,640px)] lg:flex-col lg:pt-[4.75rem]">
      {/* Same height as the live stepper row at lg (measured: 57px incl. its border), so the stage does not shift. */}
      <div className="hidden h-[57px] border-b border-graphite lg:block" />
      <div className="lg:flex lg:min-h-0 lg:flex-1">
        <div className="bg-ink pt-[3.75rem] lg:flex-1 lg:pt-0">
          <div className="relative h-[min(56.25vw,45vh)] overflow-hidden bg-[radial-gradient(ellipse_at_50%_65%,#1d2025_0%,var(--carbon)_45%,var(--ink)_100%)] lg:h-full">
            {stage?.src ? (
              <div className="stage-fade-x absolute inset-0">
                <div className="stage-fade-y absolute inset-0">
                  <Image src={stage.src} alt="" fill sizes={STAGE_SIZES} preload loading="eager" className="object-contain" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* Tall enough below lg that the footer starts off-screen, so hydration does not push it down (CLS). */}
        <div className="min-h-[100dvh] bg-carbon lg:min-h-0 lg:w-[440px]" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ConfiguratorFallback />}>
      <Configurator />
    </Suspense>
  );
}
