import { useState } from "react";
import { useDemo } from "../state/store";
import {
  MEMBERSHIP_PLANS, fmtLong, money, treatmentById, providerById,
} from "../data/demo";
import type { Overlay } from "./ClientApp";
import { Modal, Toggle, SuccessCheck } from "../components/ui";
import {
  IcChevR, IcUser, IcCalendar, IcClock, IcGift, IcSparkles, IcHeart, IcCard, IcBell, IcSliders,
  IcMessage, IcCheck, IcCopy, IcShield, IcStar, IcArrowR,
} from "../components/icons";

/* ---------------- payment simulation ---------------- */

function PaymentModal({ open, onClose, title, amount, onSuccess }: {
  open: boolean; onClose: () => void; title: string; amount: number; onSuccess: () => void;
}) {
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const close = () => { setPhase("form"); onClose(); };
  const pay = () => {
    setPhase("processing");
    window.setTimeout(() => { setPhase("done"); window.setTimeout(() => { onSuccess(); close(); }, 1400); }, 1100);
  };
  return (
    <Modal open={open} onClose={phase === "form" ? close : () => undefined} sheet>
      <div className="p-6">
        {phase === "form" && (
          <>
            <h3 className="font-display text-xl text-ink">{title}</h3>
            <p className="text-[12.5px] text-muted mt-1">Simulated checkout — no real payment is processed.</p>
            <div className="rounded-xl border border-line bg-paper p-4 mt-4 space-y-3">
              <div>
                <label className="kicker block mb-1.5">Card number</label>
                <input defaultValue="4242 4242 4242 4242" className="w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] font-semibold outline-none focus:border-accent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="kicker block mb-1.5">Expiry</label>
                  <input defaultValue="09 / 28" className="w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] font-semibold outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="kicker block mb-1.5">CVC</label>
                  <input defaultValue="123" className="w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] font-semibold outline-none focus:border-accent" />
                </div>
              </div>
            </div>
            <button onClick={pay} className="mt-4 w-full btn-gold rounded-xl py-3.5 text-sm font-bold">Pay {money(amount)}</button>
            <button onClick={close} className="mt-2 w-full text-[12px] font-semibold text-muted py-2">Cancel</button>
          </>
        )}
        {phase === "processing" && (
          <div className="py-10 flex flex-col items-center">
            <span className="w-10 h-10 rounded-full border-[3px] border-line border-t-[var(--accent)] anim-spin-slow" />
            <p className="text-[13px] font-bold text-ink mt-4">Processing securely…</p>
          </div>
        )}
        {phase === "done" && <SuccessCheck label="Payment complete" sub="Your receipt was added to your email (demo)." />}
      </div>
    </Modal>
  );
}

/* ---------------- main profile ---------------- */

export default function Profile({ onOpen }: { onOpen: (o: Overlay) => void }) {
  const { s, emma, setTab, toast } = useDemo();
  const [pay, setPay] = useState<null | { title: string; amount: number }>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [help, setHelp] = useState(false);

  const rows: { icon: React.ReactNode; label: string; sub?: string; fn: () => void; badge?: string }[] = [
    { icon: <IcUser className="w-4.5 h-4.5" />, label: "Personal Information", fn: () => onOpen("info") },
    { icon: <IcCalendar className="w-4.5 h-4.5" />, label: "My Appointments", fn: () => setTab("appointments") },
    { icon: <IcClock className="w-4.5 h-4.5" />, label: "Treatment History", fn: () => onOpen("history") },
    { icon: <IcGift className="w-4.5 h-4.5" />, label: "Rewards", sub: `${emma.points.toLocaleString()} pts`, fn: () => setTab("rewards") },
    { icon: <IcSparkles className="w-4.5 h-4.5" />, label: "Membership", sub: s.member ? "Active" : "Not a member", fn: () => onOpen("membership"), badge: s.member ? "ACTIVE" : undefined },
    { icon: <IcHeart className="w-4.5 h-4.5" />, label: "Refer a Friend", sub: "Give $50, get $50", fn: () => onOpen("referral") },
    { icon: <IcCard className="w-4.5 h-4.5" />, label: "Payment Methods", fn: () => { setPay({ title: "Payment Methods", amount: 0 }); setPayOpen(true); } },
    { icon: <IcBell className="w-4.5 h-4.5" />, label: "Notifications", fn: () => onOpen("notifications") },
    { icon: <IcSliders className="w-4.5 h-4.5" />, label: "Preferences", fn: () => onOpen("prefs") },
    { icon: <IcMessage className="w-4.5 h-4.5" />, label: "Help & Support", fn: () => setHelp(true) },
  ];

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-charcoal text-cream p-5">
        <div className="absolute -right-10 -top-12 w-44 h-44 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-full btn-gold flex items-center justify-center font-display italic text-[24px] shrink-0">EC</span>
          <div className="min-w-0">
            <h1 className="font-display text-[22px] leading-tight flex items-center gap-2">
              Emma Carter
              {emma.status === "VIP" && <span className="text-[9px] font-bold tracking-[0.18em] bg-goldsoft text-espresso rounded-full px-2 py-0.5">VIP</span>}
            </h1>
            <p className="text-[12px] text-cream/65 truncate">emma@example.com</p>
            <p className="text-[11px] text-goldsoft font-bold mt-1">{emma.points.toLocaleString()} Glow Points · {emma.visits} visits</p>
          </div>
        </div>
      </section>

      <div className="mt-4 rounded-2xl border border-line bg-paper divide-y divide-linesoft">
        {rows.map((r) => (
          <button key={r.label} onClick={r.fn} className="w-full flex items-center gap-3.5 px-4.5 py-3.5 text-left hover:bg-cream transition-colors group" style={{ paddingInline: 18 }}>
            <span className="w-9 h-9 rounded-full bg-accent-tint text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">{r.icon}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-bold text-ink">{r.label}</span>
              {r.sub && <span className="block text-[11px] text-muted mt-0.5">{r.sub}</span>}
            </span>
            {r.badge && <span className="text-[9px] font-bold tracking-widest bg-sagetint text-sage rounded-full px-2 py-0.5">{r.badge}</span>}
            <IcChevR className="w-4 h-4 text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>

      <button onClick={() => toast("This is a demo — you're stuck with us ✨", "info")} className="mt-4 w-full text-[12px] font-bold text-muted py-2 hover:text-brick transition-colors">
        Sign out
      </button>
      <p className="text-center text-[10px] text-faint mt-1 mb-2">{s.brand.name} app · Demo build 1.0</p>

      {pay && pay.amount === 0 && (
        <Modal open={payOpen} onClose={() => setPayOpen(false)} sheet>
          <div className="p-6">
            <h3 className="font-display text-xl text-ink">Payment methods</h3>
            <div className="space-y-2.5 mt-4">
              <div className="flex items-center gap-3 rounded-xl border border-accent-soft bg-accent-tint/50 p-4">
                <span className="w-10 h-7 rounded-md bg-charcoal text-goldsoft text-[8px] font-extrabold flex items-center justify-center tracking-widest">VISA</span>
                <div className="flex-1"><p className="text-[12.5px] font-bold text-ink">•••• 4242</p><p className="text-[10.5px] text-muted">Default · expires 09/28</p></div>
                <IcCheck className="w-4 h-4 text-accent" />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-line bg-paper p-4">
                <span className="w-10 h-7 rounded-md bg-espresso text-cream text-[9px] font-bold flex items-center justify-center"></span>
                <div className="flex-1"><p className="text-[12.5px] font-bold text-ink">Apple Pay</p><p className="text-[10.5px] text-muted">Express checkout</p></div>
              </div>
            </div>
            <p className="text-[10.5px] text-faint mt-4 flex items-center gap-1.5"><IcShield className="w-3.5 h-3.5" /> Simulated payment data — nothing is stored or charged.</p>
            <button onClick={() => setPayOpen(false)} className="mt-4 w-full rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold">Done</button>
          </div>
        </Modal>
      )}

      <Modal open={help} onClose={() => setHelp(false)}>
        <div className="p-6">
          <h3 className="font-display text-xl text-ink">Help &amp; Support</h3>
          <div className="mt-4 space-y-2.5 text-[12.5px]">
            <p className="flex items-center gap-2.5 text-ink"><IcMessage className="w-4 h-4 text-accent" /> {s.brand.email}</p>
            <p className="flex items-center gap-2.5 text-ink"><IcBell className="w-4 h-4 text-accent" /> {s.brand.phone}</p>
            <p className="flex items-center gap-2.5 text-ink"><IcClock className="w-4 h-4 text-accent" /> {s.brand.hours}</p>
          </div>
          <p className="text-[11px] text-muted mt-4 leading-relaxed">Our care team replies within one business hour. For same-day changes, calling is fastest.</p>
          <button onClick={() => setHelp(false)} className="mt-4 w-full btn-gold rounded-xl py-3 text-[12.5px] font-bold">Got it</button>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- personal info ---------------- */

export function PersonalInfoScreen() {
  const { toast } = useDemo();
  const fields: [string, string][] = [
    ["Full name", "Emma Carter"], ["Email", "emma@example.com"], ["Phone", "(305) 555-0142"],
    ["Birthday", "June 14"], ["Skin profile", "Combination · sensitivity: low"], ["Preferred provider", "Emily Johnson"],
  ];
  return (
    <div>
      <div className="rounded-2xl border border-line bg-paper divide-y divide-linesoft">
        {fields.map(([k, v]) => (
          <div key={k} className="flex justify-between items-center px-5 py-3.5">
            <span className="text-[12px] text-muted">{k}</span>
            <span className="text-[12.5px] font-bold text-ink">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={() => toast("Editing is disabled in this demo", "info")} className="mt-4 w-full rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold hover:border-accent-soft transition-colors">
        Edit details
      </button>
      <p className="text-[10.5px] text-faint mt-3 leading-relaxed">We only store what's needed to pamper you. No medical records live in this app — those stay with your care team.</p>
    </div>
  );
}

/* ---------------- treatment history ---------------- */

export function HistoryScreen() {
  const { s, myAppts, setTab, setPrefill } = useDemo();
  const done = myAppts.filter((a) => a.status === "completed").sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      {done.length === 0 ? (
        <p className="text-sm text-muted text-center py-10">Your glow journey will appear here.</p>
      ) : (
        <ol className="relative border-l-2 border-line ml-3 space-y-6">
          {done.map((a) => {
            const t = treatmentById(a.treatmentId);
            const p = providerById(a.providerId);
            return (
              <li key={a.id} className="ml-5 relative">
                <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-accent border-[3px] border-ivory" />
                <p className="text-[10.5px] font-bold tracking-widest uppercase text-faint">{fmtLong(a.date)}</p>
                <div className="rounded-xl border border-line bg-paper p-4 mt-1.5 hover:border-accent-soft transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={t?.image} alt="" className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                    <div className="flex-1">
                      <p className="text-[13.5px] font-bold text-ink">{t?.name}</p>
                      <p className="text-[11px] text-muted">with {p?.name} · {money(a.price)}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-sagetint text-sage rounded-full px-2 py-0.5">Completed</span>
                  </div>
                  <button onClick={() => { setPrefill({ treatmentId: a.treatmentId, providerId: a.providerId }); setTab("book"); }}
                    className="mt-3 text-[11px] font-bold text-accent flex items-center gap-1">
                    Book again <IcArrowR className="w-3 h-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <p className="text-[10.5px] text-faint mt-6 leading-relaxed">A friendly timeline of your visits — clinical records are never shown in the client app.</p>
      <p className="text-[10px] text-faint mt-2">{s.brand.name} · {s.brand.location}</p>
    </div>
  );
}

/* ---------------- membership ---------------- */

export function MembershipScreen() {
  const { s, joinMembership, buyPackage } = useDemo();
  const [payItem, setPayItem] = useState<{ title: string; amount: number; fn: () => void } | null>(null);
  const glow = MEMBERSHIP_PLANS[0];
  const packs = MEMBERSHIP_PLANS.slice(1);

  return (
    <div>
      {/* membership */}
      <section className={`relative overflow-hidden rounded-2xl p-5 text-cream ${s.member ? "bg-sage" : "bg-charcoal"}`}>
        <div className="absolute -right-10 -top-12 w-44 h-44 rounded-full opacity-25" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
        <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-goldsoft">Glow Membership</p>
        <div className="flex items-end gap-1.5 mt-2">
          <span className="font-display text-[40px] leading-none">$149</span>
          <span className="text-[12px] text-cream/60 mb-1.5">/ month</span>
        </div>
        <ul className="mt-4 space-y-2">
          {glow.includes.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[12.5px]"><IcCheck className="w-4 h-4 text-goldsoft shrink-0" />{f}</li>
          ))}
        </ul>
        {s.member ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-cream/10 border border-cream/20 px-4 py-3">
            <IcSparkles className="w-4 h-4 text-goldsoft" />
            <p className="text-[12px] font-bold">You're a member ✨ Next HydraFacial credit renews monthly.</p>
          </div>
        ) : (
          <button onClick={() => setPayItem({ title: "Join Glow Membership", amount: 149, fn: joinMembership })}
            className="mt-5 w-full btn-gold rounded-xl py-3.5 text-sm font-bold tracking-wide">
            JOIN MEMBERSHIP
          </button>
        )}
      </section>

      {/* packages */}
      <p className="kicker mt-6 mb-2.5">Packages</p>
      <div className="space-y-3">
        {packs.map((pl) => {
          const owned = s.packagesOwned.includes(pl.id);
          return (
            <div key={pl.id} className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-accent">{pl.per}</p>
                  <h3 className="font-display text-[19px] text-ink mt-1">{pl.name}</h3>
                </div>
                <p className="font-display text-[26px] text-accent">{money(pl.price)}</p>
              </div>
              <ul className="mt-3 space-y-1.5">
                {pl.includes.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[11.5px] text-muted"><IcCheck className="w-3.5 h-3.5 text-accent shrink-0" />{f}</li>
                ))}
              </ul>
              <button disabled={owned}
                onClick={() => setPayItem({ title: pl.name, amount: pl.price, fn: () => buyPackage(pl.id, pl.name) })}
                className={`mt-4 w-full rounded-xl py-3 text-[12.5px] font-bold tracking-wide transition-colors ${owned ? "bg-sagetint text-sage cursor-default" : "bg-charcoal text-cream hover:bg-espresso"}`}>
                {owned ? "ON YOUR ACCOUNT ✓" : "PURCHASE PACKAGE"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-[10.5px] text-faint mt-4">Payments are simulated for this demonstration. Memberships appear instantly on the business dashboard.</p>

      <PaymentModal open={payItem !== null} onClose={() => setPayItem(null)} title={payItem?.title ?? ""} amount={payItem?.amount ?? 0}
        onSuccess={() => payItem?.fn()} />
    </div>
  );
}

/* ---------------- referral ---------------- */

export function ReferralScreen() {
  const { toast } = useDemo();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText("EMMA50"); } catch { /* clipboard unavailable */ }
    setCopied(true);
    toast("Referral code copied to clipboard");
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-charcoal text-cream p-6 text-center">
        <div className="absolute -left-10 -top-12 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
        <p className="kicker text-goldsoft">Share the glow ✨</p>
        <h2 className="font-display text-[24px] mt-2 leading-snug">Give your friends $50 OFF.<br />Get $50 in Glow Rewards.</h2>
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="rounded-xl border border-dashed border-goldsoft/60 bg-espresso/60 px-6 py-3 font-display text-[22px] tracking-[0.25em] text-goldsoft">EMMA50</span>
          <button onClick={copy} className="w-11 h-11 rounded-xl border border-cream/20 flex items-center justify-center text-cream/80 hover:text-goldsoft hover:border-goldsoft transition-colors" aria-label="Copy code">
            {copied ? <IcCheck className="w-5 h-5 text-goldsoft" /> : <IcCopy className="w-5 h-5" />}
          </button>
        </div>
        <button onClick={() => toast("Share sheet opened (demo)", "info")} className="mt-4 btn-gold rounded-full px-7 py-3 text-[12.5px] font-bold tracking-wide">SHARE MY CODE</button>
      </section>

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <div className="rounded-xl border border-line bg-paper p-4 text-center">
          <p className="font-display text-[30px] text-accent">3</p>
          <p className="text-[11px] font-bold text-muted mt-0.5">Friends referred</p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4 text-center">
          <p className="font-display text-[30px] text-accent">600</p>
          <p className="text-[11px] font-bold text-muted mt-0.5">Points earned</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-paper p-4">
        <p className="kicker mb-3">How it works</p>
        {[
          ["1", "Your friend books with code EMMA50 and gets $50 off."],
          ["2", "After their first visit, $50 in Glow Rewards lands in your wallet."],
          ["3", "Stack rewards with points — glow more, save more."],
        ].map(([n, t]) => (
          <div key={n} className="flex gap-3 items-start py-1.5">
            <span className="w-6 h-6 rounded-full bg-accent-tint text-accent text-[11px] font-extrabold flex items-center justify-center shrink-0">{n}</span>
            <p className="text-[12px] text-muted leading-relaxed">{t}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-faint mt-4 text-center">Fictional demo program — stats reset with the demo.</p>
    </div>
  );
}

/* ---------------- preferences ---------------- */

export function PreferencesScreen() {
  const { s, setNotifPref, toast } = useDemo();
  const [quiet, setQuiet] = useState(true);
  const [sms, setSms] = useState(false);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-line bg-paper divide-y divide-linesoft">
        {([
          ["Appointment reminders", "24 hours and 2 hours before", s.notifPrefs.reminders, (v: boolean) => setNotifPref("reminders", v)],
          ["Booking updates", "Confirmations and changes", s.notifPrefs.bookings, (v: boolean) => setNotifPref("bookings", v)],
          ["Offers & promotions", "Exclusive deals for you", s.notifPrefs.promos, (v: boolean) => setNotifPref("promos", v)],
        ] as [string, string, boolean, (v: boolean) => void][]).map(([label, sub, on, fn]) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">{label}</p>
              <p className="text-[11px] text-muted mt-0.5">{sub}</p>
            </div>
            <Toggle on={on} onChange={fn} label={label} />
          </div>
        ))}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">Quiet hours</p>
            <p className="text-[11px] text-muted mt-0.5">No notifications 9 PM – 8 AM</p>
          </div>
          <Toggle on={quiet} onChange={setQuiet} label="Quiet hours" />
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">Text messages</p>
            <p className="text-[11px] text-muted mt-0.5">SMS reminders as a backup</p>
          </div>
          <Toggle on={sms} onChange={setSms} label="Text messages" />
        </div>
      </div>
      <button onClick={() => toast("Preferences saved", "info")} className="w-full btn-gold rounded-xl py-3 text-[12.5px] font-bold">Save preferences</button>
    </div>
  );
}
