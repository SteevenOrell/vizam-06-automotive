import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Performance",
  description: "Chassis, power delivery and control across the ORVANE concept lineup.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Performance"
      title="Power you can place precisely."
      intro="Chassis, torque control and cooling, tuned for confidence before outright numbers."
    />
  );
}