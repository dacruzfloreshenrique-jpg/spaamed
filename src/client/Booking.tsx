import { useEffect, useMemo, useState } from "react";
import { useDemo } from "../state/store";
import {
  TREATMENTS, CATEGORIES, PROVIDERS, BEFORE_AFTER, fmtLong, money, treatmentById, providerById, todayISO,
} from "../data/demo";
import type { Treatment } from "../data/demo";
import { SlotPicker, StepDots, SuccessCheck, ChevronNav } from "../components/ui";
import { IcSearch, IcClock, IcCheck, IcArrowR, IcArrowL, IcPin, IcPhone, IcStar, IcCalendar } from "../components/icons";

type Step = "browse" | "detail" | "provider" | "datetime" | "summary" | "success";

export default function Booking() {
  const { s, setTab, toast } = useDemo();
  const { book } = useDemo();
  const [step, setStep] = useState<Step>("browse");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState<string | null>(null);
  const [promoId, setPromoId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [bookedInfo, setBookedInfo] = useState<{ name: string; date: string; time: string } | null>(null);

  // consume prefill (Book Again / promo deep-link)
  useEffect(() => {
    const pf = s.prefill;
    if (!pf) return;
    const t = pf.treatmentId ? treatmentById(pf.treatmentId) : null;
    if (t) {
      setTreatment(t);
      if (pf.providerId) { setProviderId(pf.providerId); setStep("datetime"); }
      else setStep("provider");
      if (pf.promoId) setPromoId(pf.promoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.prefill]);

  const visibleProviders = useMemo(
    () => PROVIDERS.filter((p) => !s.providerOff.includes(p.id)),
    [s.providerOff]
  );

  const treatments = TREATMENTS.filter(
    (t) => (cat === "All" || t.category === cat) &&
      (q === "" || t.name.toLowerCase().includes(q.toLowerCase())) &&
      !s.serviceOff.includes(t.id)
  );

  const promo = promoId ? s.promotions.find((p) => p.id === promoId) : null;
  const discount = promo && treatment && promo.kind === "percent" && promo.treatmentId === treatment.id
    ? Math.round(treatment.price * 0.2) : 0;

  const stepIdx = ["browse", "provider", "datetime", "summary"].indexOf(step);

  const back = () => {
    if (step === "detail") setStep("browse");
    else if (step === "provider") { if (s.prefill?.providerId) { setStep("browse"); } else setStep("detail"); }
    else if (step === "datetime") setStep("provider");
    else if (step === "summary") setStep("datetime");
  };

  const confirm = () => {
    if (!treatment || !providerId || !time) return;
    setProcessing(true);
    window.setTimeout(() => {
      book({ treatmentId: treatment.id, providerId, date, time, promoId });
      setBookedInfo({ name: treatment.name, date, time });
      setProcessing(false);
      setStep("success");
    }, 950);
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* ------------ browse ------------ */}
      {step === "browse" && (
        <div>
          <h1 className="font-display text-[25px] text-ink">Book a treatment</h1>
          <p className="text-[12.5px] text-muted mt-0.5">{s.brand.name} · {s.brand.location}</p>

          <label className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 focus-within:border-accent-soft transition-colors">
            <IcSearch className="w-4 h-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search treatments…"
              className="bg-transparent outline-none text-[13px] flex-1 placeholder:text-faint" aria-label="Search treatments" />
          </label>

          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar -mx-1 px-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11.5px] font-bold transition-all ${cat === c ? "bg-charcoal text-cream border-charcoal" : "bg-paper border-line text-muted hover:border-accent-soft"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {treatments.length === 0 && (
              <p className="text-center text-sm text-muted py-10">No treatments match your search.</p>
            )}
            {treatments.map((t, i) => (
              <article key={t.id} className="anim-fade-up group flex gap-3.5 rounded-2xl border border-line bg-paper p-3 hover:border-accent-soft hover:-translate-y-0.5 transition-all duration-300 shadow-[0_2px_14px_-8px_rgba(36,31,25,0.3)]" style={{ animationDelay: `${i * 45}ms` }}>
                <div className="w-[86px] h-[86px] rounded-xl overflow-hidden shrink-0 bg-linesoft relative">
                  <img src={t.image} alt={t.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {t.popular && <span className="absolute top-1.5 left-1.5 text-[8.5px] font-bold tracking-wider uppercase bg-espresso/80 text-goldsoft rounded-full px-2 py-0.5">Popular</span>}
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-[16.5px] text-ink leading-tight">{t.name}</h3>
                    <span className="text-[14px] font-extrabold text-accent whitespace-nowrap">{money(t.price)}</span>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5 leading-snug">{t.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-faint font-semibold">
                    <span className="flex items-center gap-1"><IcClock className="w-3 h-3" />{t.duration} min</span>
                    <span className="w-1 h-1 rounded-full bg-line" />{t.category}
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <button onClick={() => { setTreatment(t); setStep("detail"); }} className="text-[11px] font-bold text-muted border border-line rounded-full px-3.5 py-1.5 hover:text-ink hover:border-accent-soft transition-colors">View Details</button>
                    <button onClick={() => { setTreatment(t); setPromoId(null); setStep("provider"); }} className="text-[11px] font-bold btn-gold rounded-full px-3.5 py-1.5">Book</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ------------ detail ------------ */}
      {step === "detail" && treatment && (
        <div>
          <ChevronNav onBack={back} title={treatment.name} />
          <div className="rounded-2xl overflow-hidden relative h-48 bg-linesoft">
            <img src={treatment.image} alt={treatment.name} className="w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 bg-espresso/80 text-cream text-[11px] font-bold rounded-full px-3 py-1.5">{money(treatment.price)} · {treatment.duration} min</span>
          </div>
          <p className="text-[13px] text-muted leading-relaxed mt-4">{treatment.long}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl border border-line bg-paper p-3.5">
              <p className="kicker mb-2">Benefits</p>
              <ul className="space-y-1.5">
                {treatment.benefits.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-[11.5px] text-ink"><IcCheck className="w-3.5 h-3.5 text-accent shrink-0 mt-[1px]" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-paper p-3.5">
              <p className="kicker mb-2">What to expect</p>
              <ol className="space-y-1.5">
                {treatment.expect.slice(0, 4).map((b, i) => (
                  <li key={b} className="flex items-start gap-1.5 text-[11.5px] text-ink"><span className="text-accent font-bold text-[10px] mt-[2px]">{i + 1}.</span>{b}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-goldtint border border-accent-soft px-4 py-3 mt-3">
            <IcCalendar className="w-4 h-4 text-accent shrink-0" />
            <p className="text-[11.5px] text-ink"><strong>Recommended frequency:</strong> every {treatment.frequencyWeeks} week{treatment.frequencyWeeks > 1 ? "s" : ""} for best results.</p>
          </div>

          <p className="kicker mt-5 mb-2.5">Before &amp; after</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[{ src: BEFORE_AFTER.before, label: "Before" }, { src: BEFORE_AFTER.after, label: "After" }].map((b) => (
              <figure key={b.label} className="relative rounded-xl overflow-hidden h-32 bg-linesoft">
                <img src={b.src} alt={`${treatment.name} ${b.label.toLowerCase()}`} loading="lazy" className="w-full h-full object-cover" />
                <figcaption className="absolute bottom-2 left-2 bg-espresso/80 text-cream text-[9.5px] font-bold tracking-widest uppercase rounded-full px-2.5 py-1">{b.label}</figcaption>
              </figure>
            ))}
          </div>
          <p className="text-[10px] text-faint mt-2">Illustrative demo imagery. Individual results vary.</p>

          <button onClick={() => setStep("provider")} className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold tracking-wide">BOOK THIS TREATMENT</button>
        </div>
      )}

      {/* ------------ provider ------------ */}
      {step === "provider" && treatment && (
        <div className="flex-1 flex flex-col">
          <ChevronNav onBack={back} title="Choose your provider" />
          <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 mb-4">
            <img src={treatment.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">{treatment.name}</p>
              <p className="text-[11px] text-muted">{money(treatment.price)} · {treatment.duration} min</p>
            </div>
            <button onClick={() => setStep("detail")} className="text-[11px] font-bold text-accent">Change</button>
          </div>
          <div className="space-y-2.5">
            {visibleProviders.map((p) => {
              const active = providerId === p.id;
              return (
                <button key={p.id} onClick={() => setProviderId(p.id)}
                  className={`w-full flex items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all duration-300 ${active ? "border-accent bg-accent-tint shadow-sm" : "border-line bg-paper hover:border-accent-soft hover:-translate-y-0.5"}`}>
                  <span className="w-12 h-12 rounded-full flex items-center justify-center text-cream font-display text-lg italic shrink-0" style={{ background: p.hue }}>
                    {p.name.split(" ").map((x) => x[0]).join("")}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13.5px] font-bold text-ink">{p.name}</span>
                    <span className="block text-[11px] text-muted">{p.role}</span>
                    <span className="flex items-center gap-1 mt-1 text-[10.5px] font-bold text-accent">
                      <IcStar className="w-3 h-3" /> {p.rating.toFixed(1)} <span className="text-faint font-semibold">· {p.years} yrs</span>
                    </span>
                  </span>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? "border-accent bg-accent text-cream" : "border-line"}`}>
                    {active && <IcCheck className="w-3 h-3" />}
                  </span>
                </button>
              );
            })}
          </div>
          <button disabled={!providerId} onClick={() => setStep("datetime")}
            className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed">
            CONTINUE
          </button>
        </div>
      )}

      {/* ------------ date & time ------------ */}
      {step === "datetime" && treatment && (
        <div className="flex-1 flex flex-col">
          <ChevronNav onBack={back} title="Date & time" />
          <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 mb-4">
            <img src={treatment.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">{treatment.name}</p>
              <p className="text-[11px] text-muted">with {providerById(providerId ?? "")?.name ?? "—"}</p>
            </div>
            {promo && <span className="text-[10px] font-bold text-sage bg-sagetint rounded-full px-2.5 py-1">{promo.offer}</span>}
          </div>
          <SlotPicker date={date} time={time} onPick={(p) => { if (p.date) { setDate(p.date); setTime(null); } if (p.time) setTime(p.time); }} />
          <button disabled={!time} onClick={() => setStep("summary")}
            className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed">
            CONTINUE
          </button>
        </div>
      )}

      {/* ------------ summary ------------ */}
      {step === "summary" && treatment && providerId && time && (
        <div className="flex-1 flex flex-col">
          <ChevronNav onBack={back} title="Booking summary" />
          <div className="rounded-2xl border border-line bg-paper overflow-hidden">
            <div className="p-4 flex gap-3.5 border-b border-linesoft">
              <img src={treatment.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <p className="font-display text-lg text-ink leading-tight">{treatment.name}</p>
                <p className="text-[11.5px] text-muted mt-0.5">{treatment.desc}</p>
              </div>
            </div>
            <dl className="p-4 space-y-2.5 text-[12.5px]">
              {[
                ["Provider", providerById(providerId)?.name ?? ""],
                ["Date", fmtLong(date)],
                ["Time", time],
                ["Duration", `${treatment.duration} minutes`],
                ["Location", s.brand.address],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-bold text-ink text-right">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-2.5 border-t border-linesoft">
                <dt className="text-muted">Price</dt>
                <dd className="font-extrabold text-ink text-right">
                  {discount > 0 && <span className="text-faint line-through font-semibold mr-2">{money(treatment.price)}</span>}
                  <span className="text-accent">{money(treatment.price - discount)}</span>
                </dd>
              </div>
              {discount > 0 && promo && (
                <p className="text-[10.5px] text-sage font-bold text-right -mt-1">{promo.offer} applied ✨</p>
              )}
            </dl>
          </div>
          <p className="text-[10.5px] text-faint mt-3 flex items-center gap-1.5"><IcPhone className="w-3 h-3" /> Questions? Call {s.brand.phone}</p>
          <button onClick={confirm} disabled={processing}
            className="mt-4 w-full btn-gold rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:opacity-70 flex items-center justify-center gap-2">
            {processing ? (<><span className="w-4 h-4 rounded-full border-2 border-cream/40 border-t-cream anim-spin-slow" /> Confirming…</>) : "CONFIRM APPOINTMENT"}
          </button>
        </div>
      )}

      {/* ------------ success ------------ */}
      {step === "success" && bookedInfo && (
        <div className="flex-1 flex flex-col justify-center py-6">
          <SuccessCheck label="You're booked! ✨" sub="Your appointment has been confirmed." />
          <div className="rounded-xl border border-line bg-paper px-5 py-4 mt-4 text-center">
            <p className="font-display text-lg text-ink">{bookedInfo.name}</p>
            <p className="text-[12px] text-muted mt-0.5">{fmtLong(bookedInfo.date)} · {bookedInfo.time}</p>
            <p className="text-[10.5px] text-accent font-bold mt-2">+100 Glow Points after your visit</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button onClick={() => toast("Added to your calendar (demo)", "info")} className="rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold text-ink hover:border-accent-soft transition-colors">Add to Calendar</button>
            <button onClick={() => setTab("appointments")} className="btn-gold rounded-xl py-3 text-[12.5px] font-bold">View Appointment</button>
          </div>
          <button onClick={() => { setStep("browse"); setTreatment(null); setProviderId(null); setTime(null); setPromoId(null); }}
            className="mt-3 text-[12px] font-semibold text-muted hover:text-ink py-2">Book another treatment</button>
        </div>
      )}

      {/* progress */}
      {stepIdx >= 1 && step !== "success" && (
        <div className="sticky bottom-0 pt-4 pb-1 bg-gradient-to-t from-ivory via-ivory/90 to-transparent">
          <StepDots total={4} current={stepIdx} />
        </div>
      )}
      {step === "browse" && (
        <div className="flex items-center justify-center gap-1.5 pt-5 text-[10.5px] text-faint">
          <IcPin className="w-3 h-3" /> {s.brand.hours}
        </div>
      )}
      {step !== "browse" && step !== "success" && (
        <button onClick={back} className="flex items-center justify-center gap-1.5 mx-auto mt-3 text-[11.5px] font-bold text-muted hover:text-ink">
          <IcArrowL className="w-3.5 h-3.5" /> Back
        </button>
      )}
    </div>
  );
}
