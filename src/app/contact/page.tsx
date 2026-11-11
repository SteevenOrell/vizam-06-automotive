import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Heading } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request information about the ORVANE concept lineup. Demonstration form: nothing is sent or stored.",
};

const FAQ = [
  {
    q: "Is ORVANE a real car company?",
    a: "No. ORVANE is a fictional electric performance brand, created by the VIZAM studio as a portfolio concept to show design, interface and front-end engineering.",
  },
  {
    q: "Are the prices and specifications real?",
    a: "No. Every price, range, power and charging figure is concept data, shown in Canadian dollars for the exercise. Nothing can be ordered, reserved or financed.",
  },
  {
    q: "Where do the images come from?",
    a: "The vehicle, interior and scene images were AI-generated for this concept. They show no real car, person or place, and none of them is a photograph.",
  },
  {
    q: "Does this form send my message?",
    a: "No. It is checked in your browser and again by this site's server, then it stops. Nothing is emailed, stored or passed to another service.",
  },
  {
    q: "Who built the site?",
    a: "VIZAM, a digital solutions studio. The site is a demonstration of its work; it has no ORVANE contact details because ORVANE does not exist.",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Request information."
        intro="Questions about the lineup, the configurator, press or partnerships. This concept form is a demonstration: it is checked, and then nothing is sent or stored."
      />
      <Section tone="paper" spacing="compact" aria-labelledby="contact-form-title">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <h2 id="contact-form-title" className="sr-only">
              Request information form
            </h2>
            <ContactForm />
          </div>

          <aside aria-label="About this form" className="flex flex-col gap-10">
            <div>
              <Heading level={2} size="md">
                In a real deployment
              </Heading>
              <p className="mt-3 leading-relaxed text-slate">
                A message like this would go to a monitored inbox or a customer system, the sender would get a confirmation, and a person would reply. Spam checks and rate limits would sit in front of it, and the consent wording would be reviewed for the country it serves.
              </p>
            </div>

            <nav aria-label="Related pages">
              <Heading level={2} size="md">
                Explore instead
              </Heading>
              <ul className="mt-3 divide-y divide-ink/15 border-y border-ink/15">
                {[
                  { href: "/models", label: "Models", text: "Aren, Sola and Vire side by side" },
                  { href: "/configure", label: "Configure", text: "Build one and see a concept price" },
                  { href: "/test-drive", label: "Test drive", text: "Request a concept test drive" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group flex min-h-11 items-baseline justify-between gap-4 py-3 transition-colors duration-300 hover:text-amber-ink">
                      <span className="font-display text-lg font-semibold [font-stretch:112%]">{l.label}</span>
                      <span className="text-right text-sm text-slate">{l.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <Heading level={2} size="md">
                About the concept
              </Heading>
              <div className="mt-3 divide-y divide-ink/15 border-y border-ink/15">
                {FAQ.map((item) => (
                  <details key={item.q} className="group py-1">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-medium [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span aria-hidden="true" className="text-xl leading-none text-amber-ink transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="pb-3 pr-8 text-sm leading-relaxed text-slate">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
