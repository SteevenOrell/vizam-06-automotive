import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Eyebrow } from "@/components/ui/Typography";
import { modelRoutes, routes } from "@/data/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This ORVANE page does not exist.",
};

const more = [routes.configure, routes.technology, routes.story, routes.gallery, routes.contact];

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="This road ends here." intro="The page you were looking for does not exist or has moved.">
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/" size="lg">
            Back to home
          </LinkButton>
          <LinkButton href="/models" variant="ghost" size="lg">
            See the models
          </LinkButton>
        </div>
      </PageHeader>
      <Section tone="paper" spacing="compact" aria-labelledby="notfound-more">
        <Container>
          <Eyebrow as="h2" accent="light" className="mb-6">
            <span id="notfound-more">Pick up the route</span>
          </Eyebrow>
          <ul className="grid gap-px overflow-hidden rounded-sharp border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {[...modelRoutes, routes.testDrive, ...more].slice(0, 8).map((r) => (
              <li key={r.href} className="bg-paper">
                <Link href={r.href} className="group flex min-h-24 flex-col justify-between p-5 transition-colors duration-300 hover:bg-bone">
                  <span className="font-display text-xl font-semibold [font-stretch:112%]">{r.label}</span>
                  <span className="mt-2 text-sm text-slate">{r.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
