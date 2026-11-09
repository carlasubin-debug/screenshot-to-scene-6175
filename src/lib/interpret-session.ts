import type { InterpretRequest, InterpretResult } from "./types";

const DRAFT = "mwoi.interpret.draft";
const RESULT = "mwoi.interpret.result";

export const setDraftText = (t: string) => sessionStorage.setItem(DRAFT, t);
export const takeDraftText = () => {
  const t = sessionStorage.getItem(DRAFT) ?? "";
  sessionStorage.removeItem(DRAFT);
  return t;
};

export const saveResult = (r: { req: InterpretRequest; result: InterpretResult }) =>
  sessionStorage.setItem(RESULT, JSON.stringify(r));
export const loadResult = (): { req: InterpretRequest; result: InterpretResult } | null => {
  try {
    const raw = sessionStorage.getItem(RESULT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const CHAT_KEY = "mwoi.chat.v1";
