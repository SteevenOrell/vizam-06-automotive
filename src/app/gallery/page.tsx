import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Studio and road imagery of the ORVANE concept lineup.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Gallery"
      title="Studio and road."
      intro="Aren, Sola and Vire in the studio and out on the road."
    />
  );
}