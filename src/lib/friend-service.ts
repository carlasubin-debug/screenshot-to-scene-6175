/**
 * Mock AI layer. Replace these functions with real AI calls later;
 * screens only depend on these signatures.
 */
import type { InterpretRequest, InterpretResult, Tone } from "./types";
import { RELATIONSHIPS, SITUATIONS } from "./constants";

const CHAT_REPLIES: Record<Tone, string[]> = {
  child: ["우와 진짜? 더 얘기해 줘!", "헤헤 재밌다! 그래서 어떻게 됐어?"],
  adult: ["그랬군요. 마음은 좀 괜찮아요?", "충분히 그럴 수 있어요. 더 들려줘요."],
  mom: ["아이고, 그랬어? 무리하지 말고.", "그래그래, 일단 물 한 잔 마셔."],
  kind: ["말해 줘서 고마워요. 계속 들을게요.", "그런 일이 있었군요. 어떤 기분이었어요?"],
  playful: ["오~ 그래서 그래서? 궁금해 죽겠네!", "에이, 그 정도면 선방이지! ㅋㅋ"],
  blunt: ["...그래서?", "흠. 뭐, 그럴 수도 있지."],
  annoying: ["아 그거? 별거 아니잖아.", "또 그 얘기야? ...알았어, 들어 줄게."],
};

export async function getChatReply(tone: Tone, _text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 600));
  const list = CHAT_REPLIES[tone];
  return list[Math.floor(Math.random() * list.length)] ?? list[0] ?? "";
}

export async function interpret(req: InterpretRequest): Promise<InterpretResult> {
  await new Promise((r) => setTimeout(r, 1400));
  const rel = RELATIONSHIPS.find((r) => r.id === req.relationship)?.label;
  const sit = SITUATIONS.find((s) => s.id === req.situation)?.label;
  const ctx = [rel && `${rel} 사이`, sit && `${sit} 상황`].filter(Boolean).join(", ");
  const original = req.text.trim() || "(이미지로 첨부한 대화 — 이미지 분석은 준비 중이에요)";

  return {
    original,
    summary: ctx
      ? `${ctx}이라면, 가볍게 던진 말이지만 약간의 아쉬움이 담겼을 가능성이 있어요.`
      : "가볍게 던진 말이지만 약간의 아쉬움이 담겼을 가능성이 있어요.",
    interpretations: [
      {
        title: "그냥 편하게 한 말",
        description: "특별한 의도 없이 대화를 이어가려고 한 말로 해석할 가능성이 있어요.",
        evidence: "짧고 단정한 문장은 평소 말버릇일 때가 많아요.",
      },
      {
        title: "살짝 서운함 표현",
        description: "직접 말하기 어려운 서운함을 돌려 말했을 가능성도 있어요.",
        evidence: "말끝을 흐리거나 반응을 기다리는 표현이 보일 때 그런 경우가 있어요.",
      },
      {
        title: "확인을 바라는 마음",
        description: "내 생각이나 반응을 확인하고 싶었을 수도 있어요.",
        evidence: ctx
          ? `${ctx}에서는 상대의 반응을 살피는 말이 자주 나와요.`
          : "질문처럼 끝나는 말은 답을 기다린다는 신호일 수 있어요.",
      },
    ],
    confidence: ctx ? "보통" : "낮음",
    otherPossibility:
      "다만 다른 의미일 수도 있어요. 앞뒤 대화나 평소 말투에 따라 전혀 다른 뜻일 수 있으니, 궁금하면 직접 물어보는 것도 좋아요.",
    replies: {
      gentle: "혹시 내가 신경 못 쓴 부분 있었어? 있으면 편하게 말해 줘 :)",
      honest: "방금 그 말이 무슨 뜻인지 잘 모르겠어서, 조금만 더 얘기해 줄래?",
      light: "ㅋㅋ 알겠어~ 다음에 맛있는 거 먹으면서 얘기하자!",
    },
  };
}
