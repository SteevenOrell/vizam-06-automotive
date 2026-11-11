"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { CONFIG_STEPS, type StepId } from "@/lib/configurator";
import { cn } from "@/lib/cn";

interface StepNavProps {
  step: StepId;
  visited: ReadonlySet<StepId>;
  onStep: (id: StepId) => void;
}

/** Numbered stepper. Every step is a real button; the current one carries aria-current="step". Scrolls sideways inside itself on small screens. */
export function StepNav({ step, visited, onStep }: StepNavProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
  }, [step]);

  return (
    <nav aria-label="Configuration steps" className="min-w-0">
      <ol className="flex min-w-0 gap-1 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]">
        {CONFIG_STEPS.map((s, i) => {
          const active = s.id === step;
          const done = !active && visited.has(s.id);
          return (
            <li key={s.id} className="shrink-0">
              <button
                ref={active ? activeRef : undefined}
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => onStep(s.id)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors duration-300",
                  active ? "border-paper bg-paper text-ink" : "border-transparent text-paper/85 hover:border-graphite hover:text-paper",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                    active ? "bg-ink text-paper" : done ? "bg-amber text-ink" : "border border-mist text-paper/85",
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {s.label}
                {done ? <span className="sr-only">(completed)</span> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
