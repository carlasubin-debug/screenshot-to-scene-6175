import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button, ChatInput, Header, ImageUploader, type LocalImage } from "@/components/common";
import { AppMenu } from "@/components/AppShell";
import { CharacterDisplay, useCharacterMotion } from "@/components/character";
import { getClovaReply } from "@/lib/clova.functions";
import { CHAT_KEY } from "@/lib/interpret-session";
import { useSettings } from "@/lib/settings-store";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "뭐라는 거야? · 내 반려동물과 대화" },
      { name: "description", content: "내 반려동물에게 말을 걸고 속마음을 들어 보세요." },
      { property: "og:title", content: "뭐라는 거야? · 내 반려동물과 대화" },
      { property: "og:description", content: "내 반려동물에게 말을 걸고 속마음을 들어 보세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const s = useSettings();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [images, setImages] = useState<LocalImage[]>([]);
  const [attachSignal, setAttachSignal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryText, setRetryText] = useState("");
  const sendingRef = useRef(false);
  const guestIdRef = useRef("");
  const requestReply = useServerFn(getClovaReply);
  const endRef = useRef<HTMLDivElement>(null);
  const motion = useCharacterMotion(loading ? "loading" : text ? "typing" : "idle");

  useEffect(() => {
    try {
      setMsgs(JSON.parse(localStorage.getItem(CHAT_KEY) ?? "[]"));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const receiveReply = async (t: string) => {
    sendingRef.current = true;
    setLoading(true);
    setError("");
    setRetryText(t);
    try {
      if (!guestIdRef.current) {
        const stored = sessionStorage.getItem("mwoi.clova.guest");
        guestIdRef.current = stored || crypto.randomUUID();
        sessionStorage.setItem("mwoi.clova.guest", guestIdRef.current);
      }
      const reply = await requestReply({ data: { text: t, userId: guestIdRef.current } });
      if (!reply.ok) {
        setError(reply.error);
        return;
      }
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "friend", text: reply.text }]);
      setRetryText("");
    } catch {
      setError("답변을 받지 못했어요. 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  };

  const send = async () => {
    const t = text.trim();
    if (!t || !s || sendingRef.current) return;
    setError("");
    setRetryText("");
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t, imageCount: images.length }]);
    setText("");
    setImages([]);
    await receiveReply(t);
  };

  if (!s) return null;

  return (
    <div className="home-page flex flex-1 flex-col">
      <Header title="대화하기" onMenu={() => setMenu(true)} />
      <div className="page-content flex flex-1 flex-col px-5">
        <CharacterDisplay motion={motion} className={cn(msgs.length ? "h-48" : "h-60")} />
        <div className="text-center">
          <p className="font-display text-2xl">{s.name}</p>
        </div>

        <div className="mt-6 flex-1 space-y-3 pb-4">
          {msgs.map((m) => (
            <div key={m.id} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap break-words rounded-lg px-4 py-2.5",
                  m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-card shadow-soft",
                )}
              >
                {m.text}
                {!!m.imageCount && <span className="mt-1 block text-xs opacity-80">사진 {m.imageCount}장 첨부</span>}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-muted-foreground">{s.name}이(가) 생각 중...</p>}
          <div ref={endRef} />
        </div>
      </div>

      <div className="page-actions sticky space-y-3 border-t border-border bg-background/95 px-5 pb-4 pt-3 backdrop-blur">
        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-2 text-sm text-destructive">
          <p>{error}</p>
          <Button variant="outline" size="sm" disabled={loading} onClick={() => { if (retryText && !sendingRef.current) void receiveReply(retryText); }}>다시 시도</Button>
        </div>}
        {images.length > 0 && <ImageUploader images={images} onChange={setImages} />}
        <div className="hidden"><ImageUploader images={images} onChange={setImages} openSignal={attachSignal} /></div>
        <ChatInput
          value={text}
          onChange={setText}
          onSend={send}
          onAttach={() => setAttachSignal((n) => n + 1)}
          placeholder={`${s.name}에게 말 걸기`}
          disabled={loading}
        />
      </div>
      <AppMenu open={menu} onClose={() => setMenu(false)} />
    </div>
  );
}
