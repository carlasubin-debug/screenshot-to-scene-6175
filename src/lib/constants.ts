import type { Background, Relationship, Situation, Tone } from "./types";

export const NAME_MAX = 6;
export const IMAGE_MAX = 3;
export const SUGGESTED_NAMES = ["몽이", "수수", "하루", "뭐지"];

export const TONES: { id: Tone; label: string }[] = [
  { id: "child", label: "어린이" },
  { id: "adult", label: "어른" },
  { id: "mom", label: "엄마" },
  { id: "kind", label: "친절한" },
  { id: "playful", label: "장난기 있는" },
  { id: "blunt", label: "퉁명스러운" },
  { id: "annoying", label: "짜증나는" },
];

export const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "white", label: "흰색" },
  { id: "black", label: "검정" },
];

export const GREETINGS: Record<Tone, string> = {
  child: "와! 왔다! 오늘은 뭐 했어?",
  adult: "왔어요? 오늘 하루는 어땠어요.",
  mom: "밥은 먹었니? 얼른 와서 앉아.",
  kind: "안녕하세요! 오늘도 반가워요.",
  playful: "짠! 기다렸지? 나 안 보고 싶었어?",
  blunt: "왔어? ...뭐, 앉아.",
  annoying: "또 왔네. 뭐, 심심했어?",
};

export const INTERPRET_INTROS: Record<Tone, string> = {
  child: "어떤 말이 헷갈렸어? 같이 보자!",
  adult: "어떤 말이 마음에 걸렸는지 천천히 얘기해 봐요.",
  mom: "누가 무슨 말을 했길래 그래? 엄마한테 말해 봐.",
  kind: "궁금한 말이 있다면 편하게 보여 주세요.",
  playful: "오호, 수상한 말을 들고 왔구나? 보여 줘 봐!",
  blunt: "뭔데. 보여 줘 봐.",
  annoying: "또 뭘 못 알아들었는데? 일단 줘 봐.",
};

export const RELATIONSHIPS: { id: Relationship; label: string }[] = [
  { id: "friend", label: "친구" },
  { id: "lover", label: "연인" },
  { id: "family", label: "가족" },
  { id: "boss", label: "직장 상사" },
  { id: "coworker", label: "동료" },
  { id: "senior", label: "선후배" },
  { id: "stranger", label: "처음 만난 사이" },
  { id: "other", label: "기타" },
];

export const SITUATIONS: { id: Situation; label: string }[] = [
  { id: "group", label: "단톡" },
  { id: "dm", label: "1:1 메신저" },
  { id: "meeting", label: "회의 후" },
  { id: "request", label: "부탁·거절" },
  { id: "conflict", label: "갈등 직후" },
  { id: "casual", label: "평소 대화" },
];

export const INTERPRET_TRIGGERS = ["무슨 뜻이야", "뭐라는 거야", "이 말 뭐지", "무슨 의도일까"];

export function wantsInterpret(text: string): boolean {
  const t = text.replace(/\s+/g, " ");
  return INTERPRET_TRIGGERS.some((k) => t.includes(k));
}

/** 받침 여부에 따라 "은/는" 선택 */
export function topicParticle(name: string): string {
  const last = name.charCodeAt(name.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return "은(는)";
  return (last - 0xac00) % 28 === 0 ? "는" : "은";
}

export function eulParticle(name: string): string {
  const last = name.charCodeAt(name.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return "에게";
  return "에게";
}
