"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { IDLE_RESULT, readFormValues, type FieldErrors, type FormResult, type FormValues } from "@/lib/demo-forms";

interface Options {
  action: (previous: FormResult, formData: FormData) => Promise<FormResult>;
  /** Same schema the server uses; returns messages keyed by field name. */
  validate: (values: FormValues) => FieldErrors;
  fields: readonly string[];
}

/**
 * Client side of the demonstration forms: inline messages on blur and on submit (Zod), an error summary that takes
 * focus on a failed submit, and the Server Action (which validates again) for the actual submission.
 * Without JavaScript the form still posts to the Server Action and the same errors come back from the server.
 *
 * Inline messages follow the fields live; the summary only changes on submit so the layout does not jump under the
 * pointer while the visitor is fixing things.
 */
export function useDemoForm({ action, validate, fields }: Options) {
  const [state, formAction, pending] = useActionState(action, IDLE_RESULT);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const [submitErrors, setSubmitErrors] = useState<FieldErrors | null>(null);
  const [failedSubmits, setFailedSubmits] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  const serverErrors: FieldErrors = state.status === "error" ? state.fieldErrors : {};
  const errors = clientErrors ?? serverErrors;
  const summaryErrors = submitErrors ?? serverErrors;

  // Focus the summary after a failed client submit or a server rejection.
  useEffect(() => {
    if (failedSubmits > 0 || state.status === "error") summaryRef.current?.focus();
  }, [failedSubmits, state]);

  const readValues = (form: HTMLFormElement) => readFormValues(new FormData(form), fields);
  /** The honeypot is never a visitor-facing error: the server answers a filled trap with a generic success. */
  const check = (values: FormValues): FieldErrors => {
    const found = validate(values);
    delete found.website;
    return found;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const values = readValues(event.currentTarget);
    const found = values.website ? {} : check(values);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      setClientErrors(found);
      setSubmitErrors(found);
      setFailedSubmits((n) => n + 1);
    } else {
      setClientErrors(null);
      setSubmitErrors(null);
    }
  };

  const fieldName = (target: EventTarget): string | null => {
    const name = (target as HTMLElement & { name?: string }).name;
    return name && fields.includes(name) && name !== "website" ? name : null;
  };

  /** Leaving a field adds its message; it never removes one, so nothing moves under a click that is just landing. */
  const onBlur = (event: FocusEvent<HTMLFormElement>) => {
    const field = fieldName(event.target);
    if (!field) return;
    const found = check(readValues(event.currentTarget));
    if (!found[field]) return;
    setClientErrors((previous) => ({ ...(previous ?? serverErrors), [field]: found[field] }));
  };

  /** Editing a field that shows a message re-checks it live, so the message goes as soon as it is fixed. */
  const onChange = (event: ChangeEvent<HTMLFormElement>) => {
    const field = fieldName(event.target);
    if (!field || !errors[field]) return;
    const found = check(readValues(event.currentTarget));
    setClientErrors((previous) => {
      const next = { ...(previous ?? serverErrors) };
      if (found[field]) next[field] = found[field];
      else delete next[field];
      return next;
    });
  };

  return { state, formAction, pending, errors, summaryErrors, summaryRef, onSubmit, onBlur, onChange };
}
