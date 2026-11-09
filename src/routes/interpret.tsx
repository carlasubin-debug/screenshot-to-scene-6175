import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button, Card, Chip, Header, ImageUploader, Loading, SoonBadge, Switch, type LocalImage } from "@/components/common";
import { CharacterDisplay } from "@/components/character";
import { INTERPRET_INTROS, RELATIONSHIPS, SITUATIONS, topicParticle } from "@/lib/constants";
import { interpret } from "@/lib/friend-service";
import { saveResult, takeDraftText } from "@/lib/interpret-session";
import { useSettings } from "@/lib/settings-store";
import type { Relationship, Situation } from "@/lib/types";

export const Route = createFileRoute("/interpret")({
  head: () => ({
    meta: [
      { title: "뭐라는 거야? · 대화 해석" },
      { name: "description", content: "헷갈리는 말을 관계와 상황까지 함께 살펴봐요." },
      { property: "og:title", content: "뭐라는 거야? · 대화 해석" },
      { property: "og:description", content: "헷갈리는 말을 관계와 상황까지 함께 살펴봐요." },
    ],
  }),
  component: InterpretPage,
});

function InterpretPage() {
  const s = useSettings()!;
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [images, setImages] = useState<LocalImage[]>([]);
  const [mask, setMask] = useState(true);
  const [rel, setRel] = useState<Relationship>();
  const [sit, setSit] = useState<Situation>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = takeDraftText();
    if (d) setText(d);
  }, []);

  const analyze = async () => {
    setLoading(true);
    const req = { text, imageCount: images.length, maskNames: mask, relationship: rel, situation: sit };
    const result = await interpret(req);
    saveResult({ req, result });
    navigate({ to: "/result" });
  };

  if (loading)
    return (
      <div className="flex flex-1 flex-col">
        <Header title="뭐라는 거야?" back />
        <CharacterDisplay motion="think" className="mt-10 h-60" />
        <Loading label={`${s.name}${topicParticle(s.name)} 상황을 살펴보는 중...`} />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col">
      <Header title="뭐라는 거야?" back />
      <div className="flex-1 space-y-5 px-5 pb-32 pt-2">
        <Card className="bg-accent text-accent-foreground">
          <p className="font-display text-lg">{INTERPRET_INTROS[s.tone]}</p>
          <p className="mt-2 text-sm opacity-80">
            {s.name}{topicParticle(s.name)} 번역기가 아니라, 상황까지 같이 살펴보는 친구예요.
          </p>
        </Card>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder={`뭐라는 거야? 라고 생각한 말이 있다면 ${s.name}에게 말해봐요`}
          className="w-full resize-none rounded-3xl border border-input bg-card p-5 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        <section>
          <h2 className="mb-2 font-semibold">대화 캡처 (최대 3장)</h2>
          <ImageUploader images={images} onChange={setImages} />
          {images.length > 0 && (
            <Card className="mt-3 space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm">타인의 대화가 포함돼요. 이름·프로필을 가릴까요?</p>
                <Switch checked={mask} onChange={setMask} label="이름·프로필 가리기" />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> 분석 후 이미지는 즉시 삭제돼요.
              </p>
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <SoonBadge /> 이미지 글자 읽기·가리기·서버 삭제는 아직 준비 중이라, 지금은 사진 내용이 분석에 반영되지 않아요. 사진은 이 기기 밖으로 전송되지 않아요.
              </p>
            </Card>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-semibold">어떤 사이예요? <span className="text-sm font-normal text-muted-foreground">(선택)</span></h2>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIPS.map((r) => (
              <Chip key={r.id} selected={rel === r.id} onClick={() => setRel(rel === r.id ? undefined : r.id)}>{r.label}</Chip>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-2 font-semibold">어떤 상황이었어요? <span className="text-sm font-normal text-muted-foreground">(선택)</span></h2>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map((x) => (
              <Chip key={x.id} selected={sit === x.id} onClick={() => setSit(sit === x.id ? undefined : x.id)}>{x.label}</Chip>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-background/95 px-5 pb-6 pt-3 backdrop-blur">
        <Button size="lg" className="w-full" disabled={!text.trim() && images.length === 0} onClick={analyze}>
          분석하기
        </Button>
        {(rel || sit) ? null : (
          <p className="mt-2 text-center text-xs text-muted-foreground">관계·상황은 건너뛰어도 괜찮아요</p>
        )}
      </div>
    </div>
  );
}
