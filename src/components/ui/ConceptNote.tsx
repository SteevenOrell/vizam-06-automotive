import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { CONCEPT_DATA_NOTE } from "@/data/vehicles";
import { cn } from "@/lib/cn";

interface ConceptNoteProps {
  children?: ReactNode;
  className?: string;
}

/** Small disclaimer line for any block showing specs, ranges or prices. */
export function ConceptNote({ children = CONCEPT_DATA_NOTE, className }: ConceptNoteProps) {
  return (
    <p className={cn("flex items-start gap-2 text-xs leading-relaxed opacity-80", className)}>
      <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
