import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Technology",
  description: "Battery, motors, charging and software behind the ORVANE concept lineup.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Technology"
      title="Engineered to stay out of the way."
      intro="Battery, motors and software designed to feel calm, predictable and quick."
    />
  );
}