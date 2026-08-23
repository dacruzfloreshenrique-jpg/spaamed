import { useMemo, useState } from "react";
import { useDemo } from "../state/store";
import {
  BASE_METRICS, eligibleForRebook, daysSince, money, fmtShort, weekdayShort,
  treatmentById, rebookWindow, todayISO,
} from "../data/demo";
import type { Client } from "../data/demo";
import { CountUp, Reveal } from "../components/ui";
import { IcRefresh, IcBell, IcCheck, IcUsers, IcHeart, IcTicket, IcMegaphone } from "../components/icons";

type InactiveFilter = "30" | "60" | "90" | "vip";

export default function Rebooking() {
  const { s, sendReminder, toast, addPromotion } = useDemo();
  const [filter, setFilter] = useState<InactiveFilter>("60");
  const [selected, setSelected] = useState<string[]>([]);

  const ready = useMemo(
    () => s.clients.filter(eligibleForRebook).sort((a, b) => b.ltv - a.ltv),
    [s.clients]
  );

  const inactive = useMemo(() => {
    return s.clients
      .filter((c) => !s.appointments.some((a) => a.clientId === c.id && ["confirmed", "pending"].includes(a.status) && a.date >= todayISO()))
      .filter((c) => {
        const d = c.lastVisit ? daysSince(c.lastVisit) : 999;
        if (filter === "vip") return c.status === "VIP" && d >= 30;
        return d >= parseInt(filter, 10);
      })
      .sort((a, b) => b.ltv - a.ltv);
  }, [s.clients, s.appointments, filter]);

  const toggleSel = (id: string) =>
    setSelected((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]));

  const createWinBack = () => {
    addPromotion({
      kind: "dollars", title: "We Miss You ✨", offer: "$50 OFF your next visit",
      detail: "Because your glow is never out of style.", expires: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
      audience: `${selected.length} selected inactive clients`, treatmentId: null,
    });
    setSelected([]);
  };

  return (
    <div className="space-y-8">
      {/* headline stats */}
      <div className="grid md:grid-cols-3 gap-3.5">
        <Reveal>
          <div className="rounded-xl bg-charcoal text-cream p-5 relative overflow-hidden">
            <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full opacity-25" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
            <IcRefresh className="w-5 h-5 text-goldsoft" />
            <p className="font-display text-[38px] mt-2 leading-none"><CountUp value={BASE_METRICS.rebookTotal} /></p>
            <p className="text-[11.5px] text-cream/60 font-semibold mt-1.5">Total rebooking opportunities</p>
            <p className="text-[9.5px] text-cream/35 mt-2">Demo metric · includes all treatments</p>
          </div>
        </Reveal>
        <Reveal delay={70}>
          <div className="rounded-xl border border-line bg-paper p-5">
            <IcUsers className="w-5 h-5 text-accent" />
            <p className="font-display text-[38px] text-ink mt-2 leading-none"><CountUp value={ready.length} /></p>
            <p className="text-[11.5px] text-muted font-semibold mt-1.5">In the recommended window right now</p>
            <p className="text-[9.5px] text-faint mt-2">Live · updates as visits complete</p>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="rounded-xl border border-line bg-paper p-5">
            <IcHeart className="w-5 h-5 text-accent" />
            <p className="font-display text-[38px] text-ink mt-2 leading-none"><CountUp value={BASE_METRICS.potentialReturns} /></p>
            <p className="text-[11.5px] text-muted font-semibold mt-1.5">Potential return visits</p>
            <p className="text-[9.5px] text-faint mt-2">Estimated demo metric — not a guarantee</p>
          </div>
        </Reveal>
      </div>

      {/* ready to rebook */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="kicker text-accent">Smart rebooking</p>
            <h3 className="font-display text-[24px] text-ink mt-1">Clients ready to rebook</h3>
          </div>
          <p className="text-[11px] text-faint hidden sm:block">Based on each treatment's ideal frequency</p>
        </div>
        {ready.length === 0 ? (
          <div className="rounded-xl border border-line bg-paper py-12 text-center">
            <IcRefresh className="w-8 h-8 text-line mx-auto" />
            <p className="font-display text-lg text-ink mt-3">No clients ready to rebook</p>
            <p className="text-[12px] text-muted mt-1">Complete a visit and its owner will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {ready.map((c, i) => <RebookCard key={c.id} c={c} i={i} onRemind={() => sendReminder(c.id)} />)}
          </div>
        )}
      </section>

      {/* win-back */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <p className="kicker text-accent">Clients we miss</p>
            <h3 className="font-display text-[24px] text-ink mt-1">Win-back center</h3>
          </div>
          <div className="flex gap-1.5">
            {([["30", "30+ days"], ["60", "60+ days"], ["90", "90+ days"], ["vip", "VIP"]] as [InactiveFilter, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)}
                className={`rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-all ${filter === id ? "bg-charcoal text-cream border-charcoal" : "bg-paper border-line text-muted hover:border-accent-soft"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-paper overflow-hidden">
          {inactive.length === 0 && <p className="text-center text-sm text-muted py-10">Nobody in this segment — your retention is stellar.</p>}
          {inactive.slice(0, 8).map((c) => {
            const d = c.lastVisit ? daysSince(c.lastVisit) : null;
            const on = selected.includes(c.id);
            return (
              <label key={c.id} className={`flex items-center gap-3.5 px-5 py-3.5 border-b border-linesoft last:border-0 cursor-pointer transition-colors ${on ? "bg-accent-tint/60" : "hover:bg-cream"}`}>
                <input type="checkbox" checked={on} onChange={() => toggleSel(c.id)} className="sr-only" />
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${on ? "bg-accent border-accent text-cream" : "border-line"}`}>
                  {on && <IcCheck className="w-3 h-3" />}
                </span>
                <span className="w-9 h-9 rounded-full text-cream text-[11px] font-bold flex items-center justify-center shrink-0" style={{ background: `hsl(${(c.name.length * 37) % 360} 24% 42%)` }}>
                  {c.name.split(" ").map((x) => x[0]).join("")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2 text-[13px] font-bold text-ink">{c.name}{c.status === "VIP" && <span className="text-[8.5px] font-bold bg-charcoal text-goldsoft rounded-full px-1.5 py-0.5 tracking-widest">VIP</span>}</span>
                  <span className="block text-[11px] text-muted">{d !== null ? `${d} days inactive` : "Never visited"} · last: {treatmentById(c.lastTreatmentId)?.name}</span>
                </span>
                <span className="text-right shrink-0">
                  <span className="block text-[13px] font-extrabold text-accent">{money(c.ltv)}</span>
                  <span className="block text-[9.5px] text-faint uppercase tracking-wider font-bold">lifetime</span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3.5">
          <p className="text-[12px] text-muted">{selected.length} selected · est. <strong className="text-ink">{money(selected.reduce((a, id) => a + (s.clients.find((c) => c.id === id)?.ltv ?? 0) * 0.3, 0))}</strong> recoverable</p>
          <button disabled={selected.length === 0} onClick={createWinBack}
            className="ml-auto btn-gold rounded-full px-6 py-3 text-[12px] font-bold tracking-wide disabled:opacity-40 flex items-center gap-2">
            <IcMegaphone className="w-4 h-4" /> CREATE WIN-BACK CAMPAIGN
          </button>
        </div>
      </section>

      {/* waitlist & open slots */}
      <section>
        <div className="mb-4">
          <p className="kicker text-accent">Cancellation recovery</p>
          <h3 className="font-display text-[24px] text-ink mt-1">Waitlist &amp; open slots</h3>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-line bg-paper p-5">
            <p className="kicker mb-3">Open appointment opportunities</p>
            {s.openSlots.length === 0 && (
              <p className="text-[12.5px] text-muted py-6 text-center">No open slots. Cancel an appointment in the calendar and it will appear here.</p>
            )}
            <div className="space-y-2.5">
              {s.openSlots.map((slot) => (
                <WaitlistNotifyCard key={slot.id} slotId={slot.id} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-paper p-5">
            <p className="kicker mb-3">Waiting clients</p>
            <div className="space-y-2.5">
              {s.waitlist.map((w) => (
                <div key={w.id} className="flex items-center gap-3 rounded-lg border border-line bg-cream px-4 py-3">
                  <span className="w-8 h-8 rounded-full bg-accent-tint text-accent text-[10px] font-bold flex items-center justify-center shrink-0">
                    {w.client.split(" ").map((x) => x[0]).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-bold text-ink">{w.client}{w.isYou && <span className="ml-1.5 text-[8.5px] font-bold bg-accent-tint text-accent rounded-full px-1.5 py-0.5 uppercase">Client-app user</span>}</p>
                    <p className="text-[10.5px] text-muted">{treatmentById(w.treatmentId)?.name} · prefers {w.pref}</p>
                  </div>
                  {w.notified
                    ? <span className="text-[9.5px] font-bold text-sage bg-sagetint rounded-full px-2.5 py-1 flex items-center gap-1"><IcCheck className="w-3 h-3" />Notified</span>
                    : <span className="text-[9.5px] font-bold text-faint bg-linesoft rounded-full px-2.5 py-1">Waiting</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RebookCard({ c, i, onRemind }: { c: Client; i: number; onRemind: () => void }) {
  const t = treatmentById(c.lastTreatmentId);
  const base = c.rebookReadyAt ?? c.lastVisit ?? todayISO();
  const since = c.rebookReadyAt ? 0 : c.lastVisit ? daysSince(c.lastVisit) : 0;
  const weeksAgo = Math.round(since / 7);
  const [w1, w2] = rebookWindow(c.rebookReadyAt ? todayISO() : base, t?.frequencyWeeks ?? 6);
  return (
    <Reveal delay={(i % 2) * 70}>
      <div className="rounded-xl border border-line bg-paper p-5 hover:border-accent-soft hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-full text-cream text-[12px] font-bold flex items-center justify-center shrink-0" style={{ background: `hsl(${(c.name.length * 37) % 360} 24% 42%)` }}>
            {c.name.split(" ").map((x) => x[0]).join("")}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-ink flex items-center gap-2">{c.name}{c.id === "c1" && <span className="text-[8.5px] font-bold bg-accent-tint text-accent rounded-full px-1.5 py-0.5 uppercase">In the app demo</span>}</p>
            <p className="text-[11.5px] text-muted">{t?.name} · {weeksAgo > 0 ? `last visit ${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago` : "visit completed today"}</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-extrabold text-accent">{money(c.ltv)}</p>
            <p className="text-[9px] text-faint uppercase tracking-wider font-bold">lifetime</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-linesoft">
          <p className="text-[10.5px] text-muted flex items-center gap-1.5">
            <IcRefresh className="w-3.5 h-3.5 text-accent" />
            Recommended return: <strong className="text-ink">{fmtShort(w1)} – {fmtShort(w2)}</strong>
          </p>
          <button onClick={onRemind} disabled={c.reminded}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10.5px] font-bold transition-all ${c.reminded ? "bg-sagetint text-sage cursor-default" : "bg-charcoal text-cream hover:bg-espresso"}`}>
            {c.reminded ? (<><IcCheck className="w-3 h-3" />Reminded</>) : (<><IcBell className="w-3 h-3" />SEND REMINDER</>)}
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function WaitlistNotifyCard({ slotId }: { slotId: string }) {
  const { s, notifyWaitlist } = useDemo();
  const slot = s.openSlots.find((x) => x.id === slotId);
  if (!slot) return null;
  const t = treatmentById(slot.treatmentId);
  return (
    <div className="flex items-center gap-3.5 rounded-lg border border-accent-soft bg-accent-tint/50 px-4 py-3.5">
      <span className="w-11 h-11 rounded-xl bg-charcoal text-goldsoft flex flex-col items-center justify-center shrink-0">
        <span className="text-[8px] font-bold tracking-widest uppercase">{weekdayShort(slot.date)}</span>
        <span className="text-[11px] font-extrabold leading-none">{slot.time}</span>
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-bold text-ink">{t?.name} · {fmtShort(slot.date)} at {slot.time}</p>
        <p className="text-[10.5px] text-brick font-semibold">{slot.note}</p>
      </div>
      <button onClick={() => notifyWaitlist(slot.id)} className="shrink-0 btn-gold rounded-full px-4 py-2 text-[10.5px] font-bold flex items-center gap-1.5">
        <IcTicket className="w-3.5 h-3.5" /> NOTIFY WAITLIST
      </button>
    </div>
  );
}
