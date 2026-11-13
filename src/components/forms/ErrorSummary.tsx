"use client";

import type { Ref } from "react";
import { ERROR_TEXT } from "./Field";

interface ErrorSummaryProps {
  errors: Record<string, string>;
  /** Field names in page order. */
  order: readonly string[];
  /** Human labels for the links. */
  labels: Record<string, string>;
  /** Builds the control id for a field name. */
  idFor: (field: string) => string;
  headingRef: Ref<HTMLDivElement>;
}

/** Shown after a failed submit and focused, so keyboard and screen reader users land on the list of problems. */
export function ErrorSummary({ errors, order, labels, idFor, headingRef }: ErrorSummaryProps) {
  const fields = order.filter((f) => errors[f]);
  if (fields.length === 0) return null;
  return (
    <div
      ref={headingRef}
      tabIndex={-1}
      role="alert"
      aria-labelledby="form-errors-title"
      className="rounded-sharp border-2 border-[#a4201a] bg-white p-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <h2 id="form-errors-title" className={`font-display text-lg font-semibold ${ERROR_TEXT}`}>
        There {fields.length === 1 ? "is 1 problem" : `are ${fields.length} problems`} with your request
      </h2>
      <ul className="mt-3 space-y-1">
        {fields.map((field) => (
          <li key={field}>
            <a
              href={`#${idFor(field)}`}
              onClick={(e) => {
                const target = document.getElementById(idFor(field));
                if (target) {
                  e.preventDefault();
                  target.focus();
                }
              }}
              className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
            >
              {labels[field] ?? field}: {errors[field]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
