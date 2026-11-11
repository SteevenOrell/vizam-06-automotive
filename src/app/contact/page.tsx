import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ORVANE about ownership, press or partnerships. Demonstration form: nothing is sent.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Contact"
      title="Talk to ORVANE."
      intro="Questions about the lineup, press requests or partnerships. This concept form is a demonstration; nothing is sent."
    />
  );
}