import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Models",
  description: "Aren, Sola and Vire: three electric ORVANE concept models compared side by side.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Lineup"
      title="Three ways to go electric."
      intro="A grand touring sedan, a performance SUV and a two-door coupé, built on one engineering idea."
    />
  );
}