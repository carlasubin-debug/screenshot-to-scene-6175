import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageCircleQuestion, Sparkles } from "lucide-react";
import { Button, ChatInput, Header, ImageUploader, type LocalImage } from "@/components/common";
import { AppMenu } from "@/components/AppShell";
import { CharacterDisplay, useCharacterMotion } from "@/components/character";
import { GREETINGS, wantsInterpret } from "@/lib/constants";
import { getChatReply } from "@/lib/friend-service";
import { CHAT_KEY, setDraftText } from "@/lib/interpret-session";
import { useSettings } from "@/lib/settings-store";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "뭐라는 거야? · 나의 AI 친구" },
      { name: "description", content: "헷갈리는 말, 친구에게 물어보세요. 상황까지 같이 살펴보는 대화 해석 친구." },
      { property: "og:title", content: "뭐라는 거야? · 나의 AI 친구" },
      { property: "og:description", content: "헷갈리는 말, 친구에게 물어보세요." },
    ],
  }),
  component: Home,
});

function Home() {
  const s = useSettings()!;
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [images, setImages] = useState<LocalImage[]>([]);
  const [attachSignal, setAttachSignal] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    const suggest = wantsInterpret(t);
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t, imageCount: images.length, suggestInterpret: suggest }]);
    setText("");
    setImages([]);
    if (suggest) return;
    setLoading(true);
    const reply = await getChatReply(s.tone, t);
    setLoading(false);
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "friend", text: reply }]);
  };

  const goInterpret = (draft?: string) => {
    if (draft) setDraftText(draft);
    navigate({ to: "/interpret" });
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header onMenu={() => setMenu(true)} />
      <div className="flex flex-1 flex-col overflow-y-auto px-5">
        <CharacterDisplay motion={motion} className={cn("transition-all", msgs.length ? "h-44" : "h-72")} />
        <div className="text-center">
          <p className="font-display text-2xl">{s.name}</p>
          <p className="mt-2 inline-block rounded-3xl bg-card px-5 py-3 shadow-soft">{GREETINGS[s.tone]}</p>
        </div>

        <div className="mt-6 flex-1 space-y-3 pb-4">
          {msgs.map((m) => (
            <div key={m.id} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-2.5",
                  m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-card shadow-soft",
                )}
              >
                {m.text}
                {!!m.imageCount && <span className="mt-1 block text-xs opacity-80">사진 {m.imageCount}장 첨부</span>}
              </div>
              {m.suggestInterpret && (
                <button
                  onClick={() => goInterpret(m.text)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                >
                  <Sparkles className="h-4 w-4" /> 해석 모드로 갈까요?
                </button>
              )}
            </div>
          ))}
          {loading && <p className="text-sm text-muted-foreground">{s.name}이(가) 생각 중...</p>}
          <div ref={endRef} />
        </div>
      </div>

      <div className="sticky bottom-0 space-y-3 bg-background/95 px-4 pb-5 pt-3 backdrop-blur">
        {images.length > 0 && <ImageUploader images={images} onChange={setImages} />}
        <div className="hidden"><ImageUploader images={images} onChange={setImages} openSignal={attachSignal} /></div>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => goInterpret()}>
            <MessageCircleQuestion className="h-4 w-4" /> 뭐라는 거야?
          </Button>
        </div>
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
