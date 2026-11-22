import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, EmptyState, Header } from "@/components/common";
import { loadResult } from "@/lib/interpret-session";
import type { InterpretResult } from "@/lib/types";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "해석 결과 · 뭐라는 거야?" },
      { name: "description", content: "가능한 해석과 추천 답장을 확인해 보세요." },
      { property: "og:title", content: "해석 결과 · 뭐라는 거야?" },
      { property: "og:description", content: "가능한 해석과 추천 답장을 확인해 보세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultPage,
});

const REPLY_LABELS = { gentle: "부드럽게 답하기", honest: "솔직하게 답하기", light: "가볍게 넘기기" } as const;

function ResultPage() {
  const [r, setR] = useState<InterpretResult | null | undefined>(undefined);
  useEffect(() => setR(loadResult()?.result ?? null), []);

  const copy = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
      toast.success("답장을 복사했어요");
    } catch {
      toast.error("복사하지 못했어요");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header title="해석 결과" back />
      {r === null && (
        <EmptyState
          message="아직 해석한 내용이 없어요."
          action={<Link to="/interpret" className="font-semibold text-primary">해석하러 가기</Link>}
        />
      )}
      {r && (
        <div className="page-content space-y-4 px-5 pb-10 pt-6">
          <section className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground">입력한 원문</p>
            <p className="mt-1 whitespace-pre-wrap">"{r.original}"</p>
          </section>
          <section className="border-b border-border pb-5">
            <p className="text-xs opacity-80">한 줄 요약</p>
            <p className="mt-1 font-display text-lg">{r.summary}</p>
            <p className="mt-3 text-sm">확신 수준: <b>{r.confidence}</b></p>
          </section>

          <h2 className="pt-2 font-display text-lg">이렇게 해석할 가능성이 있어요</h2>
          {r.interpretations.map((it, i) => (
            <Card key={i}>
              <p className="text-xs font-semibold text-primary">가능한 해석 {i + 1}</p>
              <p className="mt-1 font-semibold">{it.title}</p>
              <p className="mt-1 text-sm">{it.description}</p>
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">근거 · {it.evidence}</p>
            </Card>
          ))}

          <section className="border-b border-border py-4">
            <p className="text-xs opacity-80">다른 가능성</p>
            <p className="mt-1 text-sm">{r.otherPossibility}</p>
          </section>

          <h2 className="pt-2 font-display text-lg">추천 답장</h2>
          {(Object.keys(REPLY_LABELS) as (keyof typeof REPLY_LABELS)[]).map((k) => (
            <Card key={k} className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-primary">{REPLY_LABELS[k]}</p>
                <p className="mt-1">{r.replies[k]}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copy(r.replies[k])} aria-label={`${REPLY_LABELS[k]} 복사`}>
                <Copy className="h-4 w-4" /> 복사
              </Button>
            </Card>
          ))}

          <p className="pt-2 text-center text-xs text-muted-foreground">
            지금은 연습용 예시 결과예요. 실제 AI 분석은 준비 중이에요.
          </p>
          <Link to="/interpret" className="block">
            <Button variant="secondary" className="w-full">다른 말 해석하기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
