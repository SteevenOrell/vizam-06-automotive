import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Innovation",
  description: "Concept research from the ORVANE engineering team: materials, efficiency and future platforms.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Innovation"
      title="What we are working on next."
      intro="Materials, efficiency and platform ideas from the ORVANE concept studio."
    />
  );
}