import { useState } from "react";
import { useDemo } from "../state/store";
import {
  BASE_METRICS, REVENUE_SERIES, APPT_SERIES, eligibleForRebook, money, todayISO, greeting,
} from "../data/demo";
import { CountUp, Reveal, Seg } from "../components/ui";
import { AreaChart, BarsChart, Donut } from "../components/charts";
import { IcUsers, IcRefresh, IcTicket, IcGift, IcArrowR, IcTrend, IcCalendar, IcSpark } from "../components/icons";

type Range = "today" | "7d" | "30d" | "90d";
const TODAY_REV = [320, 180, 420, 610, 540, 760, 890, 530];
const TODAY_APT = [2, 1, 3, 4, 3, 5, 4, 1];

const RANGE_LABEL: Record<Range, string> = { today: "Today · hourly", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days · weekly" };

export default function Overview() {
  const { s, setDash, toast } = useDemo();
  const [revRange, setRevRange] = useState<Range>("7d");
  const [aptRange, setAptRange] = useState<Range>("7d");

  const today = todayISO();
  const todays = s.appointments.filter((a) => a.date === today && a.status !== "cancelled");
  const rebookCount = s.clients.filter(eligibleForRebook).length;
  const revData = revRange === "today" ? TODAY_REV : REVENUE_SERIES[revRange];
  const aptData = aptRange === "today" ? TODAY_APT : APPT_SERIES[aptRange];
  const revTotal = revData.reduce((a, b) => a + b, 0) + (revRange === "today" ? s.addedRevenue : 0);

  const kpis = [
    { label: "Today's appointments", value: todays.length, icon: <IcCalendar className="w-4 h-4" />, delta: "+4 vs. yesterday", up: true },
    { label: "Today's revenue", value: BASE_METRICS.todayRevenue + s.addedRevenue, prefix: "$", icon: <IcTrend className="w-4 h-4" />, delta: s.addedRevenue > 0 ? `+$${s.addedRevenue} this session` : "+11% vs. last week", up: true },
    { label: "New clients", value: BASE_METRICS.newClientsToday, icon: <IcSpark className="w-4 h-4" />, delta: "2 via referral", up: true },
    { label: "Returning clients", value: BASE_METRICS.returningToday, icon: <IcUsers className="w-4 h-4" />, delta: "68% of today's book", up: true },
    { label: "Rebooking opportunities", value: rebookCount, icon: <IcRefresh className="w-4 h-4" />, delta: "ready to contact", up: true, accent: true },
  ];

  const opps = [
    {
      icon: <IcRefresh className="w-5 h-5" />, n: rebookCount, title: "Clients ready to rebook",
      sub: "These clients may be ready for their next treatment.", cta: "VIEW CLIENTS", go: () => setDash("rebooking"),
    },
    {
      icon: <IcUsers className="w-5 h-5" />, n: BASE_METRICS.inactiveHighValue, title: "Inactive high-value clients",
      sub: "These clients haven't visited recently.", cta: "CREATE WIN-BACK CAMPAIGN", go: () => setDash("rebooking"),
    },
    {
      icon: <IcTicket className="w-5 h-5" />, n: Math.max(s.openSlots.length, 3), title: "Open appointment slots",
      sub: "Fill today's cancelled appointments.", cta: "VIEW WAITLIST", go: () => setDash("rebooking"),
    },
    {
      icon: <IcGift className="w-5 h-5" />, n: BASE_METRICS.readyForRewards, title: "Clients ready for rewards",
      sub: "Encourage another visit.", cta: "VIEW REWARDS", go: () => setDash("rewards"),
    },
  ];

  return (
    <div className="space-y-7">
      {/* greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[30px] leading-tight text-ink">
            <span className="mask-line"><span>{greeting()}, Jessica.</span></span>
          </h2>
          <p className="text-[13px] text-muted mt-1">Here's what's happening at {s.brand.name} today.</p>
        </div>
        <p className="text-[11px] text-faint">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {s.brand.location}</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 60}>
            <div className={`rounded-xl border p-4 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(36,31,25,0.35)] ${k.accent ? "bg-charcoal border-charcoal text-cream" : "bg-paper border-line"}`}>
              <div className="flex items-center justify-between">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${k.accent ? "bg-goldsoft/20 text-goldsoft" : "bg-accent-tint text-accent"}`}>{k.icon}</span>
                <span className={`text-[9.5px] font-bold uppercase tracking-wider rounded-full px-2 py-1 ${k.accent ? "bg-goldsoft/15 text-goldsoft" : "bg-sagetint text-sage"}`}>{k.delta}</span>
              </div>
              <p className={`font-display text-[30px] leading-none mt-3.5 ${k.accent ? "text-cream" : "text-ink"}`}>
                <CountUp value={k.value} prefix={k.prefix ?? ""} />
              </p>
              <p className={`text-[11px] font-semibold mt-1.5 ${k.accent ? "text-cream/60" : "text-muted"}`}>{k.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* charts */}
      <div className="grid xl:grid-cols-3 gap-4">
        <Reveal className="xl:col-span-2">
          <section className="rounded-xl border border-line bg-paper p-5 h-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="kicker">Revenue</p>
                <p className="font-display text-[24px] text-ink mt-1">
                  <CountUp value={revTotal} prefix="$" />
                </p>
                <p className="text-[11px] text-faint mt-0.5">{RANGE_LABEL[revRange]}</p>
              </div>
              <Seg<Range> size="sm" options={[{ id: "today", label: "Today" }, { id: "7d", label: "7 days" }, { id: "30d", label: "30 days" }, { id: "90d", label: "90 days" }]} value={revRange} onChange={setRevRange} />
            </div>
            <AreaChart key={revRange} data={revData} height={200} />
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section className="rounded-xl border border-line bg-paper p-5 h-full flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="kicker">Appointments</p>
                <p className="text-[11px] text-faint mt-1">{RANGE_LABEL[aptRange]}</p>
              </div>
              <Seg<Range> size="sm" options={[{ id: "7d", label: "7d" }, { id: "30d", label: "30d" }]} value={aptRange === "90d" || aptRange === "today" ? "7d" : aptRange} onChange={(v) => setAptRange(v)} />
            </div>
            <div className="flex-1 flex items-end">
              <div className="w-full">
                <BarsChart key={aptRange} data={aptData} height={168} />
                <div className="flex justify-between mt-2 text-[9px] text-faint font-semibold">
                  {(aptRange === "30d" ? ["Jun 1", "Jun 10", "Jun 20", "Today"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map((d) => <span key={d}>{d}</span>)}
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      {/* retention */}
      <Reveal>
        <section className="rounded-xl border border-line bg-paper p-5 flex flex-wrap items-center gap-6">
          <Donut
            segments={[{ value: 68, color: "var(--accent)" }, { value: 32, color: "#e2d7bf" }]}
            centerTop="68%" centerSub="Returning" />
          <div className="flex-1 min-w-[220px]">
            <p className="kicker">Client retention</p>
            <h3 className="font-display text-[22px] text-ink mt-1.5">Your regulars are the business.</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                ["New clients", "32%"],
                ["Returning", "68%"],
                ["Repeat booking rate", `${BASE_METRICS.repeatRate}%`],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="font-display text-xl text-ink">{v}</p>
                  <p className="text-[10.5px] text-muted font-semibold mt-0.5">{k}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent-tint border border-accent-soft px-4 py-3 max-w-[260px]">
            <IcSpark className="w-4 h-4 text-accent shrink-0" />
            <p className="text-[11px] text-ink leading-snug">Repeat clients spend <strong>2.4×</strong> more per year than first-timers.</p>
          </div>
        </section>
      </Reveal>

      {/* opportunities */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="kicker text-accent">Business opportunities</p>
            <h3 className="font-display text-[24px] text-ink mt-1">
              <span className="mask-line"><span>Today's opportunities</span></span>
            </h3>
          </div>
          <p className="text-[11px] text-faint hidden sm:block">Ranked by revenue potential · demo data</p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {opps.map((o, i) => (
            <Reveal key={o.title} delay={i * 70}>
              <button onClick={o.go} className="w-full text-left rounded-xl border border-line bg-paper p-5 h-full group transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-soft hover:shadow-[0_20px_44px_-20px_rgba(36,31,25,0.4)]">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-accent-tint text-accent flex items-center justify-center group-hover:scale-110 transition-transform">{o.icon}</span>
                  <span className="font-display text-[32px] text-ink leading-none"><CountUp value={o.n} /></span>
                </div>
                <p className="text-[14px] font-bold text-ink mt-3.5">{o.title}</p>
                <p className="text-[11.5px] text-muted mt-1 leading-snug">{o.sub}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-wider text-accent">
                  {o.cta} <IcArrowR className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* revenue impact */}
      <Reveal>
        <section className="relative overflow-hidden rounded-2xl bg-espresso text-cream p-6 lg:p-8">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
          <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-goldsoft/40 to-transparent" />
          <div className="relative">
            <p className="text-[10px] tracking-[0.26em] uppercase font-bold text-goldsoft">App-driven opportunities · this quarter</p>
            <h3 className="font-display text-[26px] mt-2">Revenue the app quietly created.</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-6">
              {[
                ["Repeat bookings", 8420],
                ["Recovered clients", 4250],
                ["Referral revenue", 2140],
                ["Promotion revenue", 3680],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <p className="font-display text-[26px] text-goldsoft"><CountUp value={v as number} prefix="$" /></p>
                  <p className="text-[11px] text-cream/55 font-semibold mt-1">{k}</p>
                </div>
              ))}
              <div className="border-l border-white/10 pl-5">
                <p className="font-display text-[26px] text-cream"><CountUp value={18490} prefix="$" /></p>
                <p className="text-[11px] text-goldsoft font-bold mt-1 tracking-wide uppercase">Total tracked</p>
              </div>
            </div>
            <p className="text-[10.5px] text-cream/40 mt-6 leading-relaxed max-w-xl">
              Illustrative demo data. Illustrative example based on demo activity — actual results vary by business.
              Nothing here is a guarantee of revenue.
            </p>
          </div>
        </section>
      </Reveal>

      {/* quick toast for demo nudge */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-line bg-cream px-5 py-4">
        <p className="text-[12px] text-muted flex-1 min-w-[220px]">
          <strong className="text-ink">Presenting?</strong> Try the loop: book in the client app → mark it completed here → watch points, rebooking and reviews light up on both sides.
        </p>
        <button onClick={() => toast("Tip: open the client app from the sidebar to see changes live", "info")} className="text-[11.5px] font-bold text-accent border border-accent-soft rounded-full px-4 py-2 hover:bg-accent-tint transition-colors">
          Show me how
        </button>
      </div>
    </div>
  );
}
