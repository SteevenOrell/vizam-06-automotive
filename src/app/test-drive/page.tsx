import type { Metadata } from "next";
import { TestDriveExperience } from "@/components/forms/TestDriveExperience";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Book a test drive",
  description: "Request an ORVANE concept test drive. Demonstration form: nothing is sent or stored.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Test drive"
        title="Book a test drive."
        intro="Choose a model, a date and where you would like to drive. This concept form is a demonstration: it is checked, and then nothing is sent or stored."
      />
      <Section tone="paper" spacing="compact" aria-labelledby="request-title">
        <Container>
          <h2 id="request-title" className="sr-only">
            Test drive request
          </h2>
          <TestDriveExperience />
        </Container>
      </Section>
    </>
  );
}
