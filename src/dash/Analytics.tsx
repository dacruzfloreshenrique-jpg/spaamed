import { useState } from "react";
import { useDemo } from "../state/store";
import { BASE_METRICS, TOP_TREATMENTS, REVENUE_SERIES, APPT_SERIES, money } from "../data/demo";
import { CountUp, Reveal, Seg } from "../components/ui";
import { AreaChart, HBars } from "../components/charts";
import { IcTrend, IcCalendar, IcUsers, IcRefresh, IcWallet, IcX } from "../components/icons";

type Range = "7d" | "30d" | "90d";

export default function Analytics() {
  const { s } = useDemo();
  const [range, setRange] = useState<Range>("30d");
  const [avgValue, setAvgValue] = useState(237);
  const [clientsMo, setClientsMo] = useState(180);
  const [repeatNow, setRepeatNow] = useState(38);

  const lift = Math.max(2, Math.round((61 - repeatNow) * 0.35));
  const addVisits = Math.round((clientsMo * lift) / 100);
  const addRevenue = addVisits * avgValue;

  const kpis = [
    { k: "Revenue", v: REVENUE_SERIES[range].reduce((a, b) => a + b, 0), prefix: "$", icon: <IcTrend className="w-4 h-4" /> },
    { k: "Appointments", v: APPT_SERIES[range].reduce((a, b) => a + b, 0), icon: <IcCalendar className="w-4 h-4" /> },
    { k: "New clients", v: range === "7d" ? 9 : range === "30d" ? 34 : 96, icon: <IcUsers className="w-4 h-4" /> },
    { k: "Returning clients", v: range === "7d" ? 21 : range === "30d" ? 76 : 214, icon: <IcRefresh className="w-4 h-4" /> },
    { k: "Repeat booking rate", v: BASE_METRICS.repeatRate, suffix: "%", icon: <IcRefresh className="w-4 h-4" /> },
    { k: "Avg client value", v: BASE_METRICS.avgClientValue, prefix: "$", icon: <IcWallet className="w-4 h-4" /> },
    { k: "Cancellation rate", v: BASE_METRICS.cancellationRate, suffix: "%", icon: <IcX className="w-4 h-4" /> },
    { k: "Referral revenue", v: BASE_METRICS.referralRevenue, prefix: "$", icon: <IcUsers className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-muted">Outcome-focused metrics for {s.brand.name}. <span className="text-faint">All figures are illustrative demo data.</span></p>
        <Seg<Range> options={[{ id: "7d", label: "7 days" }, { id: "30d", label: "30 days" }, { id: "90d", label: "90 days" }]} value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((c, i) => (
          <Reveal key={c.k} delay={(i % 4) * 55}>
            <div className="rounded-xl border border-line bg-paper p-4 h-full hover:-translate-y-0.5 transition-transform">
              <span className="w-8 h-8 rounded-full bg-accent-tint text-accent flex items-center justify-center">{c.icon}</span>
              <p className="font-display text-[24px] text-ink leading-none mt-3">
                <CountUp value={c.v} prefix={c.prefix ?? ""} suffix={c.suffix ?? ""} />
              </p>
              <p className="text-[10.5px] font-bold text-muted mt-1.5">{c.k}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Reveal>
          <section className="rounded-xl border border-line bg-paper p-5 h-full">
            <p className="kicker mb-4">Top treatments by revenue</p>
            <HBars items={TOP_TREATMENTS.map((t) => ({ label: t.name, value: t.revenue, share: t.share }))} format={money} />
            <p className="text-[10px] text-faint mt-4">HydraFacial leads — a perfect anchor for memberships and rebooking cadence.</p>
          </section>
        </Reveal>

        {/* ROI calculator */}
        <Reveal delay={90}>
          <section className="rounded-xl bg-charcoal text-cream p-5 h-full relative overflow-hidden">
            <div className="absolute -right-14 -top-16 w-52 h-52 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }} />
            <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-goldsoft">Retention economics · illustrative scenario</p>
            <h3 className="font-display text-[22px] mt-1.5">What would a few more repeat visits be worth?</h3>

            <div className="mt-5 space-y-4 relative">
              <CalcSlider label="Average treatment value" value={avgValue} set={setAvgValue} min={99} max={600} step={1} fmt={money} />
              <CalcSlider label="Monthly active clients" value={clientsMo} set={setClientsMo} min={40} max={600} step={10} fmt={(n) => String(n)} />
              <CalcSlider label="Current repeat-visit rate" value={repeatNow} set={setRepeatNow} min={10} max={70} step={1} fmt={(n) => `${n}%`} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/10 relative">
              <div>
                <p className="text-[10px] tracking-widest uppercase font-bold text-cream/50">Potential additional<br />repeat visits / mo</p>
                <p className="font-display text-[30px] text-goldsoft mt-1.5 leading-none"><CountUp value={addVisits} /></p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase font-bold text-cream/50">Illustrative additional<br />revenue / mo</p>
                <p className="font-display text-[30px] text-goldsoft mt-1.5 leading-none"><CountUp value={addRevenue} prefix="$" /></p>
              </div>
            </div>
            <p className="text-[10px] text-cream/40 mt-5 leading-relaxed relative">
              Illustrative example only — assumes a +{lift} point lift in repeat rate. Potential, not promised.
              Actual results vary by business.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}

function CalcSlider({ label, value, set, min, max, step, fmt }: {
  label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; fmt: (n: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-[11.5px] font-bold text-cream/80">{label}</label>
        <span className="font-display text-[16px] text-goldsoft">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className="w-full" aria-label={label} />
    </div>
  );
}
