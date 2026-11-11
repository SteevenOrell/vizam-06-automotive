import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Error text colour with AA contrast on paper and bone surfaces. */
export const ERROR_TEXT = "text-[#a4201a]";

const control =
  "block min-h-11 w-full [color-scheme:light] rounded-sharp border border-ink/45 bg-white px-3.5 py-2.5 text-base text-ink transition-colors duration-200 placeholder:text-slate hover:border-ink focus-visible:border-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-[#a4201a]";

export interface ControlProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  required?: boolean;
}

interface FieldProps {
  id: string;
  label: string;
  /** Marked "required" in text, not only by colour; optional fields say "optional". */
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}

/** Label, hint, control and error message wired together with for / aria-describedby / aria-invalid. */
export function Field({ id, label, required = false, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-ink">
        {label}
        <span className="text-xs font-normal text-slate">{required ? "(required)" : "(optional)"}</span>
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, required })}
      {hint ? (
        <p id={hintId} className="text-sm leading-snug text-slate">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={cn("text-sm font-medium leading-snug", ERROR_TEXT)}>
          <span className="sr-only">Error: </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement> & ControlProps) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & ControlProps) {
  return <textarea className={cn(control, "min-h-32 resize-y leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & ControlProps) {
  return (
    <div className="relative">
      <select className={cn(control, "appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink" />
    </div>
  );
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  className?: string;
}

/** Native checkbox in a 44px-tall label row. */
export function Checkbox({ id, label, hint, error, className, ...props }: CheckboxProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="mt-[0.7rem] size-5 shrink-0 cursor-pointer rounded-sharp accent-[#a8541a] [color-scheme:light]"
          {...props}
        />
        <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center text-sm leading-snug text-ink">
          <span>{label}</span>
        </label>
      </div>
      {hint ? (
        <p id={hintId} className="pl-8 text-sm leading-snug text-slate">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={cn("pl-8 text-sm font-medium", ERROR_TEXT)}>
          <span className="sr-only">Error: </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden spam trap: out of sight and out of the tab order, not display:none so simple bots still fill it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website-field">Leave this field empty</label>
      <input id="website-field" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
