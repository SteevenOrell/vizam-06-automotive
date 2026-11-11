import type { ReactNode } from "react";
import { Container, Section, isDarkTone, type SurfaceTone } from "./Layout";
import { Eyebrow, Heading } from "./Typography";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: SurfaceTone;
  children?: ReactNode;
}

/** Page-top block with the page's single h1. Clears the fixed header. */
export function PageHeader({ eyebrow, title, intro, tone = "ink", children }: PageHeaderProps) {
  return (
    <Section tone={tone} spacing="none" className="pb-16 pt-32 md:pb-24 md:pt-44">
      <Container>
        {eyebrow ? (
          <Eyebrow accent={isDarkTone(tone) ? "dark" : "light"} className="mb-5">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Heading level={1} size="xl" className="max-w-5xl">
          {title}
        </Heading>
        {intro ? <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80 md:text-xl">{intro}</p> : null}
        {children}
      </Container>
    </Section>
  );
}
