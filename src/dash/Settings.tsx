import { useState } from "react";
import { useDemo } from "../state/store";
import { TREATMENTS, PROVIDERS } from "../data/demo";
import { Toggle, Modal, Reveal } from "../components/ui";
import { IcGear, IcSparkles, IcCheck, IcUsers, IcBell, IcRefresh } from "../components/icons";

const ACCENTS = [
  { name: "Champagne", hex: "#a67c42" },
  { name: "Bronze", hex: "#8c6a3f" },
  { name: "Rosewood", hex: "#9c5f52" },
  { name: "Sage", hex: "#75805f" },
  { name: "Harbor", hex: "#5f6f7e" },
  { name: "Graphite", hex: "#4a463f" },
];

export default function Settings() {
  const { s, updateBrand, toggleProvider, toggleService, setNotifPref, reset, toast } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  const b = s.brand;

  const input = "w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-accent transition-colors";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* demo customization */}
      <Reveal>
        <section className="rounded-2xl bg-espresso text-cream overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_300px] gap-6 p-6 lg:p-7">
            <div>
              <p className="text-[10px] tracking-[0.26em] uppercase font-bold text-goldsoft flex items-center gap-2">
                <IcSparkles className="w-4 h-4" /> Demo customization mode
              </p>
              <h3 className="font-display text-[26px] mt-2 leading-tight">Your brand. Your app.</h3>
              <p className="text-[12.5px] text-cream/60 mt-2 leading-relaxed max-w-lg">
                Show any med spa themselves inside the product. Rename the business, pick an accent,
                and watch the entire platform — client app included — rebrand instantly.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-cream/50 block mb-1.5">Business name</label>
                  <input value={b.name} onChange={(e) => updateBrand({ name: e.target.value }, true)} className="w-full rounded-lg bg-white/8 border border-white/12 px-3.5 py-2.5 text-[13px] font-semibold text-cream outline-none focus:border-goldsoft transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-cream/50 block mb-1.5">Location</label>
                  <input value={b.location} onChange={(e) => updateBrand({ location: e.target.value }, true)} className="w-full rounded-lg bg-white/8 border border-white/12 px-3.5 py-2.5 text-[13px] font-semibold text-cream outline-none focus:border-goldsoft transition-colors" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-cream/50 mb-2">Primary accent</p>
                <div className="flex flex-wrap gap-2.5">
                  {ACCENTS.map((a) => (
                    <button key={a.hex} onClick={() => { updateBrand({ accent: a.hex }); }}
                      className={`group flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 transition-all ${b.accent === a.hex ? "border-goldsoft bg-white/10" : "border-white/12 hover:border-white/30"}`}
                      aria-label={`Accent ${a.name}`}>
                      <span className="w-6 h-6 rounded-full border-2 border-white/20" style={{ background: a.hex }} />
                      <span className={`text-[11px] font-bold ${b.accent === a.hex ? "text-goldsoft" : "text-cream/60"}`}>{a.name}</span>
                      {b.accent === a.hex && <IcCheck className="w-3.5 h-3.5 text-goldsoft" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-cream/50 mb-2">Logo mark</p>
                <div className="flex gap-2.5">
                  {([["serif", "Serif italic"], ["geo", "Modern"], ["script", "Signature"]] as const).map(([id, label]) => (
                    <button key={id} onClick={() => { updateBrand({ mono: id }); }}
                      className={`rounded-lg border px-4 py-2.5 text-[11px] font-bold transition-all ${b.mono === id ? "border-goldsoft text-goldsoft bg-white/8" : "border-white/12 text-cream/55 hover:border-white/30"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => toast("White-label preview ready — flip to the client app to see the new brand")}
                className="mt-6 btn-gold rounded-full px-6 py-3 text-[12px] font-bold tracking-wide">
                Preview in client app
              </button>
            </div>

            <div className="justify-self-center hidden lg:block">
              <div className="rounded-[1.8rem] bg-[#120f0b] p-[6px] phone-shadow">
                <div className="rounded-[1.45rem] overflow-hidden bg-ivory w-[228px] h-[420px] flex flex-col">
                  <div className="pt-7 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: "color-mix(in srgb, var(--accent) 55%, transparent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
                        <span className="font-display italic text-[16px]" style={{ color: "var(--accent)" }}>{(b.name.trim()[0] || "G").toUpperCase()}</span>
                      </span>
                      <div>
                        <p className="font-display text-[12px] font-semibold tracking-wide uppercase text-ink leading-tight">{b.name}</p>
                        <p className="text-[7px] tracking-[0.28em] uppercase text-faint mt-0.5">Med Spa · {b.location.split(",")[0]}</p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl bg-charcoal text-cream p-3 relative overflow-hidden">
                      <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full opacity-25" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
                      <p className="text-[7px] tracking-[0.2em] uppercase font-bold" style={{ color: "var(--accent-soft)" }}>Upcoming</p>
                      <p className="font-display text-[15px] mt-1">HydraFacial</p>
                      <p className="text-[8px] text-cream/60 mt-0.5">Thursday · 2:30 PM</p>
                      <span className="mt-2 inline-block rounded-full px-3 py-1 text-[8px] font-bold text-cream" style={{ background: "linear-gradient(135deg, var(--accent-soft), var(--accent))" }}>View</span>
                    </div>
                    <div className="mt-3 rounded-xl border border-line bg-paper p-3">
                      <p className="text-[7px] tracking-[0.2em] uppercase font-bold text-faint">Rewards</p>
                      <p className="font-display text-[20px] text-ink mt-0.5">640 <span className="text-[9px] font-body font-semibold text-muted">pts</span></p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-linesoft overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "85%", background: "linear-gradient(90deg, var(--accent-soft), var(--accent))" }} />
                      </div>
                    </div>
                    <p className="text-center font-display italic text-[9.5px] text-muted mt-4">“{b.tagline}”</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-cream/40 mt-3">Live preview · updates as you type</p>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* business info */}
        <Reveal>
          <section className="rounded-xl border border-line bg-paper p-5 h-full">
            <p className="kicker mb-4 flex items-center gap-2"><IcGear className="w-4 h-4 text-accent" /> Business information</p>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="kicker block mb-1.5">Business name</label>
                <input value={b.name} onChange={(e) => updateBrand({ name: e.target.value }, true)} className={input} />
              </div>
              <div>
                <label className="kicker block mb-1.5">Phone</label>
                <input value={b.phone} onChange={(e) => updateBrand({ phone: e.target.value }, true)} className={input} />
              </div>
              <div>
                <label className="kicker block mb-1.5">Email</label>
                <input value={b.email} onChange={(e) => updateBrand({ email: e.target.value }, true)} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className="kicker block mb-1.5">Address</label>
                <input value={b.address} onChange={(e) => updateBrand({ address: e.target.value }, true)} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className="kicker block mb-1.5">Opening hours</label>
                <input value={b.hours} onChange={(e) => updateBrand({ hours: e.target.value }, true)} className={input} />
              </div>
            </div>
            <button onClick={() => updateBrand({})} className="mt-4 btn-gold rounded-full px-5 py-2.5 text-[11.5px] font-bold">Save &amp; sync everywhere</button>
          </section>
        </Reveal>

        {/* services & providers */}
        <Reveal delay={80}>
          <section className="rounded-xl border border-line bg-paper p-5 h-full">
            <p className="kicker mb-4 flex items-center gap-2"><IcUsers className="w-4 h-4 text-accent" /> Services &amp; providers</p>
            <p className="text-[11px] text-muted -mt-2 mb-3">Toggled-off items disappear from the client app's booking flow.</p>
            <div className="space-y-2 max-h-44 overflow-y-auto thin-scroll pr-1">
              {TREATMENTS.slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg bg-cream border border-line px-3.5 py-2">
                  <span className="text-[12px] font-semibold text-ink">{t.name}</span>
                  <Toggle on={!s.serviceOff.includes(t.id)} onChange={() => toggleService(t.id)} label={`Toggle ${t.name}`} />
                </div>
              ))}
            </div>
            <div className="space-y-2 mt-3">
              {PROVIDERS.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-cream border border-line px-3.5 py-2">
                  <span className="text-[12px] font-semibold text-ink">{p.name} <span className="text-faint font-medium">· {p.role}</span></span>
                  <Toggle on={!s.providerOff.includes(p.id)} onChange={() => toggleProvider(p.id)} label={`Toggle ${p.name}`} />
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* notifications */}
        <Reveal>
          <section className="rounded-xl border border-line bg-paper p-5">
            <p className="kicker mb-4 flex items-center gap-2"><IcBell className="w-4 h-4 text-accent" /> Notification preferences</p>
            <div className="space-y-2.5">
              {([
                ["Booking confirmations", "Sent the moment a client books", s.notifPrefs.bookings, "bookings"],
                ["Promotion delivery", "When campaigns go live", s.notifPrefs.promos, "promos"],
                ["Smart rebook reminders", "Automatic, cadence-based", s.notifPrefs.reminders, "reminders"],
              ] as [string, string, boolean, "bookings" | "promos" | "reminders"][]).map(([label, sub, on, key]) => (
                <div key={key} className="flex items-center justify-between rounded-lg bg-cream border border-line px-4 py-3">
                  <div>
                    <p className="text-[12.5px] font-bold text-ink">{label}</p>
                    <p className="text-[10.5px] text-muted mt-0.5">{sub}</p>
                  </div>
                  <Toggle on={on} onChange={(v) => setNotifPref(key, v)} label={label} />
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* danger zone */}
        <Reveal delay={80}>
          <section className="rounded-xl border border-bricktint bg-paper p-5">
            <p className="kicker mb-2 text-brick">Demo controls</p>
            <p className="text-[12px] text-muted leading-relaxed">
              Reset every booking, campaign, notification and brand change back to the original
              demonstration state. Perfect between sales calls.
            </p>
            <button onClick={() => setConfirmReset(true)} className="mt-4 rounded-full border border-brick text-brick px-5 py-2.5 text-[11.5px] font-bold hover:bg-brick hover:text-cream transition-colors flex items-center gap-2">
              <IcRefresh className="w-4 h-4" /> Reset demo data
            </button>
            <div className="mt-5 rounded-lg bg-cream border border-line px-4 py-3">
              <p className="text-[10.5px] text-faint leading-relaxed">
                No real payments, no real medical data, no external services. Everything runs locally
                in the browser and persists between reloads.
              </p>
            </div>
          </section>
        </Reveal>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)}>
        <div className="p-6 text-center">
          <h3 className="font-display text-xl text-ink">Reset the entire demo?</h3>
          <p className="text-[12.5px] text-muted mt-2 leading-relaxed">All demo activity — bookings, campaigns, points and branding — returns to its original state.</p>
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button onClick={() => setConfirmReset(false)} className="rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold">Keep going</button>
            <button onClick={() => { setConfirmReset(false); reset(); }} className="rounded-xl bg-brick text-cream py-3 text-[12.5px] font-bold hover:brightness-110">Reset demo</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
