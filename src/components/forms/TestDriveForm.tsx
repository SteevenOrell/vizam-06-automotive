"use client";

import { useState, useSyncExternalStore } from "react";
import { submitTestDrive } from "@/app/test-drive/actions";
import { useSavedConfig } from "@/components/configurator/savedStore";
import { Button } from "@/components/ui/Button";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { vehicles } from "@/data/vehicles";
import { describeConfig, TEST_DRIVE_FIELDS, validateTestDrive, type FormValues } from "@/lib/demo-forms";
import { isoDateAfter, MAX_DAYS_AHEAD, todayIsoDate } from "@/lib/schemas";
import { DemoSuccess } from "./DemoSuccess";
import { ErrorSummary } from "./ErrorSummary";
import { Checkbox, Field, Honeypot, Select, TextInput, Textarea } from "./Field";
import { DEMO_NOTICE_BEFORE, FormStatus } from "./FormStatus";
import { useDemoForm } from "./useDemoForm";

const ORDER = ["name", "email", "phone", "model", "preferredDate", "preferredLocation", "message", "attachedConfig"] as const;
const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  model: "Vehicle model",
  preferredDate: "Preferred date",
  preferredLocation: "Preferred location",
  message: "Message",
  attachedConfig: "Saved configuration",
};
const idFor = (field: string) => `td-${field}`;

const validate = (values: FormValues) => {
  const result = validateTestDrive(values, new Date());
  return result.ok ? {} : result.fieldErrors;
};

const noopSubscribe = () => () => {};
/** The visitor's local date, or "" on the server and during hydration (so the markup never mismatches). */
const useLocalDate = (offsetDays: number) =>
  useSyncExternalStore(
    noopSubscribe,
    () => (offsetDays === 0 ? todayIsoDate(new Date()) : isoDateAfter(new Date(), offsetDays)),
    () => "",
  );

interface Props {
  initialModel: string;
  /** Moves focus to the first field (used after "Start again"). */
  focusOnMount?: boolean;
  onRestart: () => void;
}

export function TestDriveForm({ initialModel, focusOnMount = false, onRestart }: Props) {
  const { state, formAction, pending, errors, summaryErrors, summaryRef, onSubmit, onBlur, onChange } = useDemoForm({
    action: submitTestDrive,
    validate,
    fields: TEST_DRIVE_FIELDS,
  });
  const { saved } = useSavedConfig();
  const [model, setModel] = useState(initialModel);
  const [attach, setAttach] = useState(false);
  const min = useLocalDate(0);
  const max = useLocalDate(MAX_DAYS_AHEAD - 3);

  // After a server rejection the submitted text is put back (React resets uncontrolled fields after an action).
  const kept: FormValues = state.status === "error" ? state.values : {};
  const dv = (field: string) => kept[field] ?? "";

  const imageSlot = model ? `${model}-view-front` : "hero-home-desktop";
  const modelName = vehicles.find((v) => v.slug === model)?.name;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      <div>
        {state.status === "success" ? (
          <DemoSuccess summary={state.summary} onRestart={onRestart} />
        ) : (
          <form action={formAction} onSubmit={onSubmit} onBlur={onBlur} onChange={onChange} noValidate aria-label="Test drive request" className="relative flex flex-col gap-6">
            <ErrorSummary errors={summaryErrors} order={ORDER} labels={LABELS} idFor={idFor} headingRef={summaryRef} />

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id={idFor("name")} label="Name" required error={errors.name}>
                {(p) => <TextInput {...p} name="name" type="text" autoComplete="name" defaultValue={dv("name")} autoFocus={focusOnMount} maxLength={200} />}
              </Field>
              <Field id={idFor("email")} label="Email" required error={errors.email}>
                {(p) => <TextInput {...p} name="email" type="email" inputMode="email" autoComplete="email" defaultValue={dv("email")} maxLength={400} />}
              </Field>
            </div>

            <Field id={idFor("phone")} label="Phone" error={errors.phone} hint="Optional. Digits, spaces and + ( ) . - only.">
              {(p) => <TextInput {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={dv("phone")} maxLength={60} />}
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id={idFor("model")} label="Vehicle model" required error={errors.model}>
                {(p) => (
                  <Select {...p} name="model" value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="">Choose a model</option>
                    {vehicles.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field id={idFor("preferredDate")} label="Preferred date" required error={errors.preferredDate} hint="Today or later, within the next six months.">
                {(p) => <TextInput {...p} name="preferredDate" type="date" autoComplete="off" min={min || undefined} max={max || undefined} defaultValue={dv("preferredDate")} />}
              </Field>
            </div>

            <Field
              id={idFor("preferredLocation")}
              label="Preferred location"
              required
              error={errors.preferredLocation}
              hint="A city or region, in your own words. ORVANE is a concept with no real locations, so there are no dealerships to choose from."
            >
              {(p) => <TextInput {...p} name="preferredLocation" type="text" autoComplete="address-level2" defaultValue={dv("preferredLocation")} maxLength={200} />}
            </Field>

            <Field id={idFor("message")} label="Message" error={errors.message} hint="Anything we should know. Up to 1000 characters.">
              {(p) => <Textarea {...p} name="message" rows={4} autoComplete="off" defaultValue={dv("message")} maxLength={1200} />}
            </Field>

            {saved ? (
              <div className="rounded-sharp border border-ink/25 bg-bone p-4">
                <Checkbox
                  id={idFor("attach")}
                  checked={attach}
                  onChange={(e) => setAttach(e.target.checked)}
                  label="Attach my saved configuration"
                  hint={
                    <>
                      <span data-testid="saved-summary">{describeConfig(saved.config)}</span>. Saved on this device by the configurator and read in your browser only.
                    </>
                  }
                  error={errors.attachedConfig}
                />
                {attach ? <input type="hidden" name="attachedConfig" value={JSON.stringify(saved.config)} /> : null}
              </div>
            ) : null}

            <Honeypot />

            <FormStatus tone="notice" title="Before you submit">
              {DEMO_NOTICE_BEFORE}
            </FormStatus>

            <div>
              <Button type="submit" tone="light" variant="solid" size="lg" disabled={pending}>
                {pending ? "Validating..." : "Request a test drive"}
              </Button>
            </div>
          </form>
        )}
      </div>

      <aside aria-label="Selected model" className="lg:sticky lg:top-28 lg:self-start">
        <figure className="overflow-hidden rounded-sharp bg-ink text-paper">
          <VehicleImage slot={imageSlot} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[16/10]" />
          <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
            <span className="font-display text-base font-semibold [font-stretch:112%]">{modelName ? `ORVANE ${modelName}` : "ORVANE"}</span>
            <span className="text-mist">{model ? "Concept model" : "Choose a model to preview it"}</span>
          </figcaption>
        </figure>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          A real request would reach a person who arranges the drive. Here the form is checked in your browser and again on the server, and then stops: nothing is delivered.
        </p>
      </aside>
    </div>
  );
}
