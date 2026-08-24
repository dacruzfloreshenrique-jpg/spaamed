import { useState } from "react";
import { useDemo } from "../state/store";
import { timeAgo } from "../data/demo";
import type { Tab } from "../data/demo";
import { Modal, Stars } from "../components/ui";
import {
  IcHome, IcCalendarPlus, IcCalendar, IcGift, IcUser, IcBell, IcCheck, IcSpark, IcArrowR,
} from "../components/icons";
import Home from "./Home";
import Booking from "./Booking";
import Appointments from "./Appointments";
import Rewards, { PromotionsScreen } from "./Rewards";
import Profile, { HistoryScreen, MembershipScreen, ReferralScreen, PersonalInfoScreen, PreferencesScreen } from "./Profile";

export type Overlay = null | "notifications" | "promotions" | "membership" | "referral" | "history" | "info" | "prefs";

const NAV: { id: Tab; label: string; icon: (c: string) => React.ReactNode }[] = [
  { id: "home", label: "Home", icon: (c) => <IcHome className={c} /> },
  { id: "book", label: "Book", icon: (c) => <IcCalendarPlus className={c} /> },
  { id: "appointments", label: "Visits", icon: (c) => <IcCalendar className={c} /> },
  { id: "rewards", label: "Rewards", icon: (c) => <IcGift className={c} /> },
  { id: "profile", label: "Profile", icon: (c) => <IcUser className={c} /> },
];

const OVERLAY_TITLES: Record<string, string> = {
  notifications: "Notifications", promotions: "Promotions", membership: "Membership",
  referral: "Refer a Friend", history: "Treatment History", info: "Personal Information", prefs: "Preferences",
};

export default function ClientApp() {
  const { s, unread, setTab, setMode, markAllRead } = useDemo();
  const [overlay, setOverlay] = useState<Overlay>(null);
  const tab = s.clientTab;

  return (
    <div className="lg:flex lg:items-start lg:justify-center lg:gap-14">
      {/* ---------------- phone ---------------- */}
      <div className="mx-auto w-full max-w-[430px] lg:w-auto">
        <div className="relative lg:w-[392px] lg:rounded-[3rem] lg:bg-espresso lg:p-[10px] phone-shadow">
          <div className="relative flex flex-col bg-ivory h-[calc(100dvh-104px)] min-h-[560px] lg:h-[min(790px,calc(100vh-150px))] lg:rounded-[2.45rem] overflow-hidden">
            {/* status bar */}
            <div className="hidden lg:flex items-center justify-between px-7 pt-3.5 pb-1 text-[12px] font-bold text-ink relative z-20">
              <span>9:41</span>
              <span className="absolute left-1/2 -translate-x-1/2 top-2 w-[92px] h-[25px] rounded-full bg-espresso" />
              <span className="flex items-center gap-1.5">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="7" width="2.6" height="4" rx="0.8" /><rect x="4.4" y="5" width="2.6" height="6" rx="0.8" /><rect x="8.8" y="2.6" width="2.6" height="8.4" rx="0.8" /><rect x="13.2" y="0" width="2.6" height="11" rx="0.8" opacity="0.35" /></svg>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 9.6a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zM8 6.2c-1.5 0-2.9.6-3.9 1.6l1.2 1.2A4 4 0 018 8c1 0 2 .4 2.7 1l1.2-1.2A5.7 5.7 0 008 6.2zM8 2.6C5.6 2.6 3.4 3.6 1.8 5.2L3 6.4A7.2 7.2 0 018 4.4c1.9 0 3.7.8 5 2l1.2-1.2A9 9 0 008 2.6z" transform="translate(0 -1.5)" /></svg>
                <svg width="23" height="11" viewBox="0 0 23 11" fill="none"><rect x="0.5" y="0.5" width="19" height="10" rx="3" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="14" height="7" rx="1.8" fill="currentColor" /><path d="M21.5 3.5v4a2 2 0 000-4z" fill="currentColor" opacity="0.4" /></svg>
              </span>
            </div>

            {/* screen */}
            <div className="relative flex-1 overflow-y-auto no-scrollbar overscroll-contain">
              <div key={`${tab}`} className="anim-fade-up min-h-full px-5 pt-4 pb-6 lg:pt-2">
                {tab === "home" && <Home onBell={() => setOverlay("notifications")} onOpen={setOverlay} />}
                {tab === "book" && <Booking />}
                {tab === "appointments" && <Appointments />}
                {tab === "rewards" && <Rewards />}
                {tab === "profile" && <Profile onOpen={setOverlay} />}
              </div>
            </div>

            {/* overlay screens */}
            {overlay && (
              <div className="absolute inset-0 z-30 bg-ivory flex flex-col anim-fade-up">
                <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-line bg-cream/80 backdrop-blur">
                  <button onClick={() => setOverlay(null)} className="w-9 h-9 rounded-full border border-line bg-paper flex items-center justify-center text-muted hover:text-ink" aria-label="Back">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                  </button>
                  <h2 className="font-display text-lg text-ink">{OVERLAY_TITLES[overlay]}</h2>
                  {overlay === "notifications" && (
                    <button onClick={markAllRead} className="ml-auto text-[11px] font-bold text-accent">Mark all read</button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
                  {overlay === "notifications" && <NotifList />}
                  {overlay === "promotions" && <PromotionsScreen />}
                  {overlay === "membership" && <MembershipScreen />}
                  {overlay === "referral" && <ReferralScreen />}
                  {overlay === "history" && <HistoryScreen />}
                  {overlay === "info" && <PersonalInfoScreen />}
                  {overlay === "prefs" && <PreferencesScreen />}
                </div>
              </div>
            )}

            {/* bottom nav */}
            <nav className="shrink-0 border-t border-line bg-cream/95 backdrop-blur px-2 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] flex relative z-20">
              {NAV.map((n) => {
                const active = tab === n.id;
                return (
                  <button key={n.id} onClick={() => { setTab(n.id); setOverlay(null); }}
                    className={`relative flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all duration-300 ${active ? "text-accent" : "text-faint hover:text-muted"}`}
                    aria-label={n.label} aria-current={active ? "page" : undefined}>
                    <span className={`transition-transform duration-300 ${active ? "-translate-y-0.5" : ""}`}>{n.icon("w-[22px] h-[22px]")}</span>
                    <span className={`text-[10px] font-bold tracking-wide ${active ? "text-accent" : ""}`}>{n.label}</span>
                    <span className={`absolute top-0 h-[3px] rounded-full bg-accent transition-all duration-300 ${active ? "w-6 opacity-100" : "w-0 opacity-0"}`} />
                    {n.id === "appointments" && <UpcomingDot />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <p className="hidden lg:block text-center text-[11px] text-faint mt-4 tracking-wide">
          Live client experience · <span className="text-accent font-semibold">synced with the dashboard in real time</span>
        </p>
      </div>

      {/* ---------------- presenter rail ---------------- */}
      <aside className="hidden lg:block w-[300px] shrink-0 sticky top-24 mt-2">
        <p className="kicker text-accent">The client experience</p>
        <h3 className="font-display text-[26px] leading-snug text-ink mt-2">
          Your spa, in <em className="text-accent not-italic font-display italic">her pocket.</em>
        </h3>
        <p className="text-[13px] text-muted leading-relaxed mt-3">
          Every booking, reminder and reward flows straight into your dashboard — and everything you
          change there appears here instantly.
        </p>
        <button onClick={() => setMode("dashboard")}
          className="mt-5 group flex items-center gap-2 text-[13px] font-bold text-ink border border-line bg-paper rounded-full pl-4 pr-3 py-2.5 hover:border-accent-soft transition-all hover:-translate-y-0.5 shadow-sm">
          Switch to Business Dashboard
          <IcArrowR className="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="mt-7 bg-espresso rounded-2xl p-5 text-cream">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-goldsoft" style={{ animation: "pulseSoft 2s infinite" }} />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-goldsoft" />
            </span>
            <p className="text-[10px] tracking-[0.22em] uppercase font-bold text-goldsoft">Live activity</p>
          </div>
          <ul className="space-y-2.5 max-h-44 overflow-y-auto no-scrollbar">
            {s.activity.slice(0, 6).map((a, i) => (
              <li key={a.ts + i} className="flex gap-2 text-[12px] leading-snug">
                <IcSpark className="w-3 h-3 text-goldsoft shrink-0 mt-0.5" />
                <span className="text-cream/85">{a.text}<span className="text-cream/40"> · {timeAgo(a.ts)}</span></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border border-line bg-paper rounded-2xl p-5">
          <p className="kicker mb-3">Demo loop checklist</p>
          <ul className="space-y-2">
            {[
              { done: s.flagged.booked, label: "Book a treatment in the app" },
              { done: s.flagged.completed, label: "Mark it completed on the dashboard" },
              { done: s.flagged.promo, label: "Create a promotion for clients" },
              { done: s.flagged.notif, label: "Send a push notification" },
              { done: s.flagged.redeemed, label: "Redeem a Glow Reward" },
            ].map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-[12.5px]">
                <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${c.done ? "bg-accent border-accent text-cream" : "border-line text-transparent"}`} style={{ width: 18, height: 18 }}>
                  <IcCheck className="w-2.5 h-2.5" />
                </span>
                <span className={c.done ? "text-faint line-through" : "text-ink font-medium"}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <ReviewPrompt />
    </div>
  );

  function UpcomingDot() {
    const { myAppts } = useDemo();
    const n = myAppts.filter((a) => a.status === "confirmed" || a.status === "pending").length;
    if (!n) return null;
    return <span className="absolute top-1 right-1/2 translate-x-4 min-w-[15px] h-[15px] px-0.5 rounded-full bg-accent text-cream text-[9px] font-bold flex items-center justify-center">{n}</span>;
  }
}

function NotifList() {
  const { s, claimSlot, setTab } = useDemo();
  return (
    <div className="space-y-3">
      {s.notifications.length === 0 && (
        <p className="text-sm text-muted text-center py-10">You're all caught up ✨</p>
      )}
      {s.notifications.map((n) => (
        <button
          key={n.id}
          onClick={() => {
            if (n.action?.type === "claim") claimSlot(n.action.slotId);
            else if (n.action?.type === "tab") setTab(n.action.tab);
          }}
          className={`w-full text-left rounded-xl border p-3.5 transition-all ${n.read ? "bg-paper border-line" : "bg-accent-tint border-accent-soft"} hover:-translate-y-0.5`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${n.kind === "reward" ? "bg-goldtint text-accent" : n.kind === "slot" ? "bg-sagetint text-sage" : "bg-linesoft text-muted"}`}>
              <IcGiftSmall kind={n.kind} />
            </span>
            <p className="text-[13px] font-bold text-ink flex-1">{n.title}</p>
            <span className="text-[10px] text-faint shrink-0">{timeAgo(n.ts)}</span>
          </div>
          <p className="text-[12px] text-muted leading-snug mt-1.5 pl-9">{n.body}</p>
          {n.action?.type === "claim" && (
            <span className="ml-9 mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-sage">Tap to claim this slot <IcArrowR className="w-3 h-3" /></span>
          )}
          {!n.read && <span className="float-right w-2 h-2 rounded-full bg-accent mt-1" style={{ animation: "blinkDot 2s infinite" }} />}
        </button>
      ))}
    </div>
  );

  function IcGiftSmall({ kind }: { kind: string }) {
    if (kind === "reward") return <IcGift className="w-3.5 h-3.5" />;
    if (kind === "slot") return <IcCalendar className="w-3.5 h-3.5" />;
    return <IcBell className="w-3.5 h-3.5" />;
  }
}

function ReviewPrompt() {
  const { s, finishReview, declineReview } = useDemo();
  const [stars, setStars] = useState(0);
  const [google, setGoogle] = useState(false);
  const open = s.pendingReview !== null;
  return (
    <Modal open={open} onClose={declineReview}>
      <div className="p-7 text-center">
        <p className="kicker text-accent">Your visit</p>
        <h3 className="font-display text-2xl text-ink mt-2">How was your experience?</h3>
        <p className="text-sm text-muted mt-1.5">
          {s.pendingReview ? "We'd love to hear about your visit." : ""}
        </p>
        <div className="my-6 flex justify-center">
          <Stars size="w-9 h-9" interactive value={stars} onRate={(n) => { setStars(n); if (n === 5) setGoogle(true); }} />
        </div>
        {stars > 0 && stars < 5 && (
          <div className="anim-fade-up">
            <p className="text-sm text-ink font-semibold">Thank you — we'll keep working on it. 💛</p>
            <button onClick={() => finishReview(false)} className="mt-4 btn-gold rounded-full px-6 py-2.5 text-sm font-bold">Submit rating · earn 50 pts</button>
          </div>
        )}
        {google && (
          <div className="anim-fade-up">
            <p className="font-display text-lg text-ink">Wonderful! 🌟</p>
            <p className="text-sm text-muted mt-1">Would you mind sharing your experience?</p>
            <button onClick={() => finishReview(true)} className="mt-4 w-full btn-gold rounded-xl py-3 text-sm font-bold tracking-wide">LEAVE A GOOGLE REVIEW</button>
            <button onClick={declineReview} className="mt-2 w-full text-[12px] font-semibold text-muted py-2 hover:text-ink">Maybe later</button>
          </div>
        )}
        {stars === 0 && <p className="text-[11px] text-faint">Ratings earn +50 Glow Points</p>}
      </div>
    </Modal>
  );
}
