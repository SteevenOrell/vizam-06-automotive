import { cn } from "@/lib/cn";

/** Original ORVANE mark: an open horizon arc over a ground line, followed by the wide-set name. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg aria-hidden="true" viewBox="0 0 28 16" className="h-3.5 w-auto shrink-0" fill="none">
        <path d="M2 13 C 7 3, 21 3, 26 13" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        <path d="M10 15 H18" stroke="var(--amber)" strokeWidth="2" strokeLinecap="square" />
      </svg>
      <span className="font-display text-sm font-semibold uppercase leading-none tracking-[0.42em] [font-stretch:125%]">
        Orvane
      </span>
    </span>
  );
}
