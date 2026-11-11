import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface OptionCardProps {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  /** Hover/focus hook, used to preload the image this option will show. */
  onPreview?: () => void;
  children: ReactNode;
  className?: string;
}

/** A native radio or checkbox dressed as a card. The input stays focusable; focus and selection are drawn on the card. */
export function OptionCard({ type, name, value, checked, disabled, onChange, onPreview, children, className }: OptionCardProps) {
  return (
    <label className={cn("relative block", disabled && !checked ? "cursor-not-allowed" : "cursor-pointer", className)} onPointerEnter={onPreview}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onFocus={onPreview}
        className="peer sr-only"
      />
      <span
        className={cn(
          "block h-full rounded-sharp border border-graphite bg-ink/40 p-3.5 transition-colors duration-300",
          "hover:border-mist peer-checked:border-amber peer-checked:bg-amber/10",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber",
          "peer-disabled:text-paper/70 peer-disabled:hover:border-graphite peer-disabled:peer-checked:hover:border-amber",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 hidden size-5 items-center justify-center rounded-full bg-amber text-ink peer-checked:flex"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </label>
  );
}
