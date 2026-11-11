import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { formatPrice } from "@/lib/configurator";
import { specRows } from "@/lib/vehicle-stats";
import type { Vehicle } from "@/types";

/** Model page: every trim against every spec, in a table that scrolls inside its own region on small screens. */
export function SpecsSection({ vehicle: v }: { vehicle: Vehicle }) {
  const labels = specRows(v.trims[0].specs);

  return (
    <Section tone="paper" aria-labelledby="specs-title">
      <Container>
        <Eyebrow accent="light" className="mb-5">
          Specifications
        </Eyebrow>
        <Heading id="specs-title" level={2} size="xl" className="max-w-4xl">
          Performance specifications
        </Heading>
        <p className="mt-5 max-w-xl text-lg text-slate">The {v.name} comes in three variants on one platform. Concept data for each.</p>

        <div role="region" aria-labelledby="specs-title" tabIndex={0} className="mt-10 overflow-x-auto rounded-sharp border border-ink/15">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Concept specifications of the {v.name} variants</caption>
            <thead>
              <tr className="border-b border-ink/15 bg-bone align-bottom">
                <td className="p-4 text-xs uppercase tracking-[0.18em] text-slate md:p-5">Concept data</td>
                {v.trims.map((t) => (
                  <th key={t.id} scope="col" className="p-4 md:p-5">
                    <span className="block font-display text-lg font-semibold [font-stretch:112%]">{t.name}</span>
                    <span className="mt-1 block max-w-[16rem] text-sm font-normal leading-snug text-slate">{t.description}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((row) => (
                <tr key={row.key} className="border-b border-ink/10">
                  <th scope="row" className="p-4 text-sm font-medium text-slate md:p-5">
                    {row.label}
                  </th>
                  {v.trims.map((t) => (
                    <td key={t.id} className="p-4 text-base md:p-5">
                      {specRows(t.specs).find((r) => r.key === row.key)?.value}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-4 text-sm font-medium text-slate md:p-5">
                  Concept price from
                </th>
                {v.trims.map((t) => (
                  <td key={t.id} className="p-4 text-base font-medium md:p-5">
                    {formatPrice(v.basePrice + t.priceDelta)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <ConceptNote className="mt-6 max-w-3xl text-slate" />
      </Container>
    </Section>
  );
}
