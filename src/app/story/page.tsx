import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Story",
  description: "The story of ORVANE, a fictional electric performance brand imagined by VIZAM.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Brand story"
      title="A brand built around the drive."
      intro="Where the ORVANE idea comes from, and what it promises to keep."
    />
  );
}