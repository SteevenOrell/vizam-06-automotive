import type { CompareBar } from "@/lib/editorial";

interface CompareChartProps {
  bars: CompareBar[];
}

function Group({ title, note, bars, pick }: { title: string; note: string; bars: CompareBar[]; pick: (b: CompareBar) => { pct: number; label: string } }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold [font-stretch:112%]">{title}</h3>
      <p className="mt-1 text-sm text-paper/70">{note}</p>
      <ul className="mt-6 space-y-4" aria-hidden="true">
        {bars.map((b) => {
          const { pct, label } = pick(b);
          return (
            <li key={b.slug} className="grid grid-cols-[4rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[5rem_1fr_6rem]">
              <span className="text-sm font-medium uppercase tracking-[0.14em]">{b.name}</span>
              <span className="relative col-span-1 block h-3 bg-graphite">
                <span className="absolute inset-y-0 left-0 block bg-amber" style={{ width: `${pct}%` }} />
              </span>
              <span className="col-start-2 text-sm tabular-nums text-paper/90 sm:col-start-auto sm:text-right">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Range and acceleration comparison built from the vehicle data. The bars are decorative (aria-hidden);
 * the table beneath carries the same numbers for everyone.
 */
export function CompareChart({ bars }: CompareChartProps) {
  return (
    <div>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Group title="Acceleration" note="0-100 km/h. Longer bar means quicker." bars={bars} pick={(b) => ({ pct: b.accelPct, label: `${b.zeroToHundredS.toFixed(1)} s` })} />
        <Group title="Range" note="Concept range. Longer bar means further." bars={bars} pick={(b) => ({ pct: b.rangePct, label: `${b.rangeKm} km` })} />
      </div>

      <div role="region" aria-label="Comparison table" tabIndex={0} className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <caption className="pb-3 text-left text-xs uppercase tracking-[0.18em] text-paper/70">Concept data for each model&apos;s entry trim</caption>
          <thead>
            <tr className="border-b border-graphite text-paper/70">
              <th scope="col" className="py-3 pr-4 font-medium">
                Model
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                0-100 km/h
              </th>
              <th scope="col" className="py-3 font-medium">
                Range
              </th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.slug} className="border-b border-graphite">
                <th scope="row" className="py-3 pr-4 font-medium">
                  {b.name}
                </th>
                <td className="py-3 pr-4 tabular-nums">{b.zeroToHundredS.toFixed(1)} s</td>
                <td className="py-3 tabular-nums">{b.rangeKm} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
