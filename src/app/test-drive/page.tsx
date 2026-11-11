import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Book a test drive",
  description: "Request an ORVANE concept test drive. Demonstration form: nothing is sent or stored.",
};

export default function Page() {
  return (
    <PageHeader
      eyebrow="Test drive"
      title="Book a test drive."
      intro="Choose a model, a date and where you would like to drive. This concept form is a demonstration; nothing is sent."
    />
  );
}