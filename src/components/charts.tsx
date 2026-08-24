import { useId } from "react";

function pathFrom(data: number[], w: number, h: number, pad = 6): string {
  const max = Math.max(...data) * 1.08;
  const min = Math.min(...data) * 0.85;
  const x = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  let d = `M ${x(0)} ${y(data[0])}`;
  for (let i = 1; i < data.length; i++) {
    const cx = (x(i - 1) + x(i)) / 2;
    d += ` C ${cx} ${y(data[i - 1])}, ${cx} ${y(data[i])}, ${x(i)} ${y(data[i])}`;
  }
  return d;
}

export function AreaChart({ data, height = 190, dark = false }: { data: number[]; height?: number; dark?: boolean }) {
  const id = useId().replace(/:/g, "");
  const W = 600;
  const line = pathFrom(data, W, height);
  const last = data[data.length - 1];
  const max = Math.max(...data) * 1.08;
  const min = Math.min(...data) * 0.85;
  const lx = W - 6;
  const ly = height - 6 - ((last - min) / (max - min || 1)) * (height - 12);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none" role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={dark ? 0.4 : 0.28} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="6" x2={W - 6} y1={height * f} y2={height * f} stroke={dark ? "rgba(255,255,255,0.08)" : "#e6dcc8"} strokeDasharray="3 5" strokeWidth="1" />
      ))}
      <path d={`${line} L ${W - 6} ${height - 6} L 6 ${height - 6} Z`} fill={`url(#g${id})`} />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round"
        pathLength={1} strokeDasharray="1" strokeDashoffset="1"
        style={{ animation: "drawStroke 1.4s cubic-bezier(0.5,0,0.2,1) 0.15s forwards" }} />
      <circle cx={lx} cy={ly} r="4.5" fill="var(--accent)" stroke={dark ? "#1d1913" : "#fffcf5"} strokeWidth="2" />
    </svg>
  );
}

export function BarsChart({ data, height = 150, dark = false }: { data: number[]; height?: number; dark?: boolean }) {
  const max = Math.max(...data) * 1.1;
  return (
    <div className="flex items-end gap-[3%] w-full" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
          <div
            className="w-full rounded-t-[4px] anim-grow transition-colors"
            style={{
              height: `${(v / max) * 100}%`,
              background: i === data.length - 1 ? "var(--accent)" : dark ? "rgba(255,255,255,0.18)" : "#e2d7bf",
              animationDelay: `${i * 45}ms`,
            }}
          />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-espresso text-cream rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ segments, size = 148, thickness = 15, centerTop, centerSub }: {
  segments: { value: number; color: string }[]; size?: number; thickness?: number;
  centerTop: string; centerSub: string;
}) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#efe8d8" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * circ;
          const off = -acc * circ;
          acc += frac;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={off} strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 1s ease" }} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl text-ink leading-none">{centerTop}</span>
        <span className="text-[10px] tracking-[0.18em] uppercase text-faint mt-1.5">{centerSub}</span>
      </div>
    </div>
  );
}

export function HBars({ items, format }: { items: { label: string; value: number; share: number; sub?: string }[]; format: (n: number) => string }) {
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={it.label}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[13px] font-semibold text-ink">{it.label}</span>
            <span className="text-[13px] font-bold text-accent">{format(it.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-linesoft overflow-hidden">
            <div className="h-full rounded-full anim-grow-x" style={{
              width: `${it.share}%`,
              background: "linear-gradient(90deg, var(--accent-soft), var(--accent))",
              animationDelay: `${i * 90}ms`,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
