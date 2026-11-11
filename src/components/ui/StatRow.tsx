import { cn } from "@/lib/cn";

export interface Stat {
  value: string;
  unit?: string;
  label: string;
}

interface StatRowProps {
  stats: Stat[];
  className?: string;
  /** Adds a "Concept data" caption. On by default because every figure on this site is fictional. */
  conceptLabel?: boolean;
}

/** Large figures with small units and labels (reference 05). Inherits text colour from the section. */
export function StatRow({ stats, className, conceptLabel = true }: StatRowProps) {
  return (
    <div className={cn("w-full", className)}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-1 border-l border-current/20 pl-4">
            <dt className="text-xs uppercase tracking-[0.18em] opacity-75">{s.label}</dt>
            <dd className="font-display text-3xl font-semibold leading-none [font-stretch:112%] md:text-4xl">
              {s.value}
              {s.unit ? <span className="ml-1 align-baseline text-base font-normal opacity-75">{s.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      {conceptLabel ? <p className="mt-4 text-xs uppercase tracking-[0.18em] opacity-75">Concept data</p> : null}
    </div>
  );
}
