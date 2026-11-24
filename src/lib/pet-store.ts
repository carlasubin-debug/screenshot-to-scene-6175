import { useSyncExternalStore } from "react";

export type Mood = "happy" | "bored" | "sleepy" | "curious";
export interface DiaryEntry { id: string; date: string; memo: string; photo?: string; milestone: boolean }
export interface PetState {
  age: string; breed: string; likes: string; dislikes: string; personality: string;
  mood: Mood; intimacy: number; diary: DiaryEntry[]; favorites: string[];
  stickers: string[]; snack: string; outfit: string; letterDate: string;
}

const KEY = "mwoi.pet.v1";
export const DEFAULT_PET: PetState = {
  age: "", breed: "", likes: "", dislikes: "", personality: "",
  mood: "happy", intimacy: 0, diary: [], favorites: [], stickers: [], snack: "", outfit: "", letterDate: "",
};
const listeners = new Set<() => void>();
let cache: PetState | null = null;
function read(): PetState {
  if (cache) return cache;
  try { const raw = localStorage.getItem(KEY); cache = raw ? { ...DEFAULT_PET, ...JSON.parse(raw) } : DEFAULT_PET; }
  catch { cache = DEFAULT_PET; }
  return cache!;
}
export function updatePet(patch: Partial<PetState> | ((p: PetState) => Partial<PetState>)) {
  const cur = read();
  cache = { ...cur, ...(typeof patch === "function" ? patch(cur) : patch) };
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage full */ }
  listeners.forEach((l) => l());
}
/** Adds intimacy points and, if new, a collection sticker. */
export function reward(points: number, sticker?: string) {
  updatePet((p) => ({
    intimacy: p.intimacy + points,
    stickers: sticker && !p.stickers.includes(sticker) ? [...p.stickers, sticker] : p.stickers,
  }));
}
export function resetPet() { localStorage.removeItem(KEY); cache = null; listeners.forEach((l) => l()); }
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function usePet(): PetState | null { return useSyncExternalStore(subscribe, read, () => null); }

export const LEVELS = [
  { min: 0, label: "어색한 사이" },
  { min: 10, label: "친해지는 중" },
  { min: 30, label: "단짝" },
  { min: 60, label: "영혼의 단짝" },
];
export function levelOf(points: number) {
  let i = 0;
  LEVELS.forEach((l, idx) => { if (points >= l.min) i = idx; });
  const next = LEVELS[i + 1];
  return { index: i, label: LEVELS[i]!.label, next: next?.min ?? null };
}
/** Stable daily pick so letters and fortunes change once per day. */
export function dailyPick<T>(list: readonly T[], date: string, salt = 0): T {
  let h = salt;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return list[h % list.length]!;
}
export const today = () => new Date().toLocaleDateString("sv-SE");
