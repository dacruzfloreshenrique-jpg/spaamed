import { useMemo, useState } from "react";
import { useDemo } from "../state/store";
import {
  todayISO, addDaysISO, fmtShort, fmtMed, weekdayShort, money, treatmentById, providerById, isoOf,
} from "../data/demo";
import type { Appointment, ApptStatus } from "../data/demo";
import { Seg, Modal, SlotPicker } from "../components/ui";
import { IcCheck, IcX, IcRefresh, IcClock, IcSpark } from "../components/icons";

type View = "day" | "week" | "month";

const chip = (st: ApptStatus) => {
  const map: Record<ApptStatus, string> = {
    confirmed: "bg-accent-tint text-accent",
    pending: "bg-ambertint text-amber",
    "checked-in": "bg-sagetint text-sage",
    completed: "bg-sagetint text-sage",
    cancelled: "bg-bricktint text-brick",
  };
  return <span className={`text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${map[st]}`}>{st}</span>;
};

export default function AppointmentsDash() {
  const { s, confirmAppt, completeAppt, cancelAppt, rescheduleAppt } = useDemo();
  const [view, setView] = useState<View>("day");
  const [day, setDay] = useState(todayISO());
  const [cancel, setCancel] = useState<Appointment | null>(null);
  const [resched, setResched] = useState<Appointment | null>(null);
  const [pick, setPick] = useState<{ date: string; time: string | null }>({ date: todayISO(), time: null });

  const active = useMemo(() => s.appointments.filter((a) => a.status !== "cancelled"), [s.appointments]);
  const dayList = useMemo(
    () => s.appointments.filter((a) => a.date === day).sort((a, b) => a.time.localeCompare(b.time)),
    [s.appointments, day]
  );
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysISO(i)), []);

  const monthStart = new Date(day + "T12:00:00");
  const monthLabel = monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDow = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1).getDay();
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Seg<View> options={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }]} value={view} onChange={setView} />
        <div className="flex items-center gap-1.5">
          <button onClick={() => setDay(addDaysISO(-1, day))} className="w-8 h-8 rounded-lg border border-line bg-paper text-muted hover:text-ink" aria-label="Previous day">‹</button>
          <button onClick={() => setDay(todayISO())} className="rounded-lg border border-line bg-paper px-3 h-8 text-[11.5px] font-bold text-ink hover:border-accent-soft">Today</button>
          <button onClick={() => setDay(addDaysISO(1, day))} className="w-8 h-8 rounded-lg border border-line bg-paper text-muted hover:text-ink" aria-label="Next day">›</button>
        </div>
        <p className="ml-auto text-[12px] font-bold text-ink">{view === "month" ? monthLabel : fmtMed(day)}</p>
      </div>

      {/* ------------ DAY ------------ */}
      {view === "day" && (
        <div className="rounded-xl border border-line bg-paper overflow-hidden">
          <div className="hidden md:grid grid-cols-[90px_1.2fr_1fr_1fr_90px_190px] gap-3 px-5 py-2.5 border-b border-linesoft text-[9.5px] tracking-[0.18em] uppercase font-bold text-faint">
            <span>Time</span><span>Client</span><span>Treatment</span><span>Provider</span><span>Status</span><span className="text-right">Actions</span>
          </div>
          {dayList.length === 0 && (
            <p className="text-center text-sm text-muted py-12">No appointments on {fmtShort(day)}. A quiet day — perfect for outreach.</p>
          )}
          {dayList.map((a, i) => {
            const t = treatmentById(a.treatmentId);
            const p = providerById(a.providerId);
            return (
              <div key={a.id} className="anim-fade-up grid md:grid-cols-[90px_1.2fr_1fr_1fr_90px_190px] gap-2 md:gap-3 items-center px-5 py-3.5 border-b border-linesoft last:border-0 hover:bg-cream transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-ink"><IcClock className="w-3.5 h-3.5 text-faint" />{a.time}</span>
                <span className="text-[13px] font-bold text-ink flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full text-cream text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: p?.hue }}>
                    {a.clientName.split(" ").map((x) => x[0]).join("")}
                  </span>
                  {a.clientName}{a.newClient && <span className="text-[8.5px] font-bold bg-sagetint text-sage rounded-full px-1.5 py-0.5 uppercase">New</span>}
                </span>
                <span className="text-[12.5px] text-muted font-semibold">{t?.name} · {money(a.price)}</span>
                <span className="text-[12.5px] text-muted hidden md:block">{p?.name}</span>
                <span>{chip(a.status)}</span>
                <span className="flex gap-1.5 justify-start md:justify-end flex-wrap">
                  {a.status === "pending" && (
                    <ActionBtn label="Confirm" tone="sage" onClick={() => confirmAppt(a.id)} icon={<IcCheck className="w-3 h-3" />} />
                  )}
                  {(a.status === "confirmed" || a.status === "checked-in") && (
                    <>
                      <ActionBtn label="Completed" tone="gold" onClick={() => completeAppt(a.id)} icon={<IcSpark className="w-3 h-3" />} />
                      <ActionBtn label="Move" tone="line" onClick={() => { setResched(a); setPick({ date: a.date, time: a.time }); }} icon={<IcRefresh className="w-3 h-3" />} />
                      <ActionBtn label="Cancel" tone="brick" onClick={() => setCancel(a)} icon={<IcX className="w-3 h-3" />} />
                    </>
                  )}
                  {a.status === "completed" && <span className="text-[10.5px] text-sage font-bold">+100 pts awarded</span>}
                  {a.status === "cancelled" && <span className="text-[10.5px] text-brick font-bold">Slot opened</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------ WEEK ------------ */}
      {view === "week" && (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2.5">
          {weekDays.map((d) => {
            const list = active.filter((a) => a.date === d);
            const isToday = d === todayISO();
            return (
              <button key={d} onClick={() => { setDay(d); setView("day"); }}
                className={`rounded-xl border p-3 text-left min-h-[150px] transition-all hover:-translate-y-1 ${isToday ? "border-accent bg-accent-tint/50" : "border-line bg-paper hover:border-accent-soft"}`}>
                <p className={`text-[10px] font-bold tracking-widest uppercase ${isToday ? "text-accent" : "text-faint"}`}>{weekdayShort(d)} {fmtShort(d).split(" ")[1]}</p>
                <p className="font-display text-lg text-ink">{list.length} <span className="text-[10px] font-body font-semibold text-muted">booked</span></p>
                <div className="mt-2 space-y-1.5">
                  {list.slice(0, 3).map((a) => (
                    <div key={a.id} className="rounded-md bg-cream border border-line px-2 py-1.5">
                      <p className="text-[10px] font-bold text-ink truncate">{a.time} · {a.clientName.split(" ")[0]}</p>
                      <p className="text-[9px] text-muted truncate">{treatmentById(a.treatmentId)?.name}</p>
                    </div>
                  ))}
                  {list.length > 3 && <p className="text-[9.5px] font-bold text-accent">+{list.length - 3} more</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ------------ MONTH ------------ */}
      {view === "month" && (
        <div className="rounded-xl border border-line bg-paper p-5">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[9.5px] font-bold tracking-widest uppercase text-faint mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDow }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = isoOf(new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1));
              const n = active.filter((a) => a.date === d).length;
              const isToday = d === todayISO();
              return (
                <button key={d} onClick={() => { setDay(d); setView("day"); }}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all hover:-translate-y-0.5 ${isToday ? "border-accent bg-accent text-cream" : n > 0 ? "border-line bg-cream hover:border-accent-soft" : "border-linesoft bg-paper text-faint"}`}>
                  <span className="text-[12px] font-bold">{i + 1}</span>
                  {n > 0 && <span className={`text-[8.5px] font-bold ${isToday ? "text-cream/80" : "text-accent"}`}>{n} appt</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* cancel modal */}
      <Modal open={cancel !== null} onClose={() => setCancel(null)}>
        <div className="p-6 text-center">
          <h3 className="font-display text-xl text-ink">Cancel this appointment?</h3>
          <p className="text-[12.5px] text-muted mt-2 leading-relaxed">
            {cancel && <strong>{cancel.clientName}</strong>} · {cancel && treatmentById(cancel.treatmentId)?.name} · {cancel && fmtMed(cancel.date)} at {cancel?.time}.<br />
            The slot will be opened to your waitlist automatically.
          </p>
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button onClick={() => setCancel(null)} className="rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold">Keep it</button>
            <button onClick={() => { if (cancel) cancelAppt(cancel.id, "business"); setCancel(null); }} className="rounded-xl bg-brick text-cream py-3 text-[12.5px] font-bold hover:brightness-110">Cancel &amp; open slot</button>
          </div>
        </div>
      </Modal>

      {/* reschedule modal */}
      <Modal open={resched !== null} onClose={() => setResched(null)} wide>
        <div className="p-6">
          <h3 className="font-display text-xl text-ink">Reschedule {resched?.clientName}</h3>
          <p className="text-[12.5px] text-muted mt-1">The client is notified instantly in their app.</p>
          <div className="mt-5">
            <SlotPicker date={pick.date} time={pick.time} days={10} onPick={(p) => setPick((x) => ({ date: p.date ?? x.date, time: p.time ?? x.time }))} />
          </div>
          <button disabled={!pick.time} onClick={() => { if (resched && pick.time) { rescheduleAppt(resched.id, pick.date, pick.time); setResched(null); } }}
            className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold disabled:opacity-40">
            Confirm new time
          </button>
        </div>
      </Modal>
    </div>
  );
}

function ActionBtn({ label, tone, onClick, icon }: { label: string; tone: "sage" | "gold" | "brick" | "line"; onClick: () => void; icon: React.ReactNode }) {
  const tones = {
    sage: "bg-sagetint text-sage hover:bg-sage hover:text-cream",
    gold: "btn-gold",
    brick: "bg-bricktint text-brick hover:bg-brick hover:text-cream",
    line: "border border-line text-muted hover:text-ink hover:border-accent-soft",
  };
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-bold transition-all ${tones[tone]}`}>
      {icon}{label}
    </button>
  );
}
