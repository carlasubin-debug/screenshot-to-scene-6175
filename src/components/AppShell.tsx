import { useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { House, UserRound, PawPrint, BookOpen, Shirt, Settings as SettingsIcon } from "lucide-react";
import { useSettings } from "@/lib/settings-store";
import { cn } from "@/lib/utils";
import { BottomSheet, Loading } from "./common";

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
      <div className="app-frame flex min-h-dvh w-full flex-col bg-background text-foreground">
        {!s || (!s.onboarded && path !== "/onboarding") ? <Loading /> : children}
        <nav aria-label="하단 메뉴" className="bottom-navigation fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="mx-auto grid max-w-2xl grid-cols-4">
            {[
              { to: "/", label: "홈", icon: House, active: path === "/" },
              { to: "/activities", label: "함께하기", icon: PawPrint, active: path === "/activities" },
              { to: "/records", label: "기록", icon: BookOpen, active: path === "/records" },
              { to: "/settings", label: "프로필", icon: UserRound, active: path === "/settings" },
            ].map(({ to, label, icon: Icon, active }) => (
              <Link key={to} to={to} aria-label={label} title={label} aria-current={active ? "page" : undefined} className={cn("flex h-16 items-center justify-center transition-colors", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                <span className={cn("flex h-11 w-16 items-center justify-center rounded-xl", active && "bg-accent")}><Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 1.8} /></span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function AppMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const item = "flex h-auto w-full justify-start gap-4 rounded-lg px-5 py-4 text-left";
  return (
    <>
      <BottomSheet open={open} onClose={onClose} title="메뉴">
        <div className="space-y-3">
          <Link to="/activities" className={cn(item, "bg-muted font-semibold")} onClick={onClose}>
            <Shirt className="h-5 w-5 text-primary" /> 뭐 입을 거야?
          </Link>
          <Link className={cn(item, "bg-muted font-semibold")} to="/settings" onClick={onClose}>
            <SettingsIcon className="h-5 w-5 text-primary" /> 설정
          </Link>
        </div>
      </BottomSheet>
    </>
  );
}
