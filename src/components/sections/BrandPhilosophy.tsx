import { Reveal } from "@/components/motion/Reveal";
import { RevealLines } from "@/components/motion/RevealLines";
import { LinkButton } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, TwoTone } from "@/components/ui/Typography";

const principles = [
  { n: "01", title: "Composed", text: "Calm is a performance figure. We tune for steadiness at speed before we tune for the headline number." },
  { n: "02", title: "Honest", text: "Few surfaces, few screens, few gimmicks. Every control is there because somebody needed it." },
  { n: "03", title: "Precise", text: "Small tolerances, long test cycles and software that gets better after delivery." },
];

/** Home: philosophy on warm paper with a two-tone headline and thin vertical guide lines (reference 03). */
export function BrandPhilosophy() {
  return (
    <Section tone="paper" className="relative overflow-hidden" aria-labelledby="philosophy-title">
      {/* Guide-line motif */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mx-auto grid max-w-[1440px] grid-cols-3 px-5 sm:px-8 lg:px-12 xl:px-16">
        <span className="border-l border-dashed border-ink/15" />
        <span className="border-l border-dashed border-ink/15" />
        <span className="border-x border-dashed border-ink/15" />
      </div>

      <Container className="relative">
        <Eyebrow accent="light" className="mb-6">
          Philosophy
        </Eyebrow>
        <h2 id="philosophy-title" className="max-w-6xl font-display text-[clamp(2.25rem,5vw,4.75rem)] font-semibold leading-[1] tracking-[-0.01em] [font-stretch:112%]">
          <RevealLines as="span" className="block text-ink/60" lines={["We build electric cars"]} />
          <RevealLines as="span" className="block" lines={["that stay calm at any speed."]} delay={0.15} />
        </h2>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          <Reveal className="md:col-span-1">
            <p className="text-lg leading-relaxed text-slate md:text-xl">
              <TwoTone muted="Speed is easy to sell." strong="Composure is harder to build." />
            </p>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.1}>
            <p className="max-w-2xl text-lg leading-relaxed text-ink/85">
              ORVANE starts with the person behind the wheel and works outward: a low seating position, a quiet structure, a drivetrain that delivers power
              in a line you can predict. The shape follows from that, with long surfaces, short overhangs and one continuous line of light.
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
              The result is a lineup that feels unhurried even when it is not. Three concept models, each with its own character, built on one platform.
            </p>
          </Reveal>
        </div>

        <Reveal stagger={0.12} className="mt-16 grid gap-px overflow-hidden rounded-sharp border border-ink/15 bg-ink/15 md:mt-24 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.n} className="bg-paper p-6 md:p-8">
              <p className="font-display text-sm font-semibold tracking-[0.18em] text-amber-ink">{p.n}</p>
              <h3 className="mt-6 font-display text-2xl font-semibold [font-stretch:112%]">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate">{p.text}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-12">
          <LinkButton href="/design" tone="light" variant="solid">
            Read the design philosophy
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
