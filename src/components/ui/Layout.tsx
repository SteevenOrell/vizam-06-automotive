import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SurfaceTone = "ink" | "carbon" | "paper" | "bone";

const toneClasses: Record<SurfaceTone, string> = {
  ink: "bg-ink text-paper",
  carbon: "bg-carbon text-paper",
  paper: "bg-paper text-ink",
  bone: "bg-bone text-ink",
};

export function isDarkTone(tone: SurfaceTone): boolean {
  return tone === "ink" || tone === "carbon";
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/** Max 1440px wide content column with responsive gutters. */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16", className)}>{children}</Tag>;
}

interface SectionProps {
  children: ReactNode;
  tone?: SurfaceTone;
  className?: string;
  /** Section padding: default is 64px phone / 96px tablet / 160px desktop. */
  spacing?: "default" | "compact" | "none";
  id?: string;
  "aria-labelledby"?: string;
}

export function Section({ children, tone = "ink", className, spacing = "default", ...rest }: SectionProps) {
  const pad = {
    default: "py-16 md:py-24 xl:py-40",
    compact: "py-14 md:py-20",
    none: "",
  }[spacing];
  return (
    <section data-tone={tone} className={cn(toneClasses[tone], pad, className)} {...rest}>
      {children}
    </section>
  );
}
