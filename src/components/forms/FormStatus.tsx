import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FormStatusProps {
  tone: "notice" | "success";
  title: string;
  children: ReactNode;
  className?: string;
  /** Live-region role; success panels use "status". */
  role?: "status";
  id?: string;
}

/** Labelled notice or result panel. The demonstration wording always uses this so it reads the same everywhere. */
export function FormStatus({ tone, title, children, className, role, id }: FormStatusProps) {
  return (
    <div
      id={id}
      role={role}
      className={cn(
        "rounded-sharp border p-5 text-sm leading-relaxed",
        tone === "success" ? "border-ink bg-white text-ink" : "border-ink/25 bg-bone text-ink",
        className,
      )}
    >
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-ink">{title}</p>
      {children}
    </div>
  );
}

export const DEMO_NOTICE =
  "Demonstration only: your request was validated but not sent or stored. ORVANE is a fictional brand created by VIZAM.";
export const DEMO_NOTICE_BEFORE =
  "Demonstration only: your request will be validated but not sent or stored. ORVANE is a fictional brand created by VIZAM.";
