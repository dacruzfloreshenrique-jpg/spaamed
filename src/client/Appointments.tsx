import { useState } from "react";
import { useDemo } from "../state/store";
import { fmtLong, fmtShort, money, treatmentById, providerById, todayISO, fmtMed } from "../data/demo";
import type { Appointment, ApptStatus } from "../data/demo";
import { Modal, Seg, SlotPicker, EmptyState, ChevronNav } from "../components/ui";
import { IcCalendar, IcRefresh, IcArrowR, IcClock, IcPin, IcEye, IcX } from "../components/icons";

type View = "upcoming" | "past" | "cancelled";

const statusChip = (st: ApptStatus) => {
  if (st === "pending") return <span className="text-[9px] font-bold uppercase tracking-widest bg-ambertint text-amber rounded-full px-2 py-0.5">Pending</span>;
  if (st === "completed") return <span className="text-[9px] font-bold uppercase tracking-widest bg-sagetint text-sage rounded-full px-2 py-0.5">Completed</span>;
  if (st === "cancelled") return <span className="text-[9px] font-bold uppercase tracking-widest bg-bricktint text-brick rounded-full px-2 py-0.5">Cancelled</span>;
  return <span className="text-[9px] font-bold uppercase tracking-widest bg-accent-tint text-accent rounded-full px-2 py-0.5">Confirmed</span>;
};

export default function Appointments() {
  const { s, myAppts, setTab, setPrefill, cancelAppt, rescheduleAppt, confirmAppt, toast } = useDemo();
  const [view, setView] = useState<View>("upcoming");
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [resched, setResched] = useState<Appointment | null>(null);
  const [cancel, setCancel] = useState<Appointment | null>(null);
  const [pick, setPick] = useState<{ date: string; time: string | null }>({ date: todayISO(), time: null });

  const today = todayISO();
  const upcoming = myAppts.filter((a) => ["confirmed", "pending", "checked-in"].includes(a.status) && a.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = myAppts.filter((a) => a.status === "completed").sort((a, b) => b.date.localeCompare(a.date));
  const cancelled = myAppts.filter((a) => a.status === "cancelled").sort((a, b) => b.date.localeCompare(a.date));

  const list = view === "upcoming" ? upcoming : view === "past" ? past : cancelled;

  const bookAgain = (a: Appointment) => {
    setPrefill({ treatmentId: a.treatmentId, providerId: a.providerId });
    setTab("book");
  };

  return (
    <div>
      <h1 className="font-display text-[25px] text-ink">Appointments</h1>
      <p className="text-[12.5px] text-muted mt-0.5">Everything in one calm place.</p>

      <div className="mt-4">
        <Seg<View>
          options={[{ id: "upcoming", label: `Upcoming · ${upcoming.length}` }, { id: "past", label: `Past · ${past.length}` }, { id: "cancelled", label: "Cancelled" }]}
          value={view} onChange={setView}
        />
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 && view === "upcoming" && (
          <EmptyState icon={<IcCalendar className="w-7 h-7" />} title="No upcoming appointments"
            sub="Your next glow is one tap away."
            action={<button onClick={() => setTab("book")} className="btn-gold rounded-full px-5 py-2.5 text-[12px] font-bold">Book Appointment</button>} />
        )}
        {list.length === 0 && view === "past" && (
          <EmptyState icon={<IcClock className="w-7 h-7" />} title="No past visits yet" sub="Completed treatments will appear here with one-tap rebooking." />
        )}
        {list.length === 0 && view === "cancelled" && (
          <EmptyState icon={<IcX className="w-7 h-7" />} title="Nothing cancelled" sub="That's a good thing — see you at your next visit." />
        )}

        {list.map((a, i) => {
          const t = treatmentById(a.treatmentId);
          const p = providerById(a.providerId);
          return (
            <article key={a.id} className="anim-fade-up rounded-2xl border border-line bg-paper overflow-hidden hover:border-accent-soft hover:-translate-y-0.5 transition-all duration-300" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex gap-3.5 p-4">
                <div className="w-[70px] shrink-0 text-center">
                  <div className="rounded-xl bg-charcoal text-cream py-2.5">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-goldsoft font-bold">{fmtShort(a.date).split(" ")[0]}</p>
                    <p className="font-display text-[22px] leading-tight">{fmtShort(a.date).split(" ")[1]}</p>
                  </div>
                  <p className="text-[10.5px] font-bold text-muted mt-1.5 flex items-center justify-center gap-1"><IcClock className="w-3 h-3" />{a.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-[17px] text-ink leading-tight">{t?.name}</h3>
                    {statusChip(a.status)}
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">with {p?.name} · {t?.duration} min</p>
                  <p className="text-[11px] text-faint mt-0.5 flex items-center gap-1"><IcPin className="w-3 h-3" />{s.brand.address.split(",")[0]}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {view === "upcoming" && (
                      <>
                        <button onClick={() => setDetail(a)} className="text-[10.5px] font-bold border border-line rounded-full px-3 py-1.5 text-ink hover:border-accent-soft flex items-center gap-1"><IcEye className="w-3 h-3" />View</button>
                        {a.status === "pending" && (
                          <button onClick={() => confirmAppt(a.id)} className="text-[10.5px] font-bold bg-sagetint text-sage rounded-full px-3 py-1.5 hover:bg-sage hover:text-cream transition-colors">Confirm</button>
                        )}
                        <button onClick={() => { setResched(a); setPick({ date: a.date, time: a.time }); }} className="text-[10.5px] font-bold border border-line rounded-full px-3 py-1.5 text-ink hover:border-accent-soft flex items-center gap-1"><IcRefresh className="w-3 h-3" />Reschedule</button>
                        <button onClick={() => setCancel(a)} className="text-[10.5px] font-bold border border-bricktint text-brick rounded-full px-3 py-1.5 hover:bg-brick hover:text-cream transition-colors">Cancel</button>
                      </>
                    )}
                    {view === "past" && (
                      <button onClick={() => bookAgain(a)} className="text-[10.5px] font-bold btn-gold rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
                        BOOK AGAIN <IcArrowR className="w-3 h-3" />
                      </button>
                    )}
                    {view === "cancelled" && (
                      <button onClick={() => bookAgain(a)} className="text-[10.5px] font-bold bg-charcoal text-cream rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
                        Rebook <IcRefresh className="w-3 h-3" />
                      </button>
                    )}
                    <span className="ml-auto self-center text-[12px] font-extrabold text-accent">{money(a.price)}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* detail modal */}
      <Modal open={detail !== null} onClose={() => setDetail(null)} sheet>
        {detail && (
          <div className="p-6">
            <ChevronNav onBack={() => setDetail(null)} title="Appointment details" />
            <div className="rounded-xl overflow-hidden h-36 bg-linesoft relative">
              <img src={treatmentById(detail.treatmentId)?.image} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-display text-[22px] text-ink mt-4">{treatmentById(detail.treatmentId)?.name}</h3>
            <dl className="mt-3 space-y-2 text-[12.5px]">
              {[
                ["Date", fmtLong(detail.date)],
                ["Time", detail.time],
                ["Provider", providerById(detail.providerId)?.name ?? ""],
                ["Duration", `${treatmentById(detail.treatmentId)?.duration} minutes`],
                ["Location", s.brand.address],
                ["Price", money(detail.price)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-muted">{k}</dt><dd className="font-bold text-ink text-right">{v}</dd></div>
              ))}
            </dl>
            <div className="flex items-center gap-2 rounded-xl bg-goldtint border border-accent-soft px-4 py-3 mt-4">
              <IcPin className="w-4 h-4 text-accent shrink-0" />
              <p className="text-[11.5px] text-ink">Arrive 10 minutes early to unwind. Herbal tea is on us. 🍵</p>
            </div>
          </div>
        )}
      </Modal>

      {/* reschedule modal */}
      <Modal open={resched !== null} onClose={() => setResched(null)} sheet>
        <div className="p-6">
          <h3 className="font-display text-xl text-ink">Reschedule visit</h3>
          <p className="text-[12.5px] text-muted mt-1">{resched && fmtMed(resched.date)} · {resched?.time} → pick a new time</p>
          <div className="mt-5">
            <SlotPicker date={pick.date} time={pick.time} onPick={(p) => setPick((x) => ({ date: p.date ?? x.date, time: p.time ?? x.time }))} />
          </div>
          <button disabled={!pick.time}
            onClick={() => { if (resched && pick.time) { rescheduleAppt(resched.id, pick.date, pick.time); setResched(null); } }}
            className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold disabled:opacity-40">
            Confirm new time
          </button>
        </div>
      </Modal>

      {/* cancel modal */}
      <Modal open={cancel !== null} onClose={() => setCancel(null)}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-bricktint text-brick flex items-center justify-center mx-auto"><IcX className="w-6 h-6" /></div>
          <h3 className="font-display text-xl text-ink mt-4">Cancel this appointment?</h3>
          <p className="text-[12.5px] text-muted mt-1.5 leading-relaxed">
            {cancel && <>{treatmentById(cancel.treatmentId)?.name} on {fmtMed(cancel.date)} at {cancel.time}.</>}
            {" "}Your spot may be offered to someone on the waitlist.
          </p>
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button onClick={() => setCancel(null)} className="rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold text-ink hover:border-accent-soft">Keep it</button>
            <button onClick={() => { if (cancel) { cancelAppt(cancel.id, "client"); toast("We'll miss you — rebook anytime ✨", "info"); } setCancel(null); }}
              className="rounded-xl bg-brick text-cream py-3 text-[12.5px] font-bold hover:brightness-110">Cancel visit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
