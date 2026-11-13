"use client";

import { Copy, Printer, RotateCcw, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConceptNote } from "@/components/ui/ConceptNote";
import { getImageSlot } from "@/data/images";
import {
  formatPrice,
  formatSavedAt,
  getPriceBreakdown,
  getStageSlot,
  getSummaryText,
  getSelection,
  type ParsedSaved,
  type StepId,
} from "@/lib/configurator";
import type { ConfigState } from "@/types";

interface SummaryPanelProps {
  config: ConfigState;
  saved: ParsedSaved | null;
  onEdit: (step: StepId) => void;
  onSave: () => boolean;
  onDeleteSaved: () => void;
  onRestart: () => void;
}

function Shot({ slot, label }: { slot: string; label: string }) {
  const s = getImageSlot(slot);
  if (!s?.src) return null;
  return (
    <figure className="min-w-0">
      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width: 1024px) 140px, 30vw" className="aspect-video w-full rounded-sharp bg-carbon object-cover" />
      <figcaption className="mt-1 text-xs text-mist">{label}</figcaption>
    </figure>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function SummaryPanel({ config, saved, onEdit, onSave, onDeleteSaved, onRestart }: SummaryPanelProps) {
  const s = getSelection(config);
  const breakdown = getPriceBreakdown(config);
  const [message, setMessage] = useState("");
  const [manual, setManual] = useState<string | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const isSaved = saved !== null && JSON.stringify(saved.config) === JSON.stringify(config);
  const sp = s.trim.specs;

  const rows: { label: string; value: string; step: StepId }[] = [
    { label: "Model", value: `${s.vehicle.name}, ${s.vehicle.category}`, step: "model" },
    { label: "Variant", value: s.trim.name, step: "trim" },
    { label: "Paint", value: `${s.colour.name}, ${s.colour.finish}`, step: "colour" },
    { label: "Wheels", value: `${s.wheels.name}, ${s.wheels.sizeIn} inch`, step: "wheels" },
    { label: "Interior", value: `${s.interior.name}: ${s.interior.material}`, step: "interior" },
    {
      label: "Packages",
      value: s.packages.length ? s.packages.map((p) => p.option.name + (p.included ? " (included)" : "")).join(", ") : "None selected",
      step: "packages",
    },
  ];

  const copy = async () => {
    const text = getSummaryText(config, saved?.savedAt ? formatSavedAt(saved.savedAt) : null);
    if (await copyText(text)) {
      setManual(null);
      setMessage("Summary copied to the clipboard.");
    } else {
      setManual(text);
      setMessage("Copying is not available here. The summary is selected below so you can copy it yourself.");
    }
  };

  return (
    <div>
      <div id="config-summary" data-print-summary>
        <p className="hidden text-sm print:block">ORVANE concept configuration. Concept data, not an offer.</p>
        <div className="grid grid-cols-3 gap-2">
          <Shot slot={getStageSlot(config, "exterior")} label="Exterior" />
          <Shot slot={getStageSlot(config, "interior")} label="Interior" />
          <Shot slot={getStageSlot(config, "wheel")} label="Wheels" />
        </div>

        <h3 className="mt-6 text-xs uppercase tracking-[0.24em] text-mist">Specification</h3>
        <dl className="mt-2 divide-y divide-graphite border-y border-graphite">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start gap-3 py-2.5">
              <dt className="w-20 shrink-0 text-sm text-mist">{r.label}</dt>
              <dd className="min-w-0 flex-1 text-sm">{r.value}</dd>
              {/* -mt-3 lines the 44px target's label up with the first line of the value. */}
              <dd className="-mt-3 shrink-0 print:hidden">
                <button
                  type="button"
                  onClick={() => onEdit(r.step)}
                  aria-label={`Edit ${r.label.toLowerCase()}`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sharp px-2 text-sm text-amber underline-offset-4 hover:underline"
                >
                  Edit
                </button>
              </dd>
            </div>
          ))}
          <div className="flex items-start gap-3 py-2.5">
            <dt className="w-20 shrink-0 text-sm text-mist">Concept figures</dt>
            <dd className="min-w-0 flex-1 text-sm">
              {sp.powerKw} kW, 0-100 km/h in {sp.zeroToHundredS} s, {sp.rangeKm} km range, {sp.topSpeedKmh} km/h top speed, {sp.batteryKwh} kWh,{" "}
              {sp.drive}
            </dd>
          </div>
        </dl>

        <h3 className="mt-6 text-xs uppercase tracking-[0.24em] text-mist">Concept price breakdown</h3>
        <table className="mt-2 w-full text-sm">
          <caption className="sr-only">Itemised concept price</caption>
          <tbody className="divide-y divide-graphite">
            {breakdown.lines.map((l, i) => (
              <tr key={`${l.key}-${i}`}>
                <th scope="row" className="py-2 pr-3 text-left font-normal">
                  {l.label}
                </th>
                <td className="py-2 text-right tabular-nums">{formatPrice(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-paper/40">
              <th scope="row" className="pt-3 text-left font-display text-base font-semibold">
                Total concept price
              </th>
              <td data-testid="summary-total" className="pt-3 text-right font-display text-base font-semibold tabular-nums">
                {formatPrice(breakdown.total)}
              </td>
            </tr>
          </tfoot>
        </table>
        <ConceptNote className="mt-4" />
      </div>

      <div className="mt-6 grid gap-2 print:hidden">
        <p className="text-sm text-paper/85">
          {isSaved && saved?.savedAt
            ? `Saved on this device, ${formatSavedAt(saved.savedAt)}.`
            : saved
              ? `A different build is saved on this device${saved.savedAt ? ` (${formatSavedAt(saved.savedAt)})` : ""}. Saving replaces it.`
              : "Not saved yet. Saving keeps this build on this device only."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="solid"
            onClick={() => setMessage(onSave() ? "Saved on this device." : "Could not save: browser storage is unavailable.")}
          >
            <Save aria-hidden="true" className="size-4" />
            Save configuration
          </Button>
          <Button variant="ghost" onClick={copy}>
            <Copy aria-hidden="true" className="size-4" />
            Copy summary as text
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer aria-hidden="true" className="size-4" />
            Print
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {saved ? (
            <Button
              variant="ghost"
              onClick={() => {
                onDeleteSaved();
                setMessage("Saved configuration deleted from this device.");
              }}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Delete saved configuration
            </Button>
          ) : null}
          <Button variant="ghost" onClick={() => setConfirmRestart(true)}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Restart
          </Button>
        </div>

        {confirmRestart ? (
          <div role="group" aria-label="Confirm restart" className="rounded-sharp border border-amber bg-amber/10 p-4">
            <p className="text-sm leading-relaxed">Restart? Every choice returns to {s.vehicle.name} defaults. A saved configuration is not affected.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setConfirmRestart(false);
                  setMessage("Configuration restarted.");
                  onRestart();
                }}
              >
                Yes, restart
              </Button>
              <Button variant="ghost" onClick={() => setConfirmRestart(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <p role="status" className="min-h-5 text-sm text-amber">
          {message}
        </p>
        {manual ? (
          <textarea
            readOnly
            aria-label="Summary text to copy"
            value={manual}
            rows={8}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-sharp border border-graphite bg-ink p-3 text-xs"
          />
        ) : null}
      </div>
    </div>
  );
}
