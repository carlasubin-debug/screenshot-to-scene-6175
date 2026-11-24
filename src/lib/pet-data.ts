import type { Mood } from "./pet-store";

export const MOODS: { id: Mood; label: string; face: string; line: string }[] = [
  { id: "happy", label: "행복", face: "😊", line: "오늘 기분 최고야! 너랑 있으면 꼬리가 멈추질 않아." },
  { id: "bored", label: "심심함", face: "😐", line: "심심해… 나랑 놀아 줄 거지?" },
  { id: "sleepy", label: "졸림", face: "😪", line: "하암… 조금만 더 자고 싶어." },
  { id: "curious", label: "호기심", face: "🧐", line: "저건 뭐지? 냄새 맡아 봐도 돼?" },
];

export const SUGGESTED_QUESTIONS = ["오늘 뭐 했어?", "내가 외출하면 뭐 해?", "내가 제일 좋아?", "왜 자꾸 짖어?"];

export const BEHAVIORS = [
  { id: "tail", label: "꼬리를 흔들어요", says: "너 왔구나! 너무 반가워서 몸이 저절로 움직여!", note: "반가움이나 흥분을 뜻할 때가 많아요. 꼬리를 낮게 빠르게 흔들면 긴장일 수도 있어요." },
  { id: "follow", label: "계속 따라와요", says: "어디 가? 나도 같이 갈래! 혼자 두지 마.", note: "애착과 관심의 표현이에요. 너무 심하면 분리불안 신호일 수 있어요." },
  { id: "tilt", label: "고개를 갸웃거려요", says: "방금 뭐라고 했어? 다시 한 번 말해 줘!", note: "소리에 집중하거나 말을 이해하려 할 때 자주 보여요." },
  { id: "belly", label: "배를 보여요", says: "나 너 완전 믿어. 배 쓰다듬어 줄래?", note: "편안함과 신뢰의 표현이에요. 긴장한 상태라면 복종 신호일 수도 있어요." },
  { id: "lick", label: "손을 핥아요", says: "좋아해! 이게 내 뽀뽀야.", note: "애정 표현이거나 관심을 끌고 싶을 때 보여요." },
  { id: "dig", label: "땅이나 이불을 파요", says: "여기 내 자리 만들고 있어. 포근하게!", note: "본능적인 행동이에요. 심심할 때도 자주 나와요." },
];

export const SOUNDS = [
  { id: "door", label: "현관 소리에 짖어요", says: "누구야?! 우리 집은 내가 지킬게!", note: "경계 짖음일 가능성이 커요." },
  { id: "whine", label: "낑낑거려요", says: "나 좀 봐 줘… 뭔가 필요해.", note: "관심, 배고픔, 불편함을 알릴 때가 많아요. 계속되면 몸 상태를 살펴 주세요." },
  { id: "alone", label: "혼자 있을 때 울어요", says: "어디 갔어… 빨리 돌아와.", note: "외로움이나 분리불안일 수 있어요." },
  { id: "play", label: "놀다가 으르렁거려요", says: "으르릉! 이건 진짜 화난 게 아니야, 놀이야!", note: "몸이 느슨하면 놀이 소리예요." },
  { id: "sigh", label: "한숨을 쉬어요", says: "후… 편하다. 아니면 조금 아쉬운가?", note: "눈을 감았다면 만족, 뜨고 있다면 실망일 수 있어요." },
];

export const LETTERS = [
  "오늘도 네가 문을 열고 들어오는 소리가 제일 좋았어. 내일도 꼭 와 줘.",
  "산책길에 맡은 냄새 중에 네 냄새가 제일 좋아. 비밀이야.",
  "가끔 바빠 보여도 괜찮아. 나는 언제나 여기서 기다릴게.",
  "어제 간식 고마웠어. 오늘도… 혹시… 있어?",
  "네가 웃으면 나도 꼬리가 막 흔들려. 오늘도 많이 웃자!",
];

export const FORTUNES = [
  "오늘은 작은 간식 같은 행운이 찾아올 거야!",
  "산책하면 좋은 일이 생길 것 같은 날이야.",
  "오늘은 푹 쉬는 게 최고! 나랑 같이 낮잠 잘래?",
  "누군가 너를 많이 생각하고 있어. 바로 나!",
  "새로운 걸 시도하기 좋은 날이야. 킁킁, 좋은 냄새가 나.",
];

export const PLAYS = [
  { id: "ball", label: "공놀이", says: "던져! 던져! 내가 꼭 물어 올게!" },
  { id: "walk", label: "산책", says: "산책이다! 오늘은 저쪽 길로 가 보자!" },
  { id: "tug", label: "터그놀이", says: "으르릉~ 내가 이길 거야! 놓지 마!" },
  { id: "hide", label: "숨바꼭질", says: "어디 숨었어? 냄새로 다 찾아낼 거야!" },
];

export const SNACKS = ["닭가슴살 육포", "고구마 말랭이", "치즈 큐브", "사과 조각", "오리 목뼈", "황태 스틱"];

export const ROUTINES = [
  { id: "morning", label: "아침", from: 5, says: "일어났어? 밥 먹고 산책 가자!" },
  { id: "day", label: "낮", from: 11, says: "창밖 구경 중이야. 새가 지나갔어!" },
  { id: "evening", label: "저녁", from: 17, says: "이제 올 시간이지? 현관 앞에서 기다리는 중!" },
  { id: "night", label: "밤", from: 21, says: "오늘도 고마웠어. 네 옆에서 잘래." },
];
export function routineNow(hour = new Date().getHours()) {
  if (hour >= 21 || hour < 5) return ROUTINES[3]!;
  if (hour >= 17) return ROUTINES[2]!;
  if (hour >= 11) return ROUTINES[1]!;
  return ROUTINES[0]!;
}

export const OUTFITS = [
  { id: "", label: "없음", icon: "" },
  { id: "hat", label: "모자", icon: "🎩", min: 0 },
  { id: "ribbon", label: "리본", icon: "🎀", min: 10 },
  { id: "scarf", label: "목도리", icon: "🧣", min: 30 },
  { id: "crown", label: "왕관", icon: "👑", min: 60 },
];

export const SITUATIONS_SIM = [
  { id: "vet", label: "병원 가기", says: "여기 냄새 무서워… 손 꼭 잡아 줄 거지?" },
  { id: "bath", label: "목욕하기", says: "물은 싫은데… 끝나면 간식 주는 거지?" },
  { id: "ready", label: "산책 준비", says: "목줄이다!! 빨리빨리! 문 앞에서 기다릴게!" },
  { id: "home", label: "혼자 집에 있기", says: "괜찮아… 나 잘 지킬게. 대신 빨리 와야 해." },
];

export const STICKERS: Record<string, { label: string; icon: string }> = {
  chat: { label: "첫 대화", icon: "💬" },
  behavior: { label: "행동 관찰자", icon: "🔍" },
  sound: { label: "소리 탐정", icon: "👂" },
  letter: { label: "편지 받는 사람", icon: "💌" },
  play: { label: "놀이 친구", icon: "🎾" },
  snack: { label: "간식 미식가", icon: "🦴" },
  diary: { label: "기록가", icon: "📔" },
  situation: { label: "모험가", icon: "🧭" },
  fortune: { label: "행운 수집가", icon: "🍀" },
};
