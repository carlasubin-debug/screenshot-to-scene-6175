import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchClovaReply, type ClovaReply } from "./clova.server";

// Intentionally public: the existing chat has no account requirement.
// Guest IDs separate conversations; no stored app data or credentials are returned.
export const getClovaReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({
    text: z.string().trim().min(1).max(4000),
    userId: z.string().uuid(),
  }).parse(input))
  .handler(async ({ data }): Promise<ClovaReply> => {
    const secret = process.env['CLOVA_CHATBOT_SECRET_KEY'];
    if (!secret) return { ok: false, error: "클로바 연결을 위한 비밀키가 아직 설정되지 않았어요." };
    return fetchClovaReply(data.text, data.userId, secret);
  });