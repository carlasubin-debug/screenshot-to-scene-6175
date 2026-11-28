import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Pencil, X } from "lucide-react";
import { usePet, updatePet } from "@/lib/pet-store";
import { updateSettings, useSettings } from "@/lib/settings-store";
import { Button } from "@/components/common";
import { NAME_MAX } from "@/lib/constants";
import { toast } from "sonner";

export function PetProfile() {
  const p = usePet();
  const s = useSettings();
  const [editing, setEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  if (!p || !s) return null;

  const fields = [
    { key: "name", label: "이름", value: s.name, max: NAME_MAX, placeholder: "반려동물 이름" },
    { key: "age", label: "나이", value: p.age, max: 30, placeholder: "예: 3살" },
    { key: "breed", label: "견종", value: p.breed, max: 60, placeholder: "예: 말티즈, 믹스견" },
    { key: "snack", label: "최애 간식", value: p.snack, placeholder: "예: 고구마" },
    { key: "likes", label: "좋아하는 것", value: p.likes, max: 100, placeholder: "예: 산책, 공놀이" },
    { key: "dislikes", label: "싫어하는 것", value: p.dislikes, max: 100, placeholder: "예: 큰 소리, 목욕" },
    { key: "personality", label: "성격", value: p.personality, max: 200, placeholder: "예: 호기심이 많고 사람을 좋아해요" },
  ];
  const control = "mt-2 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary";

  return (
    <section className="border-b border-border pb-6">
      <Dialog.Root open={editing} onOpenChange={(open) => { setEditing(open); setNameError(""); }}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-semibold">반려동물 성격 프로필</h2>
          <Dialog.Trigger asChild><Button variant="outline" size="sm"><Pencil className="h-4 w-4" />편집</Button></Dialog.Trigger>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          {fields.filter(f => f.key !== "name").map(f => (
            <div key={f.key} className={f.key === "personality" ? "col-span-2 min-w-0" : "min-w-0"}>
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words">{f.value || "아직 등록하지 않았어요"}</dd>
            </div>
          ))}
        </dl>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-overlay animate-in fade-in" />
          <Dialog.Content className="fixed inset-x-3 top-1/2 z-50 mx-auto flex max-h-[calc(100dvh-2rem)] w-auto max-w-xl -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-soft sm:inset-x-6">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-3">
              <Dialog.Title className="font-display text-xl">프로필 편집</Dialog.Title>
              <Dialog.Description className="sr-only">반려동물의 이름과 성격 프로필</Dialog.Description>
              <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="프로필 편집 닫기" title="닫기"><X className="h-5 w-5" /></Button></Dialog.Close>
            </div>
            <form className="flex min-h-0 flex-1 flex-col" onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const name = String(f.get("name") ?? "").trim();
              if (!name) { setNameError("이름을 입력해 주세요."); e.currentTarget.querySelector<HTMLInputElement>('[name="name"]')?.focus(); return; }
              updateSettings({ name });
              updatePet({ age: String(f.get("age") ?? "").trim(), breed: String(f.get("breed") ?? "").trim(), snack: String(f.get("snack") ?? "").trim(), likes: String(f.get("likes") ?? "").trim(), dislikes: String(f.get("dislikes") ?? "").trim(), personality: String(f.get("personality") ?? "").trim() });
              setEditing(false);
              toast.success("프로필을 저장했어요");
            }}>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map(f => <label key={f.key} className={f.key === "personality" ? "text-sm font-medium sm:col-span-2" : "min-w-0 text-sm font-medium"}>
                    <span className="flex items-center justify-between gap-2">{f.label}{f.key === "name" && <span className="text-xs font-normal text-muted-foreground">최대 {NAME_MAX}자</span>}</span>
                    {f.key === "personality" ? <textarea name={f.key} defaultValue={f.value} maxLength={f.max} placeholder={f.placeholder} rows={3} className={`${control} resize-none py-3`} /> : <input name={f.key} defaultValue={f.value} maxLength={f.max} placeholder={f.placeholder} required={f.key === "name"} aria-invalid={f.key === "name" && !!nameError} aria-describedby={f.key === "name" && nameError ? "profile-name-error" : undefined} onChange={f.key === "name" ? () => setNameError("") : undefined} className={`${control} h-12`} />}
                    {f.key === "name" && nameError && <span id="profile-name-error" role="alert" className="mt-2 block text-xs text-destructive">{nameError}</span>}
                  </label>)}
                </div>
              </div>
              <div className="flex shrink-0 gap-3 border-t border-border bg-popover p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Dialog.Close asChild><Button type="button" variant="outline" className="flex-1">취소</Button></Dialog.Close>
                <Button type="submit" className="flex-[2]"><Check className="h-4 w-4" />저장</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
