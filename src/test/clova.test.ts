// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchClovaReply, signClovaBody } from "@/lib/clova.server";

afterEach(() => vi.unstubAllGlobals());

describe("CLOVA chat protocol", () => {
  it("signs the exact UTF-8 body with HMAC SHA256 and Base64", async () => {
    const body = JSON.stringify({ text: "안녕하세요" });
    expect(await signClovaBody(body, "test-only-key")).toBe(createHmac("sha256", "test-only-key").update(body).digest("base64"));
  });

  it("sends the provided Invoke URL, guest identity and question and joins reply bubbles", async () => {
    const mock = vi.fn().mockResolvedValue(Response.json({ bubbles: [
      { type: "text", data: { description: "안녕하세요!" } },
      { type: "text", data: { description: "반가워요." } },
    ] }));
    vi.stubGlobal("fetch", mock);
    const id = "c4c23985-149c-47f6-bbb8-64d0d3e6ae9a";
    expect(await fetchClovaReply("안녕", id, "test-only-key")).toEqual({ ok: true, text: "안녕하세요!\n\n반가워요." });
    const call = mock.mock.calls[0];
    if (!call) throw new Error("Expected provider request");
    expect(call[0]).toBe("https://75vam9w3i7.apigw.ntruss.com/custom/v1/19708/87468cfd3ff423957ec8ba0d79174d19481e3d3a7e03a6056384b7fc5542a6d0");
    const init = call[1] as RequestInit;
    const body = String(init.body);
    expect(JSON.parse(body)).toMatchObject({ version: "v2", userId: id, event: "send", bubbles: [{ type: "text", data: { description: "안녕" } }] });
    expect(new Headers(init.headers).get("X-NCP-CHATBOT_SIGNATURE")).toBe(await signClovaBody(body, "test-only-key"));
  });

  it("does not substitute a mock reply when provider authentication fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("forbidden", { status: 403 })));
    expect((await fetchClovaReply("안녕", "guest", "test-only-key")).ok).toBe(false);
  });

  it("treats malformed or empty successful responses as failures", async () => {
    const mock = vi.fn().mockResolvedValueOnce(Response.json({ error: { code: "4031" } })).mockResolvedValueOnce(Response.json({ bubbles: [] }));
    vi.stubGlobal("fetch", mock);
    expect((await fetchClovaReply("안녕", "guest", "test-only-key")).ok).toBe(false);
    expect((await fetchClovaReply("안녕", "guest", "test-only-key")).ok).toBe(false);
  });

  it("recognizes CLOVA system error replies as failures rather than friend messages", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ bubbles: [{ data: { description: "I am sorry. (system error)" } }] })));
    expect((await fetchClovaReply("안녕", "guest", "test-only-key")).ok).toBe(false);
  });
});