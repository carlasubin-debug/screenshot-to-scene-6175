import { useSyncExternalStore } from "react";
import type { UserSettings } from "./types";

const KEY = "mwoi.settings.v1";

export const DEFAULT_SETTINGS: UserSettings = {
  name: "",
  tone: "kind",
  background: "white",
  onboarded: false,
  fontSize: "medium",
  bgmMuted: false,
  sfxMuted: false,
  reduceMotion: false,
};

const listeners = new Set<() => void>();
let cache: UserSettings | null = null;

function read(): UserSettings {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    cache = DEFAULT_SETTINGS;
  }
  return cache!;
}

export function updateSettings(patch: Partial<UserSettings>) {
  cache = { ...read(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export function resetSettings() {
  localStorage.removeItem(KEY);
  cache = null;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** null until hydrated on the client */
export function useSettings(): UserSettings | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
