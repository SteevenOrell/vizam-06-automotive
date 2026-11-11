import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Configure",
  description: "Build an ORVANE concept vehicle: choose model, paint, wheels, interior and packages, with a live concept price.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Configurator"
      title="Configure your ORVANE."
      intro="Choose a model, then paint, wheels, interior and packages. Your build saves on this device."
    />
  );
}