import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Typography";
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
      <Eyebrow accent="light" className="mb-1">{title}</Eyebrow>
      {children}
    </div>
  );
}

export const DEMO_NOTICE =
  "Demonstration only: your request was validated but not sent or stored. ORVANE is a fictional brand created by VIZAM.";
export const DEMO_NOTICE_BEFORE =
  "Demonstration only: your request will be validated but not sent or stored. ORVANE is a fictional brand created by VIZAM.";
