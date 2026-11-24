import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button, Chip, Header, Modal, SoonBadge, Switch } from "@/components/common";
import { BACKGROUNDS, TONES } from "@/lib/constants";
import { CHAT_KEY } from "@/lib/interpret-session";
import { updateSettings, useSettings } from "@/lib/settings-store";
import type { FontSize } from "@/lib/types";
import { AppMenu } from "@/components/AppShell";
import { UserRound } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "설정 · 뭐라는 거야?" },
      { name: "description", content: "말투, 배경, 글자 크기 등 반려동물 설정을 바꿔요." },
      { property: "og:title", content: "설정 · 뭐라는 거야?" },
      { property: "og:description", content: "말투, 배경, 글자 크기 등 반려동물 설정을 바꿔요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const FONT_SIZES: { id: FontSize; label: string }[] = [
  { id: "small", label: "작게" },
  { id: "medium", label: "보통" },
  { id: "large", label: "크게" },
];

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span>{label}</span>
      {children}
    </div>
  );
}

function SettingsPage() {
  const s = useSettings();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [menu, setMenu] = useState(false);

  if (!s) return null;

  return (
    <div className="flex flex-1 flex-col">
      <Header title="프로필" onMenu={() => setMenu(true)} />
      <div className="page-content profile-content space-y-6 px-5 pb-10 pt-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-primary"><UserRound className="h-8 w-8" /></div>
          <div><h1 className="text-xl font-semibold">{s.name}</h1><p className="mt-1 text-sm text-muted-foreground">내 반려동물</p></div>
        </div>
        <section className="border-b border-border pb-6">
          <h2 className="mb-2 font-semibold">화면</h2>
          <p className="mb-2 text-sm text-muted-foreground">폰트 크기</p>
          <div className="flex gap-2">
            {FONT_SIZES.map((f) => (
              <Chip key={f.id} selected={s.fontSize === f.id} onClick={() => updateSettings({ fontSize: f.id })}>{f.label}</Chip>
            ))}
          </div>
          <p className="mb-2 mt-4 text-sm text-muted-foreground">배경</p>
          <div className="flex gap-2">
            {BACKGROUNDS.map((b) => (
              <Chip key={b.id} selected={s.background === b.id} onClick={() => updateSettings({ background: b.id })}>{b.label}</Chip>
            ))}
          </div>
          <Row label="애니메이션 줄이기">
            <Switch checked={s.reduceMotion} onChange={(v) => updateSettings({ reduceMotion: v })} label="애니메이션 줄이기" />
          </Row>
        </section>

        <section className="border-b border-border pb-6">
          <h2 className="mb-2 font-semibold">{s.name}의 말투</h2>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Chip key={t.id} selected={s.tone === t.id} onClick={() => updateSettings({ tone: t.id })}>{t.label}</Chip>
            ))}
          </div>
        </section>

        <section className="divide-y divide-border border-b border-border pb-3">
          <Row label={<span className="flex items-center gap-2">BGM 뮤트 <SoonBadge /></span>}>
            <Switch checked={s.bgmMuted} onChange={(v) => updateSettings({ bgmMuted: v })} label="BGM 뮤트" />
          </Row>
          <Row label={<span className="flex items-center gap-2">효과음 뮤트 <SoonBadge /></span>}>
            <Switch checked={s.sfxMuted} onChange={(v) => updateSettings({ sfxMuted: v })} label="효과음 뮤트" />
          </Row>
          <Row label="알림 설정"><SoonBadge /></Row>
        </section>
        <p className="-mt-2 px-2 text-xs text-muted-foreground">아직 소리가 없어서 뮤트 설정은 저장만 돼요.</p>

        <section className="divide-y divide-border">
          <Row label="대화 기록 삭제">
            <Button variant="danger" size="sm" onClick={() => setConfirm(true)}>삭제</Button>
          </Row>
          <Row label="업로드 이미지 삭제"><SoonBadge /></Row>
          <Row label="로그아웃"><SoonBadge /></Row>
          <Row label="계정 탈퇴"><SoonBadge /></Row>
        </section>
        <p className="px-2 text-xs text-muted-foreground">
          계정 기능은 준비 중이에요. 지금은 사진을 서버에 올리지 않아서 삭제할 업로드 이미지가 없어요.
        </p>

        <Button variant="ghost" className="w-full" onClick={() => navigate({ to: "/onboarding" })}>
          이름·처음 설정 다시 하기
        </Button>
      </div>

      <AppMenu open={menu} onClose={() => setMenu(false)} />
      <Modal
        open={confirm}
        onClose={() => {
          localStorage.removeItem(CHAT_KEY);
          setConfirm(false);
          toast.success("대화 기록을 삭제했어요");
        }}
        title="대화 기록 삭제"
      >
        <p className="text-muted-foreground">이 기기에 저장된 홈 대화 기록을 모두 지울게요.</p>
        <Button variant="ghost" className="mt-3 w-full" onClick={(e) => { e.stopPropagation(); setConfirm(false); }}>
          취소
        </Button>
      </Modal>
    </div>
  );
}
