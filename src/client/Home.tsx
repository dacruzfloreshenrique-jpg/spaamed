import { useState } from "react";
import { useDemo } from "../state/store";
import {
  fmtShort, fmtLong, daysSince, treatmentById, providerById, todayISO, greeting,
} from "../data/demo";
import type { Overlay } from "./ClientApp";
import { Modal, SlotPicker } from "../components/ui";
import {
  IcBell, IcCalendarPlus, IcRefresh, IcGift, IcTicket, IcArrowR, IcSparkles, IcPin, IcClock, IcStar,
} from "../components/icons";

export default function Home({ onBell, onOpen }: { onBell: () => void; onOpen: (o: Overlay) => void }) {
  const { s, emma, myAppts, unread, setTab, setPrefill, rescheduleAppt, toast } = useDemo();
  const [resched, setResched] = useState<string | null>(null);
  const [pick, setPick] = useState<{ date: string; time: string | null }>({ date: todayISO(), time: null });

  const upcoming = myAppts
    .filter((a) => (a.status === "confirmed" || a.status === "pending" || a.status === "checked-in") && a.date >= todayISO())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const next = upcoming[0];
  const nextT = next ? treatmentById(next.treatmentId) : undefined;

  const lastDone = [...myAppts].filter((a) => a.status === "completed").sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastT = lastDone ? treatmentById(lastDone.treatmentId) : undefined;
  const weeks = lastDone && emma.lastVisit ? Math.max(1, Math.round(daysSince(emma.lastVisit) / 7)) : 0;

  const featured = s.promotions.find((p) => p.kind === "percent" && p.treatmentId) ?? s.promotions[0];
  const featT = featured?.treatmentId ? treatmentById(featured.treatmentId) : undefined;

  const promo = (treatmentId?: string, promoId?: string, providerId?: string) => {
    setPrefill({ treatmentId, promoId, providerId });
    setTab("book");
  };

  return (
    <div className="space-y-5">
      {/* header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="kicker text-accent">{s.brand.location.split(",")[0]} · {s.brand.name}</p>
          <h1 className="font-display text-[27px] leading-tight text-ink mt-1.5">
            {greeting()}, Emma <span className="inline-block" style={{ animation: "pulseSoft 3s infinite" }}>✨</span>
          </h1>
          <p className="text-[13px] text-muted mt-0.5">Ready for your next glow-up?</p>
        </div>
        <button onClick={onBell} className="relative w-11 h-11 rounded-full border border-line bg-paper flex items-center justify-center text-ink hover:border-accent-soft transition-all hover:-translate-y-0.5" aria-label="Notifications">
          <IcBell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-accent text-cream text-[9.5px] font-bold flex items-center justify-center">{unread}</span>
          )}
        </button>
      </header>

      {/* review banner */}
      {s.pendingReview && (
        <button onClick={() => setTab("appointments")} className="w-full flex items-center gap-3 bg-sagetint border border-sage/30 rounded-xl px-4 py-3 text-left">
          <IcStar className="w-4 h-4 text-sage" />
          <span className="text-[12.5px] font-semibold text-ink flex-1">Your visit is complete — rate it to earn 50 pts</span>
          <IcArrowR className="w-4 h-4 text-sage" />
        </button>
      )}

      {/* next appointment */}
      <section className="relative overflow-hidden rounded-2xl bg-charcoal text-cream p-5">
        <div className="absolute -right-10 -top-14 w-44 h-44 rounded-full opacity-25" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
        <div className="absolute right-4 bottom-4 text-goldsoft/25"><IcSparkles className="w-14 h-14" /></div>
        {next && nextT ? (
          <>
            <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-goldsoft">Upcoming appointment</p>
            <h2 className="font-display text-[26px] mt-2 leading-tight">{nextT.name}</h2>
            <p className="text-[13px] text-cream/75 mt-1">{fmtLong(next.date)} · {next.time}</p>
            <p className="text-[12px] text-cream/60 mt-0.5">with {providerById(next.providerId)?.name}{next.status === "pending" && <span className="ml-2 text-[10px] font-bold bg-amber/25 text-[#ecc98f] rounded-full px-2 py-0.5 uppercase tracking-wider">Pending</span>}</p>
            <div className="flex gap-2.5 mt-5">
              <button onClick={() => setTab("appointments")} className="btn-gold rounded-full px-4.5 py-2.5 text-[12.5px] font-bold" style={{ paddingInline: 18 }}>
                View Appointment
              </button>
              <button onClick={() => { setResched(next.id); setPick({ date: next.date, time: next.time }); }}
                className="rounded-full border border-cream/25 px-[18px] py-2.5 text-[12.5px] font-bold text-cream/85 hover:border-goldsoft hover:text-goldsoft transition-colors">
                Reschedule
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-goldsoft">No upcoming visits</p>
            <h2 className="font-display text-[24px] mt-2">Your glow is waiting ✨</h2>
            <button onClick={() => setTab("book")} className="mt-4 btn-gold rounded-full px-5 py-2.5 text-[12.5px] font-bold">Book Appointment</button>
          </>
        )}
      </section>

      {/* quick actions */}
      <section>
        <p className="kicker mb-3">Quick actions</p>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { icon: <IcCalendarPlus className="w-5 h-5" />, label: "Book", fn: () => setTab("book") },
            { icon: <IcRefresh className="w-5 h-5" />, label: "Book Again", fn: () => lastDone && promo(lastDone.treatmentId, undefined, lastDone.providerId) },
            { icon: <IcGift className="w-5 h-5" />, label: "Rewards", fn: () => setTab("rewards") },
            { icon: <IcTicket className="w-5 h-5" />, label: "Promos", fn: () => onOpen("promotions") },
          ].map((q) => (
            <button key={q.label} onClick={q.fn}
              className="group flex flex-col items-center gap-2 rounded-xl border border-line bg-paper py-3.5 hover:border-accent-soft hover:-translate-y-1 transition-all duration-300 shadow-[0_2px_10px_-6px_rgba(36,31,25,0.25)]">
              <span className="w-10 h-10 rounded-full bg-accent-tint text-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{q.icon}</span>
              <span className="text-[10.5px] font-bold text-ink leading-tight">{q.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* exclusive offer */}
      {featured && (
        <section className="rounded-2xl border border-accent-soft bg-gradient-to-br from-paper via-goldtint/70 to-goldtint p-5 relative overflow-hidden">
          <div className="absolute -left-8 -bottom-12 w-36 h-36 rounded-full bg-accent/10" />
          <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-accent">Exclusive for you</p>
          <h3 className="font-display text-[23px] text-ink mt-2 leading-tight">{featured.offer}</h3>
          <p className="text-[12.5px] text-muted mt-1 italic font-display">“{featured.detail}”</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-[11px] text-faint">Valid through {fmtShort(featured.expires)}</span>
            <button onClick={() => promo(featured.treatmentId ?? undefined, featured.treatmentId ? featured.id : undefined)}
              className="btn-gold rounded-full px-5 py-2.5 text-[12px] font-bold tracking-wide">
              BOOK NOW
            </button>
          </div>
        </section>
      )}

      {/* rewards summary */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <div className="flex items-center justify-between">
          <p className="kicker">Your rewards</p>
          <button onClick={() => setTab("rewards")} className="text-[11px] font-bold text-accent flex items-center gap-1">View all <IcArrowR className="w-3 h-3" /></button>
        </div>
        <div className="flex items-end justify-between mt-3">
          <p className="font-display text-[34px] leading-none text-ink">
            {emma.points.toLocaleString()}
            <span className="text-[14px] text-muted font-body font-semibold ml-2">Glow Points</span>
          </p>
          <p className="text-[11px] text-muted font-semibold">{Math.max(0, 750 - emma.points)} to $50 off</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-linesoft overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (emma.points / 750) * 100)}%`, background: "linear-gradient(90deg, var(--accent-soft), var(--accent))", transition: "width 1s cubic-bezier(0.22,0.7,0.3,1)" }} />
        </div>
      </section>

      {/* smart rebooking */}
      {lastDone && lastT && weeks >= 3 && (
        <section className="rounded-2xl border border-line bg-cream p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 opacity-[0.14] pointer-events-none">
            <img src={lastT.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <p className="kicker text-accent">Ready for your next treatment?</p>
          <h3 className="font-display text-[21px] text-ink mt-2 max-w-[75%] leading-snug">
            It's been {weeks} weeks since your last {lastT.name}.
          </h3>
          <p className="text-[12px] text-muted mt-1">Recommended every {lastT.frequencyWeeks} weeks for lasting results.</p>
          <button onClick={() => promo(lastDone.treatmentId, undefined, lastDone.providerId)}
            className="mt-4 bg-charcoal text-cream rounded-full px-5 py-2.5 text-[12px] font-bold tracking-wide hover:bg-espresso transition-colors inline-flex items-center gap-2">
            BOOK AGAIN <IcArrowR className="w-3.5 h-3.5 text-goldsoft" />
          </button>
        </section>
      )}

      {/* membership teaser */}
      {!s.member && (
        <button onClick={() => onOpen("membership")} className="w-full text-left rounded-2xl border border-line bg-paper p-4.5 flex items-center gap-3.5 hover:border-accent-soft hover:-translate-y-0.5 transition-all duration-300" style={{ padding: 18 }}>
          <span className="w-11 h-11 rounded-full btn-gold flex items-center justify-center shrink-0"><IcSparkles className="w-5 h-5" /></span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-bold text-ink">Glow Membership · $149/mo</span>
            <span className="block text-[11.5px] text-muted mt-0.5">Monthly HydraFacial, 10% off skincare, priority booking.</span>
          </span>
          <IcArrowR className="w-4 h-4 text-accent" />
        </button>
      )}

      <footer className="text-center pt-2 pb-1">
        <p className="font-display italic text-muted text-[13px]">“{s.brand.tagline}”</p>
        <p className="text-[10px] text-faint mt-1.5 flex items-center justify-center gap-1"><IcPin className="w-3 h-3" /> {s.brand.address}</p>
        <p className="text-[10px] text-faint mt-0.5 flex items-center justify-center gap-1"><IcClock className="w-3 h-3" /> {s.brand.hours}</p>
        <p className="text-[10px] text-faint mt-3">Fictional demo experience — no real bookings or payments</p>
      </footer>

      {/* reschedule modal */}
      <Modal open={resched !== null} onClose={() => setResched(null)} sheet>
        <div className="p-6">
          <h3 className="font-display text-xl text-ink">Reschedule visit</h3>
          <p className="text-[12.5px] text-muted mt-1">Pick a new time that works for you.</p>
          <div className="mt-5">
            <SlotPicker date={pick.date} time={pick.time} onPick={(p) => setPick((x) => ({ date: p.date ?? x.date, time: p.time ?? x.time }))} />
          </div>
          <button
            disabled={!pick.time}
            onClick={() => { if (resched && pick.time) { rescheduleAppt(resched, pick.date, pick.time); setResched(null); toast("See you at your new time ✨"); } }}
            className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed">
            Confirm new time
          </button>
        </div>
      </Modal>
    </div>
  );
}
