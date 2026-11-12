import { z } from "zod";
import { VEHICLE_SLUGS } from "@/data/vehicles";

// No JIT: Zod otherwise probes `new Function` once, which our CSP (no 'unsafe-eval') reports as a violation in the
// browser even though Zod catches it. These schemas are small, so the interpreted path costs nothing noticeable.
z.config({ jitless: true });

/** Configurator state saved to localStorage. Option ids are checked against the model in configurator.ts. */
export const configStateSchema = z.object({
  version: z.literal(1),
  model: z.enum(VEHICLE_SLUGS),
  trim: z.string().min(1).max(64),
  colour: z.string().min(1).max(64),
  wheels: z.string().min(1).max(64),
  interior: z.string().min(1).max(64),
  packages: z.array(z.string().min(1).max(64)).max(10),
});

const PHONE_PATTERN = /^\+?[0-9 ().-]{7,20}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Booking window: how far ahead a test drive can be requested (about six months). */
export const MAX_DAYS_AHEAD = 183;

/** Single-line fields reject every control character (including line breaks)... */
const CONTROL_SINGLE_LINE = /[\u0000-\u001F\u007F]/;
/** ...multi-line fields reject all of them except tab, line feed and carriage return. */
const CONTROL_MULTI_LINE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const NO_CONTROL = { error: "Please remove control characters." };

/** Today's date as YYYY-MM-DD in the visitor's local time zone. */
export function todayIsoDate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Local date `days` days after `now`, as YYYY-MM-DD. */
export function isoDateAfter(now: Date, days: number): string {
  const copy = new Date(now.getTime());
  copy.setDate(copy.getDate() + days);
  return todayIsoDate(copy);
}

function isRealDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

const name = z
  .string()
  .trim()
  .min(2, { error: "Please enter your name." })
  .max(80, { error: "Please keep your name under 80 characters." })
  .refine((v) => !CONTROL_SINGLE_LINE.test(v), NO_CONTROL);

const email = z.string().trim().max(160, { error: "Please keep your email under 160 characters." }).pipe(z.email({ error: "Please enter a valid email address." }));

/** Hidden honeypot field. Real visitors leave it empty. */
const honeypot = z.string().max(0).optional();

const optionalPhone = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || PHONE_PATTERN.test(v), { error: "Please enter a valid phone number or leave it empty." });

/** Build the test-drive schema relative to a reference date (defaults to now) so tests are deterministic. */
export function createTestDriveSchema(now: Date = new Date()) {
  const today = todayIsoDate(now);
  const latest = isoDateAfter(now, MAX_DAYS_AHEAD);
  return z.object({
    name,
    email,
    phone: optionalPhone,
    model: z.enum(VEHICLE_SLUGS, { error: "Please choose a model." }),
    preferredDate: z
      .string()
      .trim()
      .refine(isRealDate, { error: "Please choose a date." })
      .refine((v) => v >= today, { error: "Please choose today or a later date." })
      .refine((v) => v <= latest, { error: "Please choose a date within the next six months." }),
    preferredLocation: z
      .string()
      .trim()
      .min(2, { error: "Please enter a city or region." })
      .max(80, { error: "Please keep the location under 80 characters." })
      .refine((v) => !CONTROL_SINGLE_LINE.test(v), NO_CONTROL),
    message: z
      .string()
      .trim()
      .max(1000, { error: "Please keep your message under 1000 characters." })
      .refine((v) => !CONTROL_MULTI_LINE.test(v), NO_CONTROL)
      .optional(),
    /** Saved configuration the visitor chose to attach (opt-in). Option ids are checked separately with isValidConfig. */
    attachedConfig: configStateSchema.optional(),
    website: honeypot,
  });
}

export const testDriveSchema = createTestDriveSchema();
export type TestDriveInput = z.infer<ReturnType<typeof createTestDriveSchema>>;

export const CONTACT_TOPICS = ["vehicle", "configurator", "press", "partnership", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  vehicle: "Vehicle information",
  configurator: "Configurator",
  press: "Press & media",
  partnership: "Partnership",
  other: "Other",
};

export const contactSchema = z.object({
  name,
  email,
  topic: z.enum(CONTACT_TOPICS, { error: "Please choose a topic." }),
  model: z.enum(VEHICLE_SLUGS, { error: "Please choose a model from the list." }).optional(),
  message: z
    .string()
    .trim()
    .min(20, { error: "Please write at least 20 characters." })
    .max(2000, { error: "Please keep your message under 2000 characters." })
    .refine((v) => !CONTROL_MULTI_LINE.test(v), NO_CONTROL),
  /** Optional acknowledgement that this is a demonstration. */
  consent: z.boolean().optional(),
  website: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
