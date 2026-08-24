import { useState } from "react";
import { useDemo } from "../state/store";
import { eligibleForRebook, BASE_METRICS } from "../data/demo";
import type { DashSection } from "../data/demo";
import { BrandMark } from "../components/ui";
import {
  IcChart, IcCalendar, IcUsers, IcRefresh, IcMegaphone, IcGift, IcSparkles, IcHeart, IcBars, IcGear, IcMenu, IcX, IcArrowR,
} from "../components/icons";
import Overview from "./Overview";
import AppointmentsDash from "./AppointmentsDash";
import ClientsDash from "./ClientsDash";
import Rebooking from "./Rebooking";
import Promotions from "./Promotions";
import { RewardsDash, MembershipsDash, ReferralsDash } from "./Growth";
import Analytics from "./Analytics";
import Settings from "./Settings";

const NAV: { id: DashSection; label: string; icon: (c: string) => React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: (c) => <IcChart className={c} /> },
  { id: "appointments", label: "Appointments", icon: (c) => <IcCalendar className={c} /> },
  { id: "clients", label: "Clients", icon: (c) => <IcUsers className={c} /> },
  { id: "rebooking", label: "Rebooking", icon: (c) => <IcRefresh className={c} /> },
  { id: "promotions", label: "Promotions", icon: (c) => <IcMegaphone className={c} /> },
  { id: "rewards", label: "Rewards", icon: (c) => <IcGift className={c} /> },
  { id: "memberships", label: "Memberships", icon: (c) => <IcSparkles className={c} /> },
  { id: "referrals", label: "Referrals", icon: (c) => <IcHeart className={c} /> },
  { id: "analytics", label: "Analytics", icon: (c) => <IcBars className={c} /> },
  { id: "settings", label: "Settings", icon: (c) => <IcGear className={c} /> },
];

const TITLES: Record<DashSection, [string, string]> = {
  overview: ["Overview", "The pulse of your spa, in real time"],
  appointments: ["Appointments", "Every chair, every hour, under control"],
  clients: ["Clients", "Your entire client book in one place"],
  rebooking: ["Rebooking", "Bring the right clients back at the right time"],
  promotions: ["Promotions", "Campaigns that fill chairs and feel personal"],
  rewards: ["Rewards", "Loyalty that pays for itself"],
  memberships: ["Memberships", "Predictable revenue, devoted clients"],
  referrals: ["Referrals & Reputation", "Let happy clients do the selling"],
  analytics: ["Analytics", "Business outcomes, not vanity metrics"],
  settings: ["Settings", "Make the platform unmistakably yours"],
};

export default function Dashboard() {
  const { s, setDash, setMode } = useDemo();
  const [drawer, setDrawer] = useState(false);
  const section = s.dashSection;
  const rebookCount = s.clients.filter(eligibleForRebook).length;
  const [title, subtitle] = TITLES[section];

  const nav = (
    <>
      {NAV.map((n) => {
        const active = section === n.id;
        const badge = n.id === "rebooking" ? rebookCount : n.id === "promotions" ? s.campaignsSent || undefined : undefined;
        return (
          <button key={n.id} onClick={() => { setDash(n.id); setDrawer(false); }}
            className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 group ${
              active ? "bg-goldsoft/15 text-goldsoft" : "text-cream/55 hover:text-cream hover:bg-white/5"
            }`}
            aria-current={active ? "page" : undefined}>
            <span className={`transition-transform ${active ? "" : "group-hover:translate-x-0.5"}`}>{n.icon("w-[18px] h-[18px]")}</span>
            <span className="flex-1 text-left">{n.label}</span>
            {badge !== undefined && badge > 0 && (
              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${active ? "bg-goldsoft text-espresso" : "bg-white/10 text-cream/70"}`}>{badge}</span>
            )}
            {active && <span className="absolute left-0 w-[3px] h-6 rounded-r-full bg-goldsoft" />}
          </button>
        );
      })}
    </>
  );

  const sidebarInner = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5 border-b border-white/8">
        <BrandMark brand={s.brand} size={38} light />
      </div>
      <p className="px-5 pt-5 pb-2 text-[9.5px] tracking-[0.24em] uppercase font-bold text-cream/30">Growth Platform</p>
      <nav className="relative px-3 space-y-0.5 flex-1 overflow-y-auto no-scrollbar">{nav}</nav>
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 p-3">
          <span className="w-9 h-9 rounded-full bg-goldsoft text-espresso font-display italic flex items-center justify-center text-sm shrink-0">JL</span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold text-cream truncate">Jessica Lane</p>
            <p className="text-[10px] text-cream/45">Owner & Director</p>
          </div>
        </div>
        <button onClick={() => setMode("client")} className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 text-cream/70 hover:text-goldsoft hover:border-goldsoft/40 py-2 text-[11.5px] font-bold transition-colors">
          Preview client app <IcArrowR className="w-3.5 h-3.5" />
        </button>
        <p className="text-center text-[9.5px] text-cream/25 mt-3 tracking-wide">Demo build · all data fictional</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100dvh-64px)] lg:flex">
      {/* desktop sidebar */}
      <aside className="hidden lg:block w-[236px] shrink-0 sticky top-16 self-start h-[calc(100dvh-64px)] bg-espresso rounded-b-2xl">
        {sidebarInner}
      </aside>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button className="absolute inset-0 bg-espresso/60" onClick={() => setDrawer(false)} aria-label="Close menu" />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-espresso anim-fade-up">{sidebarInner}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-16 z-30 bg-ivory/90 backdrop-blur border-b border-line px-5 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => setDrawer(true)} className="lg:hidden w-9 h-9 rounded-lg border border-line bg-paper flex items-center justify-center" aria-label="Open menu">
            <IcMenu className="w-4.5 h-4.5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-[21px] text-ink leading-tight truncate">{title}</h1>
            <p className="text-[11.5px] text-muted truncate hidden sm:block">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden md:flex items-center gap-1.5 text-[10.5px] font-bold text-sage bg-sagetint border border-sage/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" style={{ animation: "blinkDot 2s infinite" }} />
              Live · synced with client app
            </span>
            <span className="text-[10.5px] font-bold text-muted bg-linesoft rounded-full px-3 py-1.5 hidden sm:block">Demo data</span>
          </div>
        </header>

        <main key={section} className="anim-fade-up px-5 lg:px-8 py-6 max-w-[1240px]">
          {section === "overview" && <Overview />}
          {section === "appointments" && <AppointmentsDash />}
          {section === "clients" && <ClientsDash />}
          {section === "rebooking" && <Rebooking />}
          {section === "promotions" && <Promotions />}
          {section === "rewards" && <RewardsDash />}
          {section === "memberships" && <MembershipsDash />}
          {section === "referrals" && <ReferralsDash />}
          {section === "analytics" && <Analytics />}
          {section === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}

export { BASE_METRICS };
