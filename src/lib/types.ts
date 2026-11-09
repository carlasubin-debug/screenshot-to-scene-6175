export type Tone = "child" | "adult" | "mom" | "kind" | "playful" | "blunt" | "annoying";
export type Background = "white" | "black";
export type FontSize = "small" | "medium" | "large";

export interface UserSettings {
  name: string;
  tone: Tone;
  background: Background;
  onboarded: boolean;
  fontSize: FontSize;
  bgmMuted: boolean;
  sfxMuted: boolean;
  reduceMotion: boolean;
}

export type Relationship =
  | "friend" | "lover" | "family" | "boss" | "coworker" | "senior" | "stranger" | "other";
export type Situation = "group" | "dm" | "meeting" | "request" | "conflict" | "casual";

export interface ChatMessage {
  id: string;
  role: "user" | "friend";
  text: string;
  imageCount?: number;
  suggestInterpret?: boolean;
}

export interface InterpretRequest {
  text: string;
  imageCount: number;
  maskNames: boolean;
  relationship?: Relationship | undefined;
  situation?: Situation | undefined;
}

export type Confidence = "낮음" | "보통" | "높음";

export interface Interpretation {
  title: string;
  description: string;
  evidence: string;
}

export interface InterpretResult {
  original: string;
  summary: string;
  interpretations: [Interpretation, Interpretation, Interpretation];
  confidence: Confidence;
  otherPossibility: string;
  replies: { gentle: string; honest: string; light: string };
}
