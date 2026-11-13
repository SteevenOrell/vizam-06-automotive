import { ConceptNote } from "@/components/ui/ConceptNote";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { vehicles } from "@/data/vehicles";
import { formatPrice } from "@/lib/configurator";
import { specRows } from "@/lib/vehicle-stats";

/** /models: compact comparison of the entry trim of each model. Scrolls inside its own container on small screens. */
export function ComparisonTable() {
  const rows = specRows(vehicles[0].specs).map((row) => ({
    label: row.label,
    values: vehicles.map((v) => specRows(v.specs).find((r) => r.key === row.key)?.value ?? ""),
  }));
  const allRows = [
    { label: "Body", values: vehicles.map((v) => v.category) },
    ...rows,
    { label: "Concept price from", values: vehicles.map((v) => formatPrice(v.basePrice)) },
  ];

  return (
    <Section tone="paper" aria-labelledby="compare-title">
      <Container>
        <Eyebrow accent="light" className="mb-5">
          Compare
        </Eyebrow>
        <Heading id="compare-title" level={2} size="lg" className="max-w-3xl">
          Side by side, entry trims.
        </Heading>
        <p className="mt-4 max-w-xl text-lg text-slate">Each model is shown in its entry trim. Higher trims are on every model page.</p>

        <div
          role="region"
          aria-labelledby="compare-title"
          tabIndex={0}
          className="mt-10 overflow-x-auto rounded-sharp border border-ink/15 bg-paper"
        >
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">Concept specifications of the ORVANE Aren, Sola and Vire entry trims</caption>
            <thead>
              <tr className="border-b border-ink/15 bg-bone">
                <td className="p-4 text-xs uppercase tracking-[0.18em] text-slate md:p-5">Concept data</td>
                {vehicles.map((v) => (
                  <th key={v.slug} scope="col" className="p-4 font-display text-lg font-semibold uppercase tracking-[0.06em] md:p-5">
                    {v.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map((row) => (
                <tr key={row.label} className="border-b border-ink/10 last:border-b-0">
                  <th scope="row" className="p-4 text-sm font-medium text-slate md:p-5">
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={`${row.label}-${vehicles[i].slug}`} className="p-4 text-base md:p-5">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ConceptNote className="mt-6 max-w-3xl text-slate" />
      </Container>
    </Section>
  );
}
