"use client";

import { useState } from "react";
import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/Button";
import { vehicles } from "@/data/vehicles";
import { CONTACT_FIELDS, validateContact, type FormValues } from "@/lib/demo-forms";
import { CONTACT_TOPICS, CONTACT_TOPIC_LABELS } from "@/lib/schemas";
import { DemoSuccess } from "./DemoSuccess";
import { ErrorSummary } from "./ErrorSummary";
import { Checkbox, Field, Honeypot, Select, TextInput, Textarea } from "./Field";
import { DEMO_NOTICE_BEFORE, FormStatus } from "./FormStatus";
import { useDemoForm } from "./useDemoForm";

const ORDER = ["name", "email", "topic", "model", "message", "consent"] as const;
const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  topic: "Topic",
  model: "Model of interest",
  message: "Message",
  consent: "Demonstration acknowledgement",
};
const idFor = (field: string) => `ct-${field}`;

const validate = (values: FormValues) => {
  const result = validateContact(values);
  return result.ok ? {} : result.fieldErrors;
};

function ContactFormBody({ focusOnMount, onRestart }: { focusOnMount: boolean; onRestart: () => void }) {
  const { state, formAction, pending, errors, summaryErrors, summaryRef, onSubmit, onBlur, onChange } = useDemoForm({
    action: submitContact,
    validate,
    fields: CONTACT_FIELDS,
  });
  const kept: FormValues = state.status === "error" ? state.values : {};
  const dv = (field: string) => kept[field] ?? "";

  if (state.status === "success") return <DemoSuccess summary={state.summary} onRestart={onRestart} />;

  return (
    <form action={formAction} onSubmit={onSubmit} onBlur={onBlur} onChange={onChange} noValidate aria-label="Request information" className="relative flex flex-col gap-6">
      <ErrorSummary errors={summaryErrors} order={ORDER} labels={LABELS} idFor={idFor} headingRef={summaryRef} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={idFor("name")} label="Name" required error={errors.name}>
          {(p) => <TextInput {...p} name="name" type="text" autoComplete="name" defaultValue={dv("name")} autoFocus={focusOnMount} maxLength={200} />}
        </Field>
        <Field id={idFor("email")} label="Email" required error={errors.email}>
          {(p) => <TextInput {...p} name="email" type="email" inputMode="email" autoComplete="email" defaultValue={dv("email")} maxLength={400} />}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={idFor("topic")} label="Topic" required error={errors.topic}>
          {(p) => (
            <Select {...p} name="topic" defaultValue={dv("topic")}>
              <option value="">Choose a topic</option>
              {CONTACT_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {CONTACT_TOPIC_LABELS[t]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id={idFor("model")} label="Model of interest" error={errors.model}>
          {(p) => (
            <Select {...p} name="model" defaultValue={dv("model")}>
              <option value="">No specific model</option>
              {vehicles.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.name} ({v.category})
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field id={idFor("message")} label="Message" required error={errors.message} hint="At least 20 characters, up to 2000.">
        {(p) => <Textarea {...p} name="message" rows={6} autoComplete="off" defaultValue={dv("message")} maxLength={2200} />}
      </Field>

      <Checkbox
        id={idFor("consent")}
        name="consent"
        defaultChecked={kept.consent === "on"}
        label="I understand this is a demonstration and nothing is sent"
        error={errors.consent}
      />

      <Honeypot />

      <FormStatus tone="notice" title="Before you submit">
        {DEMO_NOTICE_BEFORE}
      </FormStatus>

      <div>
        <Button type="submit" tone="light" variant="solid" size="lg" disabled={pending}>
          {pending ? "Validating..." : "Send request"}
        </Button>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [run, setRun] = useState(0);
  return <ContactFormBody key={run} focusOnMount={run > 0} onRestart={() => setRun((n) => n + 1)} />;
}
