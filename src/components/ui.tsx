import { useEffect, useRef, useState, type ReactNode } from "react";
import { TIME_SLOTS, slotUnavailable, addDaysISO, fmtShort, weekdayShort, todayISO } from "../data/demo";
import type { Brand } from "../data/demo";
import { useDemo } from "../state/store";
import { IcCheck, IcInfo, IcStar, IcX, IcChevL, IcChevR } from "./icons";

/* ---------------- motion ---------------- */

export function useReducedMotion(): boolean {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const fn = () => setR(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return r;
}

export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: {
  children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVis(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`${vis ? "rv-in" : "rv-pre"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function CountUp({ value, prefix = "", suffix = "", className = "", decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; className?: string; decimals?: number;
}) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (reduced) { setN(value); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const dur = 1100;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const ease = 1 - Math.pow(1 - p, 3);
          setN(value * ease);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);
  const shown = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US");
  return <span ref={ref} className={className}>{prefix}{shown}{suffix}</span>;
}

/* ---------------- primitives ---------------- */

export function Modal({ open, onClose, children, wide = false, sheet = false }: {
  open: boolean; onClose: () => void; children: ReactNode; wide?: boolean; sheet?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-[90] flex ${sheet ? "items-end justify-center" : "items-center justify-center p-4"}`}>
      <button aria-label="Close dialog" className="absolute inset-0 bg-charcoal/45 backdrop-blur-[2px] cursor-default" onClick={onClose} />
      <div
        role="dialog" aria-modal="true"
        className={`relative anim-pop bg-cream border border-line rounded-t-2xl ${sheet ? "w-full max-w-lg max-h-[86vh]" : `w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-2xl max-h-[88vh]`} overflow-y-auto thin-scroll shadow-[0_30px_80px_-20px_rgba(29,25,19,0.5)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} aria-label={label ?? "Toggle"}
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6.5 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-accent" : "bg-line"}`}
      style={{ height: 26 }}
    >
      <span className={`absolute top-[3px] w-5 h-5 rounded-full bg-paper shadow transition-all duration-300 ${on ? "left-[22px]" : "left-[3px]"}`} />
    </button>
  );
}

export function Seg<T extends string>({ options, value, onChange, dark = false, size = "md" }: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; dark?: boolean; size?: "sm" | "md";
}) {
  return (
    <div className={`inline-flex rounded-full p-1 gap-0.5 ${dark ? "bg-espresso/60 border border-white/10" : "bg-linesoft border border-line"}`}>
      {options.map((o) => (
        <button
          key={o.id} onClick={() => onChange(o.id)}
          className={`rounded-full font-semibold transition-all duration-300 ${size === "sm" ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-xs"} ${
            value === o.id
              ? dark ? "bg-goldsoft text-espresso shadow" : "bg-charcoal text-cream shadow"
              : dark ? "text-cream/60 hover:text-cream" : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stars({ value = 5, size = "w-4 h-4", interactive, onRate }: {
  value?: number; size?: string; interactive?: boolean; onRate?: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n} type="button" disabled={!interactive}
          onClick={() => onRate?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? "cursor-pointer transition-transform hover:scale-115" : "cursor-default"} ${n <= shown ? "text-accent-soft" : "text-line"}`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <IcStar className={size} />
        </button>
      ))}
    </span>
  );
}

export function EmptyState({ icon, title, sub, action }: { icon: ReactNode; title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-goldtint border border-line flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="text-sm text-muted mt-1.5 max-w-xs leading-relaxed">{sub}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SuccessCheck({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <svg viewBox="0 0 96 96" className="w-24 h-24">
        <circle cx="48" cy="48" r="42" fill="none" stroke="var(--accent)" strokeWidth="2.5"
          strokeDasharray="264" strokeDashoffset="264" strokeLinecap="round"
          style={{ animation: "drawStroke 0.9s cubic-bezier(0.6,0,0.3,1) 0.1s forwards" }} transform="rotate(-90 48 48)" />
        <path d="M31 49.5l11.5 11.5L65 38" fill="none" stroke="var(--accent)" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="52" strokeDashoffset="52"
          style={{ animation: "drawStroke 0.5s cubic-bezier(0.6,0,0.3,1) 0.85s forwards" }} />
      </svg>
      <p className="font-display text-2xl text-ink mt-3">{label}</p>
      <p className="text-sm text-muted mt-1.5">{sub}</p>
    </div>
  );
}

/* ---------------- brand ---------------- */

export function BrandMark({ brand, size = 40, light = false }: { brand: Brand; size?: number; light?: boolean }) {
  const letter = (brand.name.trim()[0] || "G").toUpperCase();
  const serif = brand.mono === "serif";
  const geo = brand.mono === "geo";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="inline-flex items-center justify-center rounded-full border transition-colors"
        style={{
          width: size, height: size,
          borderColor: "color-mix(in srgb, var(--accent) 55%, transparent)",
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        }}
      >
        <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62}>
          <text x="20" y={serif ? 27.5 : 26.5} textAnchor="middle"
            fontFamily={serif ? "Fraunces, Georgia, serif" : geo ? "Manrope, sans-serif" : "Fraunces, Georgia, serif"}
            fontStyle={serif ? "italic" : "normal"}
            fontWeight={geo ? 800 : 500} fontSize={serif ? 24 : 20}
            fill="var(--accent)">{letter}</text>
          <path d="M30.5 8.2l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1 1-2.6z" fill="var(--accent)" opacity="0.85" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display font-semibold tracking-[0.08em] uppercase ${light ? "text-cream" : "text-ink"}`} style={{ fontSize: size * 0.36 }}>
          {brand.name}
        </span>
        <span className={`block tracking-[0.3em] uppercase mt-1 ${light ? "text-cream/50" : "text-faint"}`} style={{ fontSize: size * 0.16 }}>
          Med Spa · Miami
        </span>
      </span>
    </span>
  );
}

/* ---------------- toast host ---------------- */

export function ToastHost() {
  const { toasts, dismissToast } = useDemo();
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] flex flex-col gap-2 items-center w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="anim-toast pointer-events-auto w-full flex items-center gap-3 bg-espresso text-cream rounded-xl pl-3.5 pr-2 py-2.5 shadow-[0_18px_40px_-12px_rgba(29,25,19,0.55)] border border-white/10">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${t.kind === "ok" ? "bg-accent/25 text-goldsoft" : t.kind === "warn" ? "bg-brick/25 text-[#e0a196]" : "bg-white/10 text-cream/80"}`}>
            {t.kind === "warn" ? <IcInfo className="w-4 h-4" /> : <IcCheck className="w-4 h-4" />}
          </span>
          <p className="text-[13px] font-medium leading-snug flex-1">{t.text}</p>
          <button onClick={() => dismissToast(t.id)} className="p-1.5 text-cream/50 hover:text-cream" aria-label="Dismiss">
            <IcX className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- slot picker ---------------- */

export function SlotPicker({ date, time, onPick, days = 14 }: {
  date: string; time: string | null; onPick: (d: { date?: string; time?: string }) => void; days?: number;
}) {
  const dates = Array.from({ length: days }, (_, i) => addDaysISO(i));
  return (
    <div>
      <p className="kicker mb-2.5">Select a date</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {dates.map((d) => {
          const active = d === date;
          const today = d === todayISO();
          return (
            <button
              key={d} onClick={() => onPick({ date: d })}
              className={`shrink-0 w-14 rounded-xl border py-2.5 flex flex-col items-center gap-0.5 transition-all duration-200 ${
                active ? "bg-charcoal text-cream border-charcoal shadow-md -translate-y-0.5" : "bg-paper border-line hover:border-accent-soft hover:-translate-y-0.5"
              }`}
            >
              <span className={`text-[10px] font-bold tracking-widest uppercase ${active ? "text-goldsoft" : "text-faint"}`}>
                {today ? "Today" : weekdayShort(d)}
              </span>
              <span className="text-sm font-bold">{fmtShort(d).split(" ")[1]}</span>
              <span className={`text-[10px] ${active ? "text-cream/60" : "text-muted"}`}>{fmtShort(d).split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
      <p className="kicker mt-5 mb-2.5">Available times</p>
      <div className="grid grid-cols-4 gap-2">
        {TIME_SLOTS.map((t) => {
          const off = slotUnavailable(date, t);
          const active = t === time;
          return (
            <button
              key={t} disabled={off} onClick={() => onPick({ time: t })}
              className={`rounded-lg border py-2 text-xs font-semibold transition-all duration-200 ${
                off
                  ? "border-linesoft text-faint/60 line-through bg-linesoft/40 cursor-not-allowed"
                  : active
                    ? "border-accent bg-accent-tint text-accent shadow-sm"
                    : "border-line bg-paper hover:border-accent-soft hover:text-accent"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-faint mt-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-line inline-block" /> Struck-through times are already booked
      </p>
    </div>
  );
}

/* ---------------- mini phone (builder previews) ---------------- */

export function MiniPhone({ children, title = "Client app preview" }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="kicker mb-3">{title}</p>
      <div className="w-[248px] rounded-[2.2rem] bg-espresso p-[7px] phone-shadow">
        <div className="relative rounded-[1.85rem] bg-ivory overflow-hidden h-[470px] flex flex-col">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-espresso z-10" />
          <div className="pt-8 flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- misc ---------------- */

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? "w-6 bg-accent" : i < current ? "w-3 bg-accent/50" : "w-3 bg-line"}`} />
      ))}
    </div>
  );
}

export function ChevronNav({ onBack, title, right }: { onBack?: () => void; title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 rounded-full border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:border-accent-soft transition-colors" aria-label="Go back">
          <IcChevL className="w-4 h-4" />
        </button>
      )}
      <h2 className="font-display text-xl text-ink flex-1 truncate">{title}</h2>
      {right}
    </div>
  );
}

export { IcChevR };
