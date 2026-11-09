import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Chip } from "@/components/common";
import { CharacterSettings, CharacterPreview } from "@/components/character";
import { BACKGROUNDS, NAME_MAX, SUGGESTED_NAMES, TONES } from "@/lib/constants";
import { updateSettings, useSettings } from "@/lib/settings-store";
import type { Background, Tone } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "친구 만들기 · 뭐라는 거야?" },
      { name: "description", content: "이름과 말투를 정하고 나만의 AI 친구를 만나 보세요." },
      { property: "og:title", content: "친구 만들기 · 뭐라는 거야?" },
      { property: "og:description", content: "이름과 말투를 정하고 나만의 AI 친구를 만나 보세요." },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["이름", "말투", "배경", "외형"];

function Onboarding() {
  const s = useSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(s?.name ?? "");
  const [tone, setTone] = useState<Tone>(s?.tone ?? "kind");
  const [bg, setBg] = useState<Background>(s?.background ?? "white");

  const canNext = step !== 0 || name.trim().length > 0;
  const finish = () => {
    updateSettings({ name: name.trim(), tone, background: bg, onboarded: true });
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
      <div className="mb-8 flex gap-1.5">
        {STEPS.map((l, i) => (
          <div key={l} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>

      <div className="flex-1">
        {step === 0 && (
          <>
            <h1 className="font-display text-3xl leading-snug">친구의 이름을<br />지어 주세요</h1>
            <input
              autoFocus
              value={name}
              maxLength={NAME_MAX}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              placeholder="최대 6자"
              className="mt-8 h-14 w-full rounded-2xl border border-input bg-card px-5 text-lg outline-none focus:border-primary"
            />
            <p className="mt-2 text-right text-sm text-muted-foreground">{name.length}/{NAME_MAX}</p>
            <p className="mt-4 text-sm text-muted-foreground">추천 이름</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED_NAMES.map((n) => (
                <Chip key={n} selected={name === n} onClick={() => setName(n)}>{n}</Chip>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="font-display text-3xl leading-snug">{name}의 말투를<br />골라 주세요</h1>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {TONES.map((t) => (
                <Chip key={t.id} selected={tone === t.id} onClick={() => setTone(t.id)} className="h-14 rounded-2xl text-base">
                  {t.label}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-3xl leading-snug">배경색을<br />골라 주세요</h1>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBg(b.id)}
                  aria-pressed={bg === b.id}
                  className={cn("rounded-3xl border-2 p-2 transition", bg === b.id ? "border-primary" : "border-transparent")}
                >
                  <div className={cn(b.id === "black" && "dark")}>
                    <div className="h-36 rounded-2xl border border-border bg-background" />
                  </div>
                  <p className="mt-2 font-semibold">{b.label}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center pt-6 text-center">
            <CharacterPreview className="w-full" />
            <h1 className="mt-8 font-display text-2xl">외형 설정</h1>
            <div className="mt-2"><CharacterSettings /></div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>이전</Button>
        )}
        {step < 3 ? (
          <Button size="lg" className="flex-1" disabled={!canNext} onClick={() => setStep(step + 1)}>다음</Button>
        ) : (
          <Button size="lg" className="flex-1" onClick={finish}>설정 완료</Button>
        )}
      </div>
    </div>
  );
}
