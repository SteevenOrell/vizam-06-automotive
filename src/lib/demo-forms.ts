import type { z } from "zod";
import { getVehicle } from "@/data/vehicles";
import type { ConfigState } from "@/types";
import { formatPrice, getSelection, getTotalPrice, isValidConfig } from "./configurator";
import { CONTACT_TOPIC_LABELS, contactSchema, createTestDriveSchema, type ContactTopic } from "./schemas";

/**
 * Demonstration form logic shared by the browser (inline messages) and the Server Actions (the real check).
 * Nothing here sends, stores or logs anything: a valid request only produces a summary of what was validated.
 */

export type FieldErrors = Record<string, string>;
export type FormValues = Record<string, string>;
export interface SummaryLine {
  label: string;
  value: string;
}

export type FormResult =
  | { status: "idle" }
  | { status: "error"; fieldErrors: FieldErrors; values: FormValues }
  | { status: "success"; summary: SummaryLine[] };

export const IDLE_RESULT: FormResult = { status: "idle" };

export const TEST_DRIVE_FIELDS = ["name", "email", "phone", "model", "preferredDate", "preferredLocation", "message", "attachedConfig", "website"] as const;
export const CONTACT_FIELDS = ["name", "email", "topic", "model", "message", "consent", "website"] as const;

/** No value of any field may exceed this; longer input is cut before it is processed or echoed back. */
const HARD_VALUE_LIMIT = 5000;
/** One day of slack so a visitor ahead of the server's time zone can still pick "today". */
const SERVER_DATE_SLACK_MS = 24 * 60 * 60 * 1000;

/** Read only the named text fields from FormData (files and unknown fields are ignored). */
export function readFormValues(data: FormData, fields: readonly string[]): FormValues {
  const out: FormValues = {};
  for (const field of fields) {
    const value = data.get(field);
    out[field] = typeof value === "string" ? value.slice(0, HARD_VALUE_LIMIT) : "";
  }
  return out;
}

/** First message per field, keyed by the top-level field name. */
export function toFieldErrors(issues: z.core.$ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) errors[key] = key === "attachedConfig" ? "The saved configuration could not be read. Untick it and try again." : issue.message;
  }
  return errors;
}

const blankToUndefined = (v: string | undefined) => (v === undefined || v === "" ? undefined : v);

function parseAttachedConfig(raw: string): { ok: true; config: ConfigState | undefined } | { ok: false } {
  if (!raw) return { ok: true, config: undefined };
  if (raw.length > 1500) return { ok: false };
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidConfig(parsed) ? { ok: true, config: parsed } : { ok: false };
  } catch {
    return { ok: false };
  }
}

export function describeConfig(config: ConfigState): string {
  const s = getSelection(config);
  return `ORVANE ${s.vehicle.name}, ${s.trim.name}, ${s.colour.name}, ${s.wheels.name}, ${s.interior.name}, ${formatPrice(getTotalPrice(config))} (concept price)`;
}

export type Validated<T> = { ok: true; data: T } | { ok: false; fieldErrors: FieldErrors };

export function validateTestDrive(values: FormValues, now: Date = new Date()): Validated<z.infer<ReturnType<typeof createTestDriveSchema>>> {
  const attached = parseAttachedConfig(values.attachedConfig ?? "");
  const result = createTestDriveSchema(now).safeParse({
    name: values.name,
    email: values.email,
    phone: blankToUndefined(values.phone),
    model: values.model,
    preferredDate: values.preferredDate,
    preferredLocation: values.preferredLocation,
    message: blankToUndefined(values.message),
    attachedConfig: attached.ok ? attached.config : undefined,
    website: values.website || undefined,
  });
  const fieldErrors = result.success ? {} : toFieldErrors(result.error.issues);
  if (!attached.ok) fieldErrors.attachedConfig = "The saved configuration could not be read. Untick it and try again.";
  if (Object.keys(fieldErrors).length > 0 || !result.success) return { ok: false, fieldErrors };
  return { ok: true, data: result.data };
}

export function validateContact(values: FormValues): Validated<z.infer<typeof contactSchema>> {
  const result = contactSchema.safeParse({
    name: values.name,
    email: values.email,
    topic: values.topic,
    model: blankToUndefined(values.model),
    message: values.message,
    consent: values.consent === "on",
    website: values.website || undefined,
  });
  return result.success ? { ok: true, data: result.data } : { ok: false, fieldErrors: toFieldErrors(result.error.issues) };
}

/** Server-side test-drive check. Honeypot hits get the same generic success with no detail. */
export function processTestDrive(data: FormData, now: Date = new Date()): FormResult {
  const values = readFormValues(data, TEST_DRIVE_FIELDS);
  if (values.website) return { status: "success", summary: [] };
  const checked = validateTestDrive(values, new Date(now.getTime() - SERVER_DATE_SLACK_MS));
  if (!checked.ok) return { status: "error", fieldErrors: checked.fieldErrors, values };
  const d = checked.data;
  const summary: SummaryLine[] = [
    { label: "Name", value: d.name },
    { label: "Email", value: d.email },
    { label: "Phone", value: d.phone ? d.phone : "Not provided" },
    { label: "Vehicle", value: `ORVANE ${getVehicle(d.model)?.name ?? d.model}` },
    { label: "Preferred date", value: d.preferredDate },
    { label: "Preferred location", value: d.preferredLocation },
    { label: "Message", value: d.message ? `${d.message.length} characters` : "None" },
    { label: "Saved configuration", value: d.attachedConfig ? describeConfig(d.attachedConfig) : "Not attached" },
  ];
  return { status: "success", summary };
}

/** Server-side contact check. */
export function processContact(data: FormData): FormResult {
  const values = readFormValues(data, CONTACT_FIELDS);
  if (values.website) return { status: "success", summary: [] };
  const checked = validateContact(values);
  if (!checked.ok) return { status: "error", fieldErrors: checked.fieldErrors, values };
  const d = checked.data;
  const summary: SummaryLine[] = [
    { label: "Name", value: d.name },
    { label: "Email", value: d.email },
    { label: "Topic", value: CONTACT_TOPIC_LABELS[d.topic as ContactTopic] },
    { label: "Model of interest", value: d.model ? `ORVANE ${getVehicle(d.model)?.name ?? d.model}` : "None" },
    { label: "Message", value: `${d.message.length} characters` },
    { label: "Acknowledged demonstration", value: d.consent ? "Yes" : "Not ticked" },
  ];
  return { status: "success", summary };
}
