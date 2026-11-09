import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, Loader2, Menu, SendHorizontal, X, AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_MAX } from "@/lib/constants";

/* Button */
type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground shadow-soft hover:brightness-105",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-95",
  ghost: "text-foreground hover:bg-muted",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  danger: "bg-destructive/10 text-destructive hover:bg-destructive/15",
};
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" | "icon" }) {
  const sizes = { sm: "h-9 px-4 text-sm", md: "h-11 px-5", lg: "h-14 px-6 text-lg", icon: "h-11 w-11" };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

/* Card */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-3xl bg-card p-5 text-card-foreground shadow-soft", className)}>{children}</div>;
}

/* Chip */
export function Chip({
  selected,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95",
        selected
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

/* Header */
export function Header({
  title,
  back,
  onMenu,
  right,
}: {
  title?: string;
  back?: boolean;
  onMenu?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-background/90 px-4 backdrop-blur">
      <div className="w-11">
        {back && (
          <Link to="/" aria-label="뒤로" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
      </div>
      {title && <h1 className="font-display text-lg">{title}</h1>}
      <div className="flex w-11 justify-end">
        {right}
        {onMenu && (
          <Button variant="ghost" size="icon" aria-label="메뉴" onClick={onMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}

/* Modal */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-6 animate-in fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-3xl bg-popover p-6 text-center text-popover-foreground shadow-soft animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="mb-2 font-display text-xl">{title}</h2>}
        {children}
        <Button className="mt-5 w-full" onClick={onClose}>확인</Button>
      </div>
    </div>
  );
}

/* BottomSheet */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-overlay animate-in fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-t-3xl bg-popover p-6 pb-10 text-popover-foreground animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">{title}</h2>
          <Button variant="ghost" size="icon" aria-label="닫기" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ChatInput */
export function ChatInput({
  value,
  onChange,
  onSend,
  onAttach,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <form
      className="flex items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-soft"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      {onAttach && (
        <Button type="button" variant="ghost" size="icon" aria-label="이미지 첨부" onClick={onAttach}>
          <ImagePlus className="h-5 w-5" />
        </Button>
      )}
      <textarea
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={placeholder}
        className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-base outline-none placeholder:text-muted-foreground"
      />
      <Button type="submit" size="icon" aria-label="전송" disabled={disabled || !value.trim()}>
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  );
}

/* ImageUploader */
export interface LocalImage {
  id: string;
  url: string;
  name: string;
}
export function ImageUploader({
  images,
  onChange,
  openSignal,
}: {
  images: LocalImage[];
  onChange: (imgs: LocalImage[]) => void;
  openSignal?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (openSignal) ref.current?.click();
  }, [openSignal]);
  const remaining = IMAGE_MAX - images.length;
  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).slice(0, remaining);
          onChange([
            ...images,
            ...files.map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name })),
          ]);
          e.target.value = "";
        }}
      />
      <div className="flex gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-2xl bg-muted">
            <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="이미지 삭제"
              onClick={() => {
                URL.revokeObjectURL(img.url);
                onChange(images.filter((i) => i.id !== img.id));
              }}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-overlay text-primary-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border text-xs text-muted-foreground hover:bg-muted"
          >
            <ImagePlus className="h-5 w-5" />
            {images.length}/{IMAGE_MAX}
          </button>
        )}
      </div>
    </div>
  );
}

/* Toggle row */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-7 w-12 shrink-0 rounded-full transition", checked ? "bg-primary" : "bg-muted")}
    >
      <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card shadow transition-all", checked ? "left-6" : "left-1")} />
    </button>
  );
}

/* States */
export function Loading({ label = "잠시만요..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>{label}</p>
    </div>
  );
}
export function ErrorState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

export function SoonBadge() {
  return <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">준비 중</span>;
}
