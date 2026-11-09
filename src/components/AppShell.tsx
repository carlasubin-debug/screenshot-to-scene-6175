import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { MessageCircleQuestion, Shirt, Settings as SettingsIcon } from "lucide-react";
import { useSettings } from "@/lib/settings-store";
import { cn } from "@/lib/utils";
import { BottomSheet, Loading, Modal } from "./common";

const SCALE = { small: 0.9, medium: 1, large: 1.12 };

/** Applies user preferences and guards onboarding. */
export function AppShell({ children }: { children: ReactNode }) {
  const s = useSettings();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (s && !s.onboarded && path !== "/onboarding") navigate({ to: "/onboarding" });
  }, [s, path, navigate]);

  useEffect(() => {
    if (s) document.documentElement.style.setProperty("--app-font-scale", String(SCALE[s.fontSize]));
  }, [s]);

  return (
    <div className={cn(s?.background === "black" && "dark", s?.reduceMotion && "reduce-motion")}>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground md:my-0 md:shadow-soft">
        {!s || (!s.onboarded && path !== "/onboarding") ? <Loading /> : children}
      </div>
    </div>
  );
}

export function AppMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [soon, setSoon] = useState(false);
  const item = "flex w-full items-center gap-4 rounded-2xl bg-muted px-5 py-4 text-left font-semibold hover:brightness-95";
  return (
    <>
      <BottomSheet open={open} onClose={onClose} title="메뉴">
        <div className="space-y-3">
          <button className={item} onClick={() => navigate({ to: "/interpret" })}>
            <MessageCircleQuestion className="h-5 w-5 text-primary" /> 뭐라는 거야?
          </button>
          <button className={item} onClick={() => { onClose(); setSoon(true); }}>
            <Shirt className="h-5 w-5 text-primary" /> 뭐 입을 거야?
          </button>
          <button className={item} onClick={() => navigate({ to: "/settings" })}>
            <SettingsIcon className="h-5 w-5 text-primary" /> 설정
          </button>
        </div>
      </BottomSheet>
      <Modal open={soon} onClose={() => setSoon(false)} title="뭐 입을 거야?">
        <p className="text-muted-foreground">캐릭터 꾸미기 기능을 준비하고 있어요.</p>
      </Modal>
    </>
  );
}
