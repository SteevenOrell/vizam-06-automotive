import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow } from "@/components/ui/Typography";

interface CtaBandProps {
  title: string;
  text: string;
  /** Query string value for the model, e.g. "aren". Omit for the generic links. */
  model?: string;
  eyebrow?: string;
}

/** Closing call-to-action band: book a test drive or configure. Used at the end of home and model pages. */
export function CtaBand({ title, text, model, eyebrow = "Next step" }: CtaBandProps) {
  const query = model ? `?model=${model}` : "";
  return (
    <Section tone="bone" spacing="compact" aria-labelledby="cta-title">
      <Container>
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow accent="light" className="mb-4">
              {eyebrow}
            </Eyebrow>
            <h2 id="cta-title" className="font-display text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.02] [font-stretch:112%]">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={`/test-drive${query}`} size="lg">
              Book a test drive
            </LinkButton>
            <LinkButton href={`/configure${query}`} size="lg" variant="ghost" tone="light">
              Configure
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
