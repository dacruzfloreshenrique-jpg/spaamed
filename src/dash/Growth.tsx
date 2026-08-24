import { useState } from "react";
import { useDemo } from "../state/store";
import { BASE_METRICS, MEMBERSHIP_PLANS, fmtMed, money } from "../data/demo";
import { CountUp, Reveal, Stars } from "../components/ui";
import { AreaChart } from "../components/charts";
import { REFERRAL_SERIES } from "../data/demo";
import { IcGift, IcSparkles, IcStar, IcHeart, IcTrend, IcUsers, IcCheck } from "../components/icons";

/* ================= REWARDS ================= */

export function RewardsDash() {
  const { s } = useDemo();
  const readyClients = s.clients.filter((c) => c.points >= 750).slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        {[
          { k: "Points issued", v: BASE_METRICS.pointsIssued + s.addedRevenue, prefix: "", sub: "all time · demo" },
          { k: "Redemptions", v: BASE_METRICS.redemptionsTotal + s.redemptions.filter((r) => r.client === "Emma Carter").length, prefix: "", sub: "rewards claimed" },
          { k: "Reward liability", v: BASE_METRICS.rewardLiability, prefix: "$", sub: "outstanding value" },
          { k: "Enrolled clients", v: BASE_METRICS.enrolled, prefix: "", sub: "in Glow Rewards" },
        ].map((c, i) => (
          <Reveal key={c.k} delay={i * 60}>
            <div className="rounded-xl border border-line bg-paper p-4.5 h-full" style={{ padding: 18 }}>
              <p className="font-display text-[28px] text-ink leading-none"><CountUp value={c.v} prefix={c.prefix} /></p>
              <p className="text-[11px] font-bold text-muted mt-2">{c.k}</p>
              <p className="text-[9.5px] text-faint mt-0.5">{c.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-line bg-paper p-5">
          <p className="kicker mb-3">Recent redemptions · live from the app</p>
          <div className="space-y-2">
            {s.redemptions.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-line bg-cream px-4 py-3">
                <span className="w-8 h-8 rounded-full bg-goldtint text-accent flex items-center justify-center shrink-0"><IcGift className="w-4 h-4" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-bold text-ink">{r.client} <span className="text-muted font-semibold">redeemed</span> {r.reward}</p>
                  <p className="text-[10.5px] text-faint">{fmtMed(r.date)}</p>
                </div>
                <span className="text-[12px] font-extrabold text-brick shrink-0">−{r.points} pts</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-paper p-5">
          <p className="kicker mb-3">Ready to redeem · nudge them back</p>
          {readyClients.length === 0 && <p className="text-[12.5px] text-muted py-8 text-center">No clients over 750 points right now.</p>}
          <div className="space-y-2">
            {readyClients.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-line bg-cream px-4 py-3">
                <span className="w-8 h-8 rounded-full text-cream text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: `hsl(${(c.name.length * 37) % 360} 24% 42%)` }}>
                  {c.name.split(" ").map((x) => x[0]).join("")}
                </span>
                <div className="flex-1">
                  <p className="text-[12.5px] font-bold text-ink">{c.name}</p>
                  <p className="text-[10.5px] text-muted">{c.points.toLocaleString()} pts · {c.status}</p>
                </div>
                <span className="text-[10px] font-bold text-accent bg-accent-tint rounded-full px-2.5 py-1">$50 off ready</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-faint mt-4">Clients who redeem within 7 days rebook at 2× the normal rate.</p>
        </section>
      </div>
    </div>
  );
}

/* ================= MEMBERSHIPS ================= */

export function MembershipsDash() {
  const { s } = useDemo();
  const active = BASE_METRICS.membersActive + s.memberJoins;
  const mrr = BASE_METRICS.mrr + s.memberJoins * 149;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        {[
          { k: "Active members", v: active, prefix: "", sub: s.memberJoins > 0 ? `+${s.memberJoins} from this demo session` : "demo data" },
          { k: "Monthly recurring revenue", v: mrr, prefix: "$", sub: s.memberJoins > 0 ? "live — includes demo join" : "demo data" },
          { k: "Membership churn", v: BASE_METRICS.churn, prefix: "", suffix: "%", sub: "trailing 90 days" },
          { k: "Most popular", v: 0, prefix: "", sub: "Glow Membership · $149", text: true },
        ].map((c, i) => (
          <Reveal key={c.k} delay={i * 60}>
            <div className={`rounded-xl border p-4.5 h-full ${i === 3 ? "bg-charcoal border-charcoal" : "border-line bg-paper"}`} style={{ padding: 18 }}>
              {c.text ? (
                <>
                  <p className="font-display text-[22px] text-goldsoft leading-tight mt-1">Glow<br />Membership</p>
                  <p className="text-[11px] font-bold text-cream/60 mt-2">{c.k}</p>
                </>
              ) : (
                <>
                  <p className={`font-display text-[28px] leading-none ${i === 3 ? "text-cream" : "text-ink"}`}>
                    <CountUp value={c.v} prefix={c.prefix} suffix={c.suffix ?? ""} decimals={c.k.includes("churn") ? 1 : 0} />
                  </p>
                  <p className={`text-[11px] font-bold mt-2 ${i === 3 ? "text-cream/60" : "text-muted"}`}>{c.k}</p>
                </>
              )}
              <p className={`text-[9.5px] mt-0.5 ${i === 3 ? "text-cream/35" : "text-faint"}`}>{c.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <section>
        <p className="kicker mb-3">Plans &amp; packages</p>
        <div className="grid md:grid-cols-3 gap-3.5">
          {MEMBERSHIP_PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <div className={`rounded-xl border p-5 h-full relative ${p.featured ? "border-accent bg-paper" : "border-line bg-paper"}`}>
                {p.featured && <span className="absolute -top-2.5 left-5 text-[8.5px] font-bold tracking-[0.18em] uppercase btn-gold rounded-full px-2.5 py-1">Most loved</span>}
                <p className="font-display text-[19px] text-ink">{p.name}</p>
                <p className="mt-1.5"><span className="font-display text-[28px] text-accent">{money(p.price)}</span> <span className="text-[11px] text-muted">/ {p.per}</span></p>
                <ul className="mt-3.5 space-y-1.5">
                  {p.includes.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[11.5px] text-muted"><IcCheck className="w-3.5 h-3.5 text-accent shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <p className="text-[10.5px] text-faint flex items-center gap-1.5"><IcSparkles className="w-3.5 h-3.5" /> Membership figures are demo data. When Emma joins in the client app, active members and MRR update live above.</p>
    </div>
  );
}

/* ================= REFERRALS & REPUTATION ================= */

export function ReferralsDash() {
  const { toast } = useDemo();
  const [range] = useState("12 months");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        {[
          { k: "Referrals", v: BASE_METRICS.referrals, icon: <IcHeart className="w-4 h-4" /> },
          { k: "New clients", v: BASE_METRICS.referralClients, icon: <IcUsers className="w-4 h-4" /> },
          { k: "Referral revenue", v: BASE_METRICS.referralRevenue, prefix: "$", icon: <IcTrend className="w-4 h-4" /> },
          { k: "Rewards issued", v: BASE_METRICS.referralRewards, prefix: "$", icon: <IcGift className="w-4 h-4" /> },
        ].map((c, i) => (
          <Reveal key={c.k} delay={i * 60}>
            <div className="rounded-xl border border-line bg-paper p-4.5 h-full" style={{ padding: 18 }}>
              <span className="w-8 h-8 rounded-full bg-accent-tint text-accent flex items-center justify-center">{c.icon}</span>
              <p className="font-display text-[28px] text-ink leading-none mt-3"><CountUp value={c.v} prefix={c.prefix ?? ""} /></p>
              <p className="text-[11px] font-bold text-muted mt-1.5">{c.k}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <section className="lg:col-span-3 rounded-xl border border-line bg-paper p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="kicker">Referral performance</p>
              <p className="text-[11px] text-faint mt-1">{range} · clearly demo data</p>
            </div>
            <span className="text-[10px] font-bold text-sage bg-sagetint rounded-full px-2.5 py-1">+38% YoY</span>
          </div>
          <AreaChart data={REFERRAL_SERIES} height={180} />
          <div className="flex justify-between mt-2 text-[9.5px] text-faint font-semibold">
            {["Jul", "Sep", "Nov", "Jan", "Mar", "May"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </section>

        <section className="lg:col-span-2 rounded-xl border border-line bg-paper p-5">
          <p className="kicker mb-3">Top referrers</p>
          <div className="space-y-2.5">
            {[
              ["Emma Carter", 3, 600], ["Victoria Lane", 5, 1000], ["Harper Quinn", 4, 800], ["Nora Patel", 2, 400],
            ].map(([n, r, p], i) => (
              <div key={n as string} className="flex items-center gap-3">
                <span className="font-display text-[15px] text-faint w-4">{i + 1}</span>
                <span className="w-8 h-8 rounded-full text-cream text-[10px] font-bold flex items-center justify-center" style={{ background: `hsl(${((n as string).length * 37) % 360} 24% 42%)` }}>
                  {(n as string).split(" ").map((x) => x[0]).join("")}
                </span>
                <div className="flex-1">
                  <p className="text-[12.5px] font-bold text-ink">{n}</p>
                  <p className="text-[10.5px] text-muted">{r} friends · {p} pts earned</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* reputation */}
      <section className="rounded-xl border border-line bg-paper p-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="text-center">
            <p className="font-display text-[46px] text-ink leading-none">{BASE_METRICS.avgRating}</p>
            <Stars value={5} />
            <p className="text-[10.5px] text-muted font-semibold mt-1.5">{BASE_METRICS.reviewsThisMonth} reviews this month</p>
          </div>
          <div className="flex-1 min-w-[240px]">
            <p className="kicker mb-3">Client feedback · fictional demo reviews</p>
            <div className="grid md:grid-cols-2 gap-2.5">
              {[0, 1, 2, 3].map((i) => {
                const r = [
                  { n: "Camila R.", t: "HydraFacial", x: "My skin has never looked this good. The whole visit feels like a ritual." },
                  { n: "Jordan P.", t: "Botox", x: "Completely natural results. Nobody can tell — I just look rested." },
                  { n: "Dana W.", t: "Laser", x: "Four sessions in and the difference is unreal. Booking is effortless." },
                  { n: "Alex T.", t: "CoolSculpting", x: "The team tracked my progress visit by visit. Warm and professional." },
                ][i];
                return (
                  <div key={r.n} className="rounded-lg border border-line bg-cream px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-bold text-ink">{r.n} <span className="text-faint font-semibold">· {r.t}</span></p>
                      <Stars value={5} size="w-3 h-3" />
                    </div>
                    <p className="text-[11.5px] text-muted mt-1 leading-snug">“{r.x}”</p>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={() => toast("Review requests queued for 12 recent clients (demo)", "info")}
            className="btn-gold rounded-full px-6 py-3 text-[11.5px] font-bold tracking-wide self-start flex items-center gap-2">
            <IcStar className="w-4 h-4" /> REQUEST REVIEWS
          </button>
        </div>
        <p className="text-[10px] text-faint mt-4">Reviews shown are fictional demonstration content, not real Google reviews.</p>
      </section>
    </div>
  );
}
