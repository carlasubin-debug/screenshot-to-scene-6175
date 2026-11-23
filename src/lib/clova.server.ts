import { z } from "zod";

const INVOKE_URL = "https://75vam9w3i7.apigw.ntruss.com/custom/v1/19708/87468cfd3ff423957ec8ba0d79174d19481e3d3a7e03a6056384b7fc5542a6d0";

const responseSchema = z.object({
  bubbles: z.array(z.object({
    data: z.object({ description: z.string().optional() }).passthrough(),
  }).passthrough()),
}).passthrough();

export type ClovaReply = { ok: true; text: string } | { ok: false; error: string };

export async function signClovaBody(body: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function fetchClovaReply(text: string, userId: string, secret: string): Promise<ClovaReply> {
  const body = JSON.stringify({
    version: "v2", userId, timestamp: Date.now(),
    bubbles: [{ type: "text", data: { description: text } }], event: "send",
  });
  try {
    const signature = await signClovaBody(body, secret);
    const response = await fetch(INVOKE_URL, {
      method: "POST", redirect: "manual", signal: AbortSignal.timeout(20000),
      headers: { "Content-Type": "application/json", "X-NCP-CHATBOT_SIGNATURE": signature },
      body,
    });
    if (!response.ok) {
      // Never log the signed request, user text or provider body (which may echo it).
      console.error("CLOVA request failed", response.status);
      return { ok: false, error: response.status === 401 || response.status === 403
        ? "클로바 연결 인증을 확인해 주세요."
        : "클로바에서 답변을 받지 못했어요. 잠시 후 다시 시도해 주세요." };
    }
    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) return { ok: false, error: "클로바 답변을 읽지 못했어요. 연결 설정을 확인해 주세요." };
    const reply = parsed.data.bubbles.map((bubble) => bubble.data.description?.trim()).filter(Boolean).join("\n\n");
    if (/\(system error\)/i.test(reply)) return { ok: false, error: "클로바 챗봇에서 시스템 오류가 발생했어요. 챗봇의 학습·배포 상태를 확인해 주세요." };
    return reply ? { ok: true, text: reply } : { ok: false, error: "클로바가 글로 된 답변을 보내지 않았어요. 다른 질문을 해 주세요." };
  } catch {
    return { ok: false, error: "클로바 연결이 지연되고 있어요. 잠시 후 다시 시도해 주세요." };
  }
}