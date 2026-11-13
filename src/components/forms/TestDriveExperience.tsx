"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { isVehicleSlug } from "@/data/vehicles";
import { TestDriveForm } from "./TestDriveForm";

/** Owns the form instance so "Start again" remounts it with a clean state. */
function Instance({ initialModel }: { initialModel: string }) {
  const [run, setRun] = useState(0);
  return <TestDriveForm key={run} initialModel={initialModel} focusOnMount={run > 0} onRestart={() => setRun((n) => n + 1)} />;
}

function WithPreselection() {
  const model = useSearchParams().get("model");
  return <Instance initialModel={isVehicleSlug(model) ? model : ""} />;
}

/**
 * `?model=<slug>` preselects the vehicle. The page stays fully static: the prerendered fallback is the same form without a
 * preselection (so it also works without JavaScript) and the query is read in the browser. The query is only ever read, never written.
 */
export function TestDriveExperience() {
  return (
    <Suspense fallback={<Instance initialModel="" />}>
      <WithPreselection />
    </Suspense>
  );
}
