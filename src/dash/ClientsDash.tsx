import { useMemo, useState } from "react";
import { useDemo } from "../state/store";
import {
  fmtShort, money, daysSince, treatmentById, todayISO,
} from "../data/demo";
import type { Client, ClientStatus } from "../data/demo";
import { Modal, EmptyState } from "../components/ui";
import { IcSearch, IcX, IcCalendarPlus, IcMegaphone, IcBell, IcChevR, IcStar, IcGift, IcHeart, IcClock } from "../components/icons";

const statusTone: Record<ClientStatus, string> = {
  VIP: "bg-charcoal text-goldsoft",
  Active: "bg-sagetint text-sage",
  New: "bg-accent-tint text-accent",
  "At Risk": "bg-bricktint text-brick",
};

export default function ClientsDash() {
  const { s, toast, setDash } = useDemo();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ClientStatus | "All">("All");
  const [sel, setSel] = useState<Client | null>(null);
  const selLive = sel ? s.clients.find((c) => c.id === sel.id) ?? null : null;

  const list = useMemo(() => {
    return s.clients
      .filter((c) => (filter === "All" || c.status === filter))
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.includes(q.toLowerCase()))
      .sort((a, b) => b.ltv - a.ltv);
  }, [s.clients, q, filter]);

  const nextAppt = (id: string) =>
    s.appointments
      .filter((a) => a.clientId === id && ["confirmed", "pending"].includes(a.status) && a.date >= todayISO())
      .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="space-y-4">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3.5 py-2.5 flex-1 min-w-[220px] max-w-sm focus-within:border-accent-soft transition-colors">
          <IcSearch className="w-4 h-4 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients…"
            className="bg-transparent outline-none text-[13px] flex-1 placeholder:text-faint" aria-label="Search clients" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search"><IcX className="w-3.5 h-3.5 text-faint" /></button>}
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {(["All", "VIP", "Active", "New", "At Risk"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-all ${filter === f ? "bg-charcoal text-cream border-charcoal" : "bg-paper border-line text-muted hover:border-accent-soft"}`}>
              {f}
            </button>
          ))}
        </div>
        <p className="text-[11.5px] text-faint ml-auto">{list.length} of {s.clients.length} clients</p>
      </div>

      {/* table */}
      <div className="rounded-xl border border-line bg-paper overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1.4fr_70px_110px_120px_120px_90px_40px] gap-3 px-5 py-2.5 border-b border-linesoft text-[9.5px] tracking-[0.18em] uppercase font-bold text-faint">
          <span>Client</span><span>Visits</span><span>Last visit</span><span>Lifetime value</span><span>Next appointment</span><span>Status</span><span />
        </div>
        {list.length === 0 && (
          <EmptyState icon={<IcSearch className="w-6 h-6" />} title="No clients match" sub="Try a different name or clear your filters." />
        )}
        {list.map((c, i) => {
          const na = nextAppt(c.id);
          return (
            <button key={c.id} onClick={() => setSel(c)}
              className="anim-fade-up w-full text-left grid lg:grid-cols-[1.4fr_70px_110px_120px_120px_90px_40px] gap-2 lg:gap-3 items-center px-5 py-3 border-b border-linesoft last:border-0 hover:bg-cream transition-colors"
              style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}>
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full text-cream text-[11px] font-bold flex items-center justify-center shrink-0" style={{ background: `hsl(${(c.name.length * 37) % 360} 24% 42%)` }}>
                  {c.name.split(" ").map((x) => x[0]).join("")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-ink truncate">{c.name}</span>
                  <span className="block text-[10.5px] text-faint truncate">{c.email}</span>
                </span>
              </span>
              <span className="text-[12.5px] font-bold text-ink">{c.visits}</span>
              <span className="text-[12px] text-muted">{c.lastVisit ? `${fmtShort(c.lastVisit)}` : "—"}</span>
              <span className="text-[12.5px] font-extrabold text-accent">{money(c.ltv)}</span>
              <span className="text-[12px] text-muted">{na ? fmtShort(na.date) : <span className="text-faint italic">none</span>}</span>
              <span><span className={`text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-1 ${statusTone[c.status]}`}>{c.status}</span></span>
              <IcChevR className="w-4 h-4 text-faint justify-self-end hidden lg:block" />
            </button>
          );
        })}
      </div>
      <p className="text-[10.5px] text-faint">All client records are fictional demo data. Click any client to open their profile.</p>

      {/* ------------ profile drawer ------------ */}
      {selLive && <ClientDrawer client={selLive} onClose={() => setSel(null)} onRebooking={() => { setSel(null); setDash("rebooking"); }} />}
    </div>
  );
}

function ClientDrawer({ client, onClose, onRebooking }: { client: Client; onClose: () => void; onRebooking: () => void }) {
  const { s, toast, bookForClient } = useDemo();
  const [promoPick, setPromoPick] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [nTitle, setNTitle] = useState("");
  const [nBody, setNBody] = useState("");
  const [booked, setBooked] = useState(false);

  const appts = s.appointments.filter((a) => a.clientId === client.id).sort((a, b) => b.date.localeCompare(a.date));
  const avg = client.visits > 0 ? Math.round(client.ltv / client.visits) : 0;
  const lastDays = client.lastVisit ? daysSince(client.lastVisit) : null;
  const isEmma = client.id === "c1";

  const bookFor = () => {
    bookForClient(client.id);
    setBooked(true);
    toast(`Booking request sent to ${client.name} — it's now pending in Appointments`);
  };

  return (
    <div className="fixed inset-0 z-[85]">
      <button className="absolute inset-0 bg-espresso/45" onClick={onClose} aria-label="Close client profile" />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[460px] bg-ivory shadow-2xl anim-fade-up overflow-y-auto thin-scroll">
        <div className="sticky top-0 bg-ivory/95 backdrop-blur border-b border-line px-6 py-4 flex items-center gap-3 z-10">
          <h3 className="font-display text-xl text-ink flex-1">Client profile</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-line bg-paper flex items-center justify-center text-muted hover:text-ink" aria-label="Close"><IcX className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* header */}
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-full text-cream font-display italic text-xl flex items-center justify-center shrink-0" style={{ background: "var(--accent)" }}>
              {client.name.split(" ").map((x) => x[0]).join("")}
            </span>
            <div>
              <h4 className="font-display text-[22px] text-ink leading-tight flex items-center gap-2">
                {client.name}
                <span className={`text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-1 ${statusTone[client.status]}`}>{client.status}</span>
              </h4>
              <p className="text-[11.5px] text-muted mt-0.5">{client.email} · {client.phone}</p>
              {client.member && <p className="text-[10px] font-bold text-accent mt-1 flex items-center gap-1"><IcStar className="w-3 h-3" /> Glow Member</p>}
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ["Lifetime value", money(client.ltv)],
              ["Visits", String(client.visits)],
              ["Average visit", money(avg)],
              ["Last visit", lastDays === null ? "—" : lastDays === 0 ? "Today" : `${lastDays} days ago`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-paper p-3.5">
                <p className="text-[10px] tracking-[0.16em] uppercase font-bold text-faint">{k}</p>
                <p className="font-display text-[20px] text-ink mt-1">{v}</p>
              </div>
            ))}
          </div>

          {/* actions */}
          <div className="grid grid-cols-3 gap-2">
            <button onClick={bookFor} disabled={booked} className={`rounded-xl py-3 text-[10.5px] font-bold flex flex-col items-center gap-1.5 transition-all ${booked ? "bg-sagetint text-sage" : "btn-gold"}`}>
              <IcCalendarPlus className="w-4 h-4" />{booked ? "Sent ✓" : "Book Appointment"}
            </button>
            <button onClick={() => setPromoPick(true)} className="rounded-xl border border-line bg-paper py-3 text-[10.5px] font-bold text-ink flex flex-col items-center gap-1.5 hover:border-accent-soft transition-colors">
              <IcMegaphone className="w-4 h-4 text-accent" />Send Promotion
            </button>
            <button onClick={() => setNotifOpen(true)} className="rounded-xl border border-line bg-paper py-3 text-[10.5px] font-bold text-ink flex flex-col items-center gap-1.5 hover:border-accent-soft transition-colors">
              <IcBell className="w-4 h-4 text-accent" />Send Notification
            </button>
          </div>
          {booked && (
            <p className="text-[11px] text-sage font-semibold -mt-2">A pending booking landed in Appointments — confirm it when ready.</p>
          )}

          {/* history */}
          <div>
            <p className="kicker mb-2.5">Appointment history</p>
            <div className="space-y-2">
              {appts.length === 0 && <p className="text-[12px] text-muted">No visits yet.</p>}
              {appts.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3.5 py-2.5">
                  <span className="text-[11px] font-bold text-muted w-16 shrink-0">{fmtShort(a.date)}</span>
                  <span className="text-[12px] font-bold text-ink flex-1 truncate">{treatmentById(a.treatmentId)?.name}</span>
                  <span className={`text-[8.5px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${a.status === "completed" ? "bg-sagetint text-sage" : a.status === "cancelled" ? "bg-bricktint text-brick" : "bg-accent-tint text-accent"}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* loyalty */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-line bg-paper p-3.5">
              <p className="flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase font-bold text-faint"><IcGift className="w-3.5 h-3.5 text-accent" />Glow Points</p>
              <p className="font-display text-[20px] text-ink mt-1">{client.points.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-3.5">
              <p className="flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase font-bold text-faint"><IcHeart className="w-3.5 h-3.5 text-accent" />Referrals</p>
              <p className="font-display text-[20px] text-ink mt-1">{isEmma ? 3 : Math.max(0, (client.visits % 4))}</p>
            </div>
          </div>

          <button onClick={onRebooking} className="w-full rounded-xl border border-dashed border-accent-soft bg-accent-tint/50 py-3 text-[12px] font-bold text-accent hover:bg-accent-tint transition-colors flex items-center justify-center gap-2">
            <IcClock className="w-4 h-4" /> View in Rebooking Center
          </button>
        </div>
      </div>

      {/* send promotion modal */}
      <Modal open={promoPick} onClose={() => setPromoPick(false)}>
        <div className="p-6">
          <h3 className="font-display text-xl text-ink">Send a promotion to {client.name.split(" ")[0]}</h3>
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto thin-scroll">
            {s.promotions.slice(0, 6).map((p) => (
              <button key={p.id} onClick={() => { setPromoPick(false); toast(`${p.offer} sent to ${client.name}${isEmma ? " — see it in the client app" : ""}`); }}
                className="w-full text-left rounded-lg border border-line bg-paper px-4 py-3 hover:border-accent-soft transition-colors">
                <p className="text-[12.5px] font-bold text-ink">{p.offer}</p>
                <p className="text-[10.5px] text-muted">{p.title} · {p.audience}</p>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* send notification modal */}
      <Modal open={notifOpen} onClose={() => setNotifOpen(false)}>
        <div className="p-6">
          <h3 className="font-display text-xl text-ink">Push notification</h3>
          <p className="text-[12px] text-muted mt-1">Delivered to {client.name}'s app{isEmma ? " — watch the client demo" : ""}.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="kicker block mb-1.5">Title</label>
              <input value={nTitle} onChange={(e) => setNTitle(e.target.value)} placeholder="We saved you a spot ✨" className="w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] outline-none focus:border-accent" />
            </div>
            <div>
              <label className="kicker block mb-1.5">Message</label>
              <textarea value={nBody} onChange={(e) => setNBody(e.target.value)} rows={3} placeholder="Your favorite provider has an opening this week…" className="w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] outline-none focus:border-accent resize-none" />
            </div>
          </div>
          <button disabled={!nTitle || !nBody}
            onClick={() => { toast(`Notification sent to ${client.name}`); setNotifOpen(false); setNTitle(""); setNBody(""); }}
            className="mt-4 w-full btn-gold rounded-xl py-3 text-[12.5px] font-bold disabled:opacity-40">
            SEND NOTIFICATION
          </button>
        </div>
      </Modal>
    </div>
  );
}
