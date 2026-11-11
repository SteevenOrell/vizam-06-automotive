import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Design",
  description: "The design philosophy behind ORVANE: proportion, restraint and light.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Design philosophy"
      title="Fewer lines, held longer."
      intro="How proportion, surface and light shape every ORVANE model."
    />
  );
}