import { useState } from "react";
import { useDemo } from "../state/store";
import { REWARD_TIERS, EARN_WAYS, fmtShort, fmtMed } from "../data/demo";
import { Modal, EmptyState } from "../components/ui";
import { IcGift, IcSparkles, IcArrowR, IcCheck, IcTicket, IcCalendarPlus } from "../components/icons";

export default function Rewards() {
  const { emma, s, redeem, setTab } = useDemo();
  const [confirmTier, setConfirmTier] = useState<string | null>(null);
  const nextTier = REWARD_TIERS.find((r) => r.cost > emma.points) ?? REWARD_TIERS[REWARD_TIERS.length - 1];
  const progress = Math.min(100, (emma.points / nextTier.cost) * 100);
  const myRedemptions = s.redemptions.filter((r) => r.client === "Emma Carter");
  const tier = REWARD_TIERS.find((t) => t.id === confirmTier);

  return (
    <div>
      <p className="kicker text-accent">Glow Rewards</p>
      <h1 className="font-display text-[25px] text-ink mt-1">Loyalty, the Glow way</h1>

      {/* points hero */}
      <section className="mt-4 relative overflow-hidden rounded-2xl bg-charcoal text-cream p-5">
        <div className="absolute -right-8 -top-12 w-40 h-40 rounded-full opacity-25" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
        <div className="flex items-center gap-2 text-goldsoft">
          <IcSparkles className="w-4 h-4" />
          <p className="text-[10px] tracking-[0.24em] uppercase font-bold">Your balance</p>
        </div>
        <p className="font-display text-[42px] leading-none mt-2.5">
          {emma.points.toLocaleString()}
          <span className="text-[15px] text-cream/60 font-body font-semibold ml-2">pts</span>
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-semibold text-cream/70 mb-1.5">
            <span>Next reward: <strong className="text-goldsoft">{nextTier.name}</strong></span>
            <span>{emma.points} / {nextTier.cost}</span>
          </div>
          <div className="h-2 rounded-full bg-cream/15 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--accent-soft), #e0c289)", transition: "width 1s cubic-bezier(0.22,0.7,0.3,1)" }} />
          </div>
          <p className="text-[11px] text-cream/55 mt-1.5">{Math.max(0, nextTier.cost - emma.points)} points to unlock</p>
        </div>
      </section>

      {/* earn */}
      <section className="mt-5">
        <p className="kicker mb-2.5">How you earn</p>
        <div className="grid grid-cols-2 gap-2.5">
          {EARN_WAYS.map((w) => (
            <div key={w.label} className="rounded-xl border border-line bg-paper p-3.5 hover:-translate-y-0.5 transition-transform">
              <p className="font-display text-xl text-accent">+{w.pts}</p>
              <p className="text-[11.5px] font-semibold text-ink mt-0.5">{w.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* tiers */}
      <section className="mt-5">
        <p className="kicker mb-2.5">Redeem your points</p>
        <div className="space-y-2.5">
          {REWARD_TIERS.map((r) => {
            const can = emma.points >= r.cost;
            return (
              <div key={r.id} className={`flex items-center gap-3.5 rounded-xl border p-3.5 transition-all ${can ? "border-accent-soft bg-accent-tint/60" : "border-line bg-paper opacity-75"}`}>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${can ? "btn-gold" : "bg-linesoft text-faint"}`}>
                  <IcGift className="w-4.5 h-4.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-ink">{r.name}</p>
                  <p className="text-[11px] text-muted">{r.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[12px] font-extrabold ${can ? "text-accent" : "text-faint"}`}>{r.cost} pts</p>
                  <button disabled={!can} onClick={() => setConfirmTier(r.id)}
                    className={`mt-1 text-[10.5px] font-bold rounded-full px-3 py-1.5 transition-colors ${can ? "bg-charcoal text-cream hover:bg-espresso" : "bg-linesoft text-faint cursor-not-allowed"}`}>
                    {can ? "Redeem" : "Locked"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* history */}
      <section className="mt-5">
        <p className="kicker mb-2.5">Reward history</p>
        {myRedemptions.length === 0 ? (
          <EmptyState icon={<IcGift className="w-6 h-6" />} title="No rewards redeemed yet"
            sub="When you redeem a reward, it will be waiting for you at the spa."
            action={<button onClick={() => setTab("book")} className="text-[12px] font-bold text-accent flex items-center gap-1 mx-auto">Earn points with a visit <IcArrowR className="w-3.5 h-3.5" /></button>} />
        ) : (
          <div className="space-y-2">
            {myRedemptions.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                <span className="w-8 h-8 rounded-full bg-sagetint text-sage flex items-center justify-center"><IcCheck className="w-4 h-4" /></span>
                <div className="flex-1">
                  <p className="text-[12.5px] font-bold text-ink">{r.reward}</p>
                  <p className="text-[10.5px] text-faint">{fmtMed(r.date)}</p>
                </div>
                <span className="text-[12px] font-extrabold text-brick">−{r.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* confirm redeem */}
      <Modal open={confirmTier !== null} onClose={() => setConfirmTier(null)}>
        {tier && (
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full btn-gold flex items-center justify-center mx-auto"><IcGift className="w-6 h-6" /></div>
            <h3 className="font-display text-xl text-ink mt-4">Redeem {tier.name}?</h3>
            <p className="text-[12.5px] text-muted mt-1.5">{tier.cost} points will be used. Your reward is ready at your next visit.</p>
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <button onClick={() => setConfirmTier(null)} className="rounded-xl border border-line bg-paper py-3 text-[12.5px] font-bold">Not now</button>
              <button onClick={() => { redeem(tier.id); setConfirmTier(null); }} className="btn-gold rounded-xl py-3 text-[12.5px] font-bold">Redeem</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= PROMOTIONS ================= */

export function PromotionsScreen() {
  const { s, setPrefill, setTab } = useDemo();
  const active = s.promotions;

  const book = (treatmentId?: string | null, promoId?: string) => {
    setPrefill({ treatmentId: treatmentId ?? undefined, promoId: treatmentId ? promoId : undefined });
    setTab("book");
  };

  if (active.length === 0) {
    return (
      <EmptyState icon={<IcTicket className="w-6 h-6" />} title="No active promotions"
        sub="New offers from the spa will appear here the moment they go live." />
    );
  }

  return (
    <div className="space-y-3.5">
      <p className="text-[12px] text-muted -mb-1">Curated offers from {s.brand.name}. New campaigns appear here instantly.</p>
      {active.map((p, i) => (
        <article key={p.id} className="anim-fade-up relative overflow-hidden rounded-2xl border border-line bg-paper p-4.5 hover:border-accent-soft hover:-translate-y-0.5 transition-all duration-300" style={{ animationDelay: `${i * 40}ms`, padding: 18 }}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 bg-accent-tint" />
          <div className="relative">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] bg-charcoal text-goldsoft rounded-full px-2.5 py-1">
                {p.kind === "percent" ? "Limited offer" : p.kind === "dollars" ? "For you" : p.kind === "upgrade" ? "Upgrade" : "Event"}
              </span>
              {p.isNew && (
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] bg-sagetint text-sage rounded-full px-2.5 py-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" style={{ animation: "blinkDot 1.6s infinite" }} /> New
                </span>
              )}
              <span className="ml-auto text-[10px] text-faint">{p.audience}</span>
            </div>
            <h3 className="font-display text-[21px] text-ink mt-2.5 leading-tight">{p.offer}</h3>
            <p className="text-[10.5px] tracking-[0.2em] uppercase font-bold text-accent mt-1">{p.title}</p>
            <p className="text-[12px] text-muted mt-1.5 italic font-display">“{p.detail}”</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10.5px] text-faint">Valid through {fmtShort(p.expires)}</span>
              <button onClick={() => book(p.treatmentId, p.id)} className="btn-gold rounded-full px-4.5 py-2 text-[11.5px] font-bold tracking-wide flex items-center gap-1.5" style={{ paddingInline: 16 }}>
                <IcCalendarPlus className="w-3.5 h-3.5" /> BOOK NOW
              </button>
            </div>
          </div>
        </article>
      ))}
      <p className="text-center text-[10px] text-faint pt-1">Fictional demo offers — no real purchases.</p>
    </div>
  );
}
