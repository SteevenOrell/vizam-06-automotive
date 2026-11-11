import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "solid" | "ghost";
/** The surface the button sits on. */
export type ButtonTone = "dark" | "light";

interface StyleProps {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: "md" | "lg";
  className?: string;
}

export function buttonClasses({ variant = "primary", tone = "dark", size = "md", className }: StyleProps = {}): string {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sharp border font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = { md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants: Record<ButtonVariant, Record<ButtonTone, string>> = {
    primary: {
      dark: "border-amber bg-amber text-ink hover:bg-amber-soft hover:border-amber-soft",
      light: "border-amber bg-amber text-ink hover:bg-amber-soft hover:border-amber-soft",
    },
    solid: {
      dark: "border-paper bg-paper text-ink hover:bg-bone hover:border-bone",
      light: "border-ink bg-ink text-paper hover:bg-carbon hover:border-carbon",
    },
    ghost: {
      dark: "border-paper/40 bg-transparent text-paper hover:border-paper hover:bg-paper/10",
      light: "border-ink/40 bg-transparent text-ink hover:border-ink hover:bg-ink/5",
    },
  };
  return cn(base, sizes[size], variants[variant][tone], className);
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function Button({ variant, tone, size, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, tone, size, className })} {...rest} />;
}

type LinkButtonProps = StyleProps & Omit<ComponentProps<typeof Link>, "className"> & { children: ReactNode };

export function LinkButton({ variant, tone, size, className, ...rest }: LinkButtonProps) {
  return <Link className={buttonClasses({ variant, tone, size, className })} {...rest} />;
}
