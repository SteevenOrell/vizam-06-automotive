import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  /** Element to render; use h3 etc. when the label is a real subheading. */
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  /** Use the amber accent (on dark surfaces) or the darker amber (on light). */
  accent?: "dark" | "light" | "none";
}

export function Eyebrow({ children, className, accent = "none", as: Tag = "p" }: EyebrowProps) {
  const colour = { dark: "text-amber", light: "text-amber-ink", none: "opacity-75" }[accent];
  return <Tag className={cn("text-xs font-medium uppercase tracking-[0.24em]", colour, className)}>{children}</Tag>;
}

type Level = 1 | 2 | 3 | 4;
type Size = "display" | "xl" | "lg" | "md" | "sm";

interface HeadingProps {
  children: ReactNode;
  level?: Level;
  /** Visual size, independent of the semantic level. */
  size?: Size;
  className?: string;
  id?: string;
}

const sizeClasses: Record<Size, string> = {
  display: "font-display text-[clamp(2.75rem,9vw,8.5rem)] font-semibold uppercase leading-[0.92] tracking-[0.02em] [font-stretch:125%]",
  xl: "font-display text-[clamp(2.25rem,5.5vw,4.75rem)] font-semibold leading-[1] tracking-[-0.01em] [font-stretch:112%]",
  lg: "font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.08] [font-stretch:112%]",
  md: "font-display text-2xl font-semibold leading-tight md:text-3xl",
  sm: "font-display text-lg font-semibold leading-snug md:text-xl",
};

const defaultSize: Record<Level, Size> = { 1: "xl", 2: "lg", 3: "md", 4: "sm" };

export function Heading({ children, level = 2, size, className, id }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={cn(sizeClasses[size ?? defaultSize[level]], "text-balance", className)}>
      {children}
    </Tag>
  );
}

/** Two-tone headline: muted lead-in, solid ending (reference 03). */
export function TwoTone({ muted, strong }: { muted: ReactNode; strong: ReactNode }) {
  return (
    <>
      <span className="opacity-60">{muted}</span> <span>{strong}</span>
    </>
  );
}
