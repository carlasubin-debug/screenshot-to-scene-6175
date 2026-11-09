/**
 * Character slot. No 3D model yet — these components render an empty stage.
 * Later: swap CharacterDisplay's inner content for a GLB viewer (lazy-loaded, client-only).
 */
import { cn } from "@/lib/utils";

export type CharacterMotionName = "idle" | "talk" | "think" | "happy";

export function CharacterDisplay({
  motion = "idle",
  className,
}: {
  motion?: CharacterMotionName;
  className?: string;
}) {
  return (
    <div
      data-character-slot
      data-motion={motion}
      aria-label="캐릭터 영역 (준비 중)"
      className={cn("relative flex items-center justify-center", className)}
    >
      <div className="absolute inset-0 rounded-full bg-stage opacity-80 blur-2xl" />
      <div className="relative h-44 w-44 rounded-full border-2 border-dashed border-border animate-float" />
    </div>
  );
}

/** Placeholder for future appearance customization. */
export function CharacterSettings() {
  return <p className="text-muted-foreground">캐릭터 꾸미기는 조금만 기다려 주세요!</p>;
}

export function CharacterPreview({ className }: { className?: string }) {
  return <CharacterDisplay className={cn("h-32", className)} />;
}

/** Maps app events to motions; no-op until a 3D character exists. */
export function useCharacterMotion(state: "idle" | "typing" | "loading" | "done"): CharacterMotionName {
  return state === "typing" ? "talk" : state === "loading" ? "think" : state === "done" ? "happy" : "idle";
}
export const CharacterMotion = { use: useCharacterMotion };
