"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CONFIG_STORAGE_KEY, parseSaved, serializeSaved, type ParsedSaved } from "@/lib/configurator";
import type { ConfigState } from "@/types";

const EVENT = "orvane:saved-config";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(): string | null {
  try {
    return window.localStorage.getItem(CONFIG_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * The configuration saved on this device. `null` on the server and during hydration, then the stored value.
 * Corrupt data is reported as `corrupt` and cleaned up by `discard`; repairable data is repaired on read.
 */
export function useSavedConfig() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const saved: ParsedSaved | null = useMemo(() => parseSaved(raw), [raw]);
  const corrupt = raw !== null && saved === null;

  const save = useCallback((config: ConfigState): { ok: boolean } => {
    try {
      window.localStorage.setItem(CONFIG_STORAGE_KEY, serializeSaved(config));
      notify();
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }, []);

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch {
      /* storage unavailable: nothing to remove */
    }
    notify();
  }, []);

  return { saved, corrupt, save, remove };
}
