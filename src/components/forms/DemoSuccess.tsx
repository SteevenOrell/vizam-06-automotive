"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { SummaryLine } from "@/lib/demo-forms";
import { DEMO_NOTICE, FormStatus } from "./FormStatus";

/** Success result of a demonstration form: states plainly that nothing was sent, lists what was validated. */
export function DemoSuccess({ summary, onRestart }: { summary: SummaryLine[]; onRestart: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div ref={ref} tabIndex={-1} className="outline-none">
      <FormStatus tone="success" title="Validated" role="status" className="p-6 md:p-8">
        <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">Thank you. This was a demonstration.</h2>
        <p className="mt-3 text-base">{DEMO_NOTICE}</p>
        {summary.length > 0 ? (
          <dl className="mt-6 divide-y divide-ink/15 border-y border-ink/15 text-sm" aria-label="What was validated">
            {summary.map((line) => (
              <div key={line.label} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="text-slate">{line.label}</dt>
                <dd className="min-w-0 break-words font-medium">{line.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <Button type="button" tone="light" variant="solid" size="lg" className="mt-6" onClick={onRestart}>
          Start again
        </Button>
      </FormStatus>
    </div>
  );
}
