import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { Configurator } from "@/components/configurator/Configurator";

export const metadata: Metadata = pageMetadata({
  title: "Configure",
  description:
    "Build an ORVANE concept vehicle: choose model, paint, wheels, interior and packages, with a live concept price.",
  path: "/configure",
});

function ConfiguratorFallback() {
  return (
    <div aria-hidden="true" className="lg:flex lg:h-[max(100dvh,640px)] lg:pt-[4.75rem]">
      <div className="h-[calc(3.75rem+min(56.25vw,45vh))] bg-ink lg:h-full lg:flex-1" />
      <div className="min-h-[60vh] bg-carbon lg:w-[440px]" />
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
