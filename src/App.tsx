import { useState } from "react";
import { DemoProvider, useDemo } from "./state/store";
import type { Mode } from "./data/demo";
import { BrandMark, ToastHost } from "./components/ui";
import { IcSpark, IcInfo, IcRefresh, IcCheck, IcArrowR } from "./components/icons";
import ClientApp from "./client/ClientApp";
import Dashboard from "./dash/Dashboard";

const TICKER = ["Book more", "Bring clients back", "Build loyalty", "Increase client value", "Grow revenue"];

const JOURNEY: { side: string; steps: string[] }[] = [
  {
    side: "Client app",
    steps: [
      "Book a HydraFacial (Home → Book)",
      "Use Book Again on a past visit",
      "Book with the 20% Summer Glow offer",
      "Redeem a Glow Reward",
      "Share referral code EMMA50",
    ],
  },
  {
    side: "Business dashboard",
    steps: [
      "Watch the new booking appear in Overview",
      "Mark the appointment completed → points award",
      "See the client enter Ready to Rebook",
      "Create a promotion → appears in the app",
      "Send a push → appears in the notification center",
    ],
  },
];

export default function App() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}

function Shell() {
  const { s, setMode, reset } = useDemo();
  const [guide, setGuide] = useState(false);

  return (
    <div style={{ "--accent": s.brand.accent } as React.CSSProperties} className="min-h-dvh text-ink">
      {/* ambient background */}
      <div className="fixed inset-0 -z-10 bg-ivory overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)", animation: "driftA 26s ease-in-out infinite" }} />
        <div className="absolute -bottom-[25%] -right-[12%] w-[60vw] h-[60vw] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, #e9e0cc, transparent 62%)", animation: "driftB 32s ease-in-out infinite" }} />
        <div className="absolute inset-y-0 w-[38%] opacity-[0.05]"
          style={{ background: "linear-gradient(100deg, transparent, var(--accent-soft), transparent)", animation: "sheenMove 14s linear infinite" }} />
        <div className="absolute inset-0 grain opacity-[0.05]" />
      </div>

      {/* header */}
      <header className="sticky top-0 z-[70] bg-ivory/85 backdrop-blur-md border-b border-line">
        <div className="max-w-[1560px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-3">
          <a href="#" onClick={(e) => e.preventDefault()} className="shrink-0">
            <BrandMark brand={s.brand} size={36} />
          </a>
          <p className="hidden xl:block text-[11px] text-faint italic font-display leading-tight max-w-[150px]">“{s.brand.tagline}”</p>

          {/* mode switch */}
          <div className="mx-auto flex items-center rounded-full border border-line bg-paper p-1 shadow-sm" role="tablist" aria-label="Demo view">
            {([["client", "Client App"], ["dashboard", "Business Dashboard"]] as [Mode, string][]).map(([m, label]) => {
              const active = s.mode === m;
              return (
                <button key={m} role="tab" aria-selected={active} onClick={() => setMode(m)}
                  className={`rounded-full px-3.5 sm:px-5 py-2 text-[11.5px] sm:text-[12.5px] font-bold transition-all duration-300 ${active ? "bg-charcoal text-cream shadow" : "text-muted hover:text-ink"}`}>
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setGuide((g) => !g)}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-2 text-[11.5px] font-bold text-ink hover:border-accent-soft transition-colors">
              <IcInfo className="w-4 h-4 text-accent" /> Demo guide
            </button>
            <button onClick={reset} title="Reset demo data"
              className="w-9 h-9 rounded-full border border-line bg-paper flex items-center justify-center text-muted hover:text-accent hover:border-accent-soft transition-colors" aria-label="Reset demo data">
              <IcRefresh className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ticker */}
      <div className="border-b border-line/70 bg-cream/70 overflow-hidden py-1.5" aria-hidden="true">
        <div className="flex whitespace-nowrap" style={{ animation: "marqueeX 36s linear infinite", width: "max-content" }}>
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center">
              {TICKER.map((t) => (
                <span key={`${rep}-${t}`} className="flex items-center text-[9.5px] font-extrabold tracking-[0.28em] uppercase text-faint">
                  <span className="px-5">{t}</span>
                  <IcSpark className="w-2.5 h-2.5 text-accent-soft" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* demo guide popover */}
      {guide && (
        <div className="fixed inset-0 z-[75]">
          <button className="absolute inset-0 bg-espresso/30" onClick={() => setGuide(false)} aria-label="Close guide" />
          <div className="absolute right-4 top-20 w-[340px] max-w-[calc(100vw-2rem)] bg-cream border border-line rounded-2xl shadow-[0_30px_70px_-20px_rgba(29,25,19,0.45)] anim-pop p-5">
            <p className="kicker text-accent">Sales demo journey</p>
            <h3 className="font-display text-xl text-ink mt-1.5">The loop that sells itself</h3>
            {JOURNEY.map((j) => (
              <div key={j.side} className="mt-4">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-faint mb-2">{j.side}</p>
                <ul className="space-y-1.5">
                  {j.steps.map((st, i) => (
                    <li key={st} className="flex items-start gap-2.5 text-[12px] text-ink">
                      <span className="w-5 h-5 rounded-full bg-accent-tint text-accent text-[9.5px] font-extrabold flex items-center justify-center shrink-0 mt-[1px]">{i + 1}</span>
                      {st}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="mt-4 text-[10.5px] text-muted leading-relaxed border-t border-linesoft pt-3 flex items-center gap-1.5">
              <IcCheck className="w-3.5 h-3.5 text-sage shrink-0" />
              Every action is real inside the demo — both sides update instantly.
            </p>
          </div>
        </div>
      )}

      {/* content */}
      <main key={s.mode} className="anim-fade-up">
        {s.mode === "client" ? <ClientApp /> : <Dashboard />}
      </main>

      {/* footer */}
      <footer className="border-t border-line mt-10 bg-cream/60">
        <div className="max-w-[1560px] mx-auto px-4 lg:px-6 py-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <BrandMark brand={s.brand} size={30} />
          <p className="text-[11px] text-muted flex-1 min-w-[220px]">
            More than an app — a direct connection between your med spa and your clients.
            <span className="text-faint"> Built to book more, bring clients back and grow client value.</span>
          </p>
          <p className="text-[10px] text-faint flex items-center gap-1.5">
            <IcSpark className="w-3 h-3 text-accent-soft" />
            Interactive sales demonstration · all data fictional · no real payments or medical records
          </p>
        </div>
      </footer>

      <ToastHost />

      {/* floating switch hint on mobile */}
      {s.mode === "client" && (
        <button onClick={() => setMode("dashboard")}
          className="lg:hidden fixed bottom-[86px] right-4 z-[60] btn-gold rounded-full px-4 py-2.5 text-[11px] font-bold shadow-lg flex items-center gap-1.5 anim-pop">
          Business side <IcArrowR className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
