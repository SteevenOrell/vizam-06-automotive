import type { ReactNode } from "react";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

interface SectionIntroProps {
  eyebrow: string;
  title: ReactNode;
  id: string;
  text?: ReactNode;
  /** Surface the block sits on. */
  light?: boolean;
  className?: string;
}

/** Eyebrow, h2 and lead paragraph shared by the editorial sections. */
export function SectionIntro({ eyebrow, title, id, text, light = false, className }: SectionIntroProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Eyebrow accent={light ? "light" : "dark"} className="mb-5">
        {eyebrow}
      </Eyebrow>
      <Heading id={id} level={2} size="xl">
        {title}
      </Heading>
      {text ? <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed", light ? "text-slate" : "text-paper/80")}>{text}</p> : null}
    </div>
  );
}
