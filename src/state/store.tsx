import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedState, todayISO, addDaysISO, uid, treatmentById, providerById,
  weekdayShort, fmtShort,
} from "../data/demo";
import type {
  DemoState, Appointment, Promotion, DashSection, Tab, Mode, Client, Brand,
} from "../data/demo";

const KEY = "glow-demo-state-v3";

export interface ToastMsg { id: string; text: string; kind: "ok" | "info" | "warn" }

interface DemoCtx {
  s: DemoState;
  emma: Client;
  myAppts: Appointment[];
  unread: number;
  toasts: ToastMsg[];
  toast: (text: string, kind?: ToastMsg["kind"]) => void;
  dismissToast: (id: string) => void;
  setMode: (m: Mode) => void;
  setTab: (t: Tab) => void;
  setDash: (d: DashSection) => void;
  setPrefill: (p: DemoState["prefill"]) => void;
  book: (a: { treatmentId: string; providerId: string; date: string; time: string; promoId?: string | null }) => Appointment;
  bookForClient: (clientId: string) => void;
  confirmAppt: (id: string) => void;
  cancelAppt: (id: string, source: "client" | "business") => void;
  rescheduleAppt: (id: string, date: string, time: string) => void;
  completeAppt: (id: string) => void;
  sendReminder: (clientId: string) => void;
  redeem: (tierId: string) => void;
  addPromotion: (p: Omit<Promotion, "id" | "isNew">) => void;
  sendPush: (title: string, body: string, audience: string) => void;
  notifyWaitlist: (slotId: string) => void;
  claimSlot: (slotId: string) => void;
  finishReview: (viaGoogle: boolean) => void;
  declineReview: () => void;
  joinMembership: () => void;
  buyPackage: (id: string, name: string) => void;
  updateBrand: (patch: Partial<Brand>, silent?: boolean) => void;
  toggleProvider: (id: string) => void;
  toggleService: (id: string) => void;
  setNotifPref: (k: keyof DemoState["notifPrefs"], v: boolean) => void;
  markAllRead: () => void;
  reset: () => void;
}

const Ctx = createContext<DemoCtx | null>(null);

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed && parsed.v === 3) return parsed;
    }
  } catch { /* fall through to seed */ }
  return seedState();
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [s, set] = useState<DemoState>(load);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s]);

  const toast = (text: string, kind: ToastMsg["kind"] = "ok") => {
    const id = uid();
    setToasts((t) => [...t.slice(-2), { id, text, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };
  const dismissToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  const log = (text: string) =>
    (d: DemoState): DemoState => ({ ...d, activity: [{ ts: Date.now(), text }, ...d.activity].slice(0, 14) });

  const pushNotif = (d: DemoState, n: Omit<DemoState["notifications"][number], "id" | "ts" | "read">): DemoState => ({
    ...d,
    notifications: [{ id: uid(), ts: Date.now(), read: false, ...n }, ...d.notifications],
  });

  const emma = s.clients.find((c) => c.id === "c1")!;
  const myAppts = useMemo(() => s.appointments.filter((a) => a.clientId === "c1"), [s.appointments]);
  const unread = s.notifications.filter((n) => !n.read).length;

  const patchClient = (d: DemoState, id: string, fn: (c: Client) => Client): DemoState => ({
    ...d, clients: d.clients.map((c) => (c.id === id ? fn(c) : c)),
  });

  const api: DemoCtx = {
    s, emma, myAppts, unread, toasts, toast, dismissToast,

    setMode: (m) => set((d) => ({ ...d, mode: m })),
    setTab: (t) => set((d) => ({ ...d, clientTab: t })),
    setDash: (sec) => set((d) => ({ ...d, dashSection: sec })),
    setPrefill: (p) => set((d) => ({ ...d, prefill: p })),

    book: ({ treatmentId, providerId, date, time, promoId }) => {
      const t = treatmentById(treatmentId)!;
      const promo = promoId ? s.promotions.find((p) => p.id === promoId) : null;
      let price = t.price;
      if (promo && promo.kind === "percent" && promo.treatmentId === treatmentId) price = Math.round(t.price * 0.8);
      const appt: Appointment = {
        id: uid(), clientId: "c1", clientName: "Emma Carter", treatmentId, providerId,
        date, time, status: "confirmed", price,
      };
      set((d) =>
        log(`Emma Carter booked ${t.name} · ${fmtShort(date)}`)({
          ...d,
          appointments: [...d.appointments, appt],
          flagged: { ...d.flagged, booked: true },
          prefill: null,
          clients: d.clients.map((c) => c.id === "c1" ? { ...c, rebookReadyAt: null } : c),
        })
      );
      return appt;
    },

    bookForClient: (clientId) => {
      const c = s.clients.find((x) => x.id === clientId);
      if (!c) return;
      const t = treatmentById(c.lastTreatmentId);
      const date = addDaysISO(2);
      const appt: Appointment = {
        id: uid(), clientId: c.id, clientName: c.name, treatmentId: c.lastTreatmentId,
        providerId: "p1", date, time: "11:15 AM", status: "pending", price: t?.price ?? 199,
      };
      set((d) => {
        let next: DemoState = { ...d, appointments: [...d.appointments, appt] };
        if (clientId === "c1") {
          next = pushNotif(next, {
            title: "Booking request from the spa",
            body: `${t?.name ?? "Your treatment"} on ${fmtShort(date)} at 11:15 AM — tap Visits to confirm.`,
            kind: "system", action: { type: "tab", tab: "appointments" },
          });
        }
        return log(`Booking request sent to ${c.name} · ${fmtShort(date)}`)({ ...next });
      });
    },

    confirmAppt: (id) => {
      set((d) => {
        const a = d.appointments.find((x) => x.id === id);
        let next: DemoState = {
          ...d,
          appointments: d.appointments.map((x) => (x.id === id ? { ...x, status: "confirmed" as const } : x)),
        };
        if (a && a.clientId === "c1") {
          next = pushNotif(next, { title: "Appointment confirmed", body: `${treatmentById(a.treatmentId)?.name} on ${fmtShort(a.date)} at ${a.time} is confirmed.`, kind: "system" });
        }
        return next;
      });
      toast("Appointment confirmed");
    },

    cancelAppt: (id, source) => {
      set((d) => {
        const a = d.appointments.find((x) => x.id === id);
        let next: DemoState = {
          ...d,
          appointments: d.appointments.map((x) => (x.id === id ? { ...x, status: "cancelled" as const } : x)),
        };
        if (a && source === "business") {
          next = {
            ...next,
            openSlots: [{ id: uid(), date: a.date, time: a.time, treatmentId: a.treatmentId, note: "Recently cancelled" }, ...next.openSlots],
          };
          next = log(`Appointment cancelled — ${fmtShort(a.date)} ${a.time} slot opened`)({ ...next });
        }
        if (a && a.clientId === "c1") {
          next = log(`Emma Carter cancelled ${treatmentById(a.treatmentId)?.name}`)({ ...next });
        }
        return next;
      });
      toast(source === "business" ? "Appointment cancelled — slot opened for the waitlist" : "Appointment cancelled", source === "business" ? "warn" : "info");
    },

    rescheduleAppt: (id, date, time) => {
      set((d) => {
        const a = d.appointments.find((x) => x.id === id);
        let next: DemoState = {
          ...d,
          appointments: d.appointments.map((x) => (x.id === id ? { ...x, date, time } : x)),
        };
        if (a && a.clientId === "c1") {
          next = pushNotif(next, { title: "Appointment moved", body: `${treatmentById(a.treatmentId)?.name} is now ${fmtShort(date)} at ${a.time}.`, kind: "system" });
        }
        return next;
      });
      toast("Appointment rescheduled");
    },

    completeAppt: (id) => {
      const a = s.appointments.find((x) => x.id === id);
      if (!a) return;
      const t = treatmentById(a.treatmentId);
      const isToday = a.date === todayISO();
      set((d) => {
        let next: DemoState = {
          ...d,
          appointments: d.appointments.map((x) => (x.id === id ? { ...x, status: "completed" as const } : x)),
          addedRevenue: isToday ? d.addedRevenue + a.price : d.addedRevenue,
          flagged: { ...d.flagged, completed: true },
        };
        next = patchClient(next, a.clientId, (c) => ({
          ...c, visits: c.visits + 1, ltv: c.ltv + a.price,
          lastVisit: todayISO(), lastTreatmentId: a.treatmentId,
          points: c.points + 100, rebookReadyAt: todayISO(), reminded: false,
        }));
        if (a.clientId === "c1") {
          next = { ...next, pendingReview: { appointmentId: a.id, treatmentId: a.treatmentId, providerId: a.providerId } };
          next = pushNotif(next, { title: "You earned 100 Glow Points ✨", body: `Thanks for visiting! Your ${t?.name} is complete — points are in your wallet.`, kind: "reward", action: { type: "tab", tab: "rewards" } });
          next = log(`Emma's ${t?.name} completed · +100 pts · rebook window opened`)({ ...next });
        } else {
          next = log(`${a.clientName}'s ${t?.name} completed · +100 pts`)({ ...next });
        }
        return next;
      });
      toast(`Completed · 100 Glow Points awarded to ${a.clientName}`);
    },

    sendReminder: (clientId) => {
      const c = s.clients.find((x) => x.id === clientId);
      if (!c) return;
      const t = treatmentById(c.lastTreatmentId);
      set((d) => {
        let next: DemoState = patchClient(d, clientId, (x) => ({ ...x, reminded: true }));
        if (clientId === "c1") {
          next = pushNotif(next, {
            title: "Time for your next glow ✨",
            body: `It's been a while since your ${t?.name}. Your recommended window is open — tap to rebook.`,
            kind: "system", action: { type: "tab", tab: "book" },
          });
        }
        return log(`Rebook reminder sent to ${c.name}`)({ ...next });
      });
      toast(`Reminder sent to ${c.name}`);
    },

    redeem: (tierId) => {
      set((d) => {
        const t = [
          { id: "r1", name: "$15 Off Retail", cost: 250 },
          { id: "r2", name: "Free LED Add-On", cost: 500 },
          { id: "r3", name: "$50 Off Any Treatment", cost: 750 },
          { id: "r4", name: "Free Radiance Facial", cost: 1200 },
          { id: "r5", name: "$150 Glow Credit", cost: 2000 },
        ].find((x) => x.id === tierId)!;
        const em = d.clients.find((c) => c.id === "c1")!;
        if (em.points < t.cost) return d;
        let next: DemoState = patchClient(d, "c1", (c) => ({ ...c, points: c.points - t.cost }));
        next = {
          ...next,
          redemptions: [{ id: uid(), client: "Emma Carter", reward: t.name, points: t.cost, date: todayISO() }, ...next.redemptions],
          flagged: { ...next.flagged, redeemed: true },
        };
        next = pushNotif(next, { title: "Reward unlocked 🎉", body: `${t.name} is ready to use at your next visit.`, kind: "reward" });
        return log(`Emma Carter redeemed "${t.name}"`)({ ...next });
      });
      toast("Reward redeemed — it will be ready at your next visit");
    },

    addPromotion: (p) => {
      set((d) => {
        let next: DemoState = {
          ...d,
          promotions: [{ ...p, id: uid(), isNew: true }, ...d.promotions],
          campaignsSent: d.campaignsSent + 1,
          flagged: { ...d.flagged, promo: true },
        };
        if (p.audience.toLowerCase().includes("all") || emma.ltv > 0) {
          next = pushNotif(next, { title: p.title, body: `${p.offer} — ${p.detail}`, kind: "promo", action: { type: "tab", tab: "book" } });
        }
        return log(`Campaign "${p.title}" scheduled · ${p.audience}`)({ ...next });
      });
      toast("Campaign scheduled successfully.");
    },

    sendPush: (title, body, audience) => {
      set((d) => {
        let next: DemoState = {
          ...d,
          campaignsSent: d.campaignsSent + 1,
          flagged: { ...d.flagged, notif: true },
        };
        next = pushNotif(next, { title, body, kind: "system", action: { type: "tab", tab: "book" } });
        return log(`Push "${title}" sent to ${audience}`)({ ...next });
      });
      toast(`Notification delivered to ${audience.toLowerCase()}`);
    },

    notifyWaitlist: (slotId) => {
      set((d) => {
        const slot = d.openSlots.find((x) => x.id === slotId);
        if (!slot) return d;
        const t = treatmentById(slot.treatmentId);
        let next: DemoState = {
          ...d,
          waitlist: d.waitlist.map((w) => (w.treatmentId === slot.treatmentId ? { ...w, notified: true } : w)),
        };
        next = pushNotif(next, {
          title: "Appointment available ✨",
          body: `${t?.name} just opened on ${weekdayShort(slot.date)} ${fmtShort(slot.date)} at ${slot.time}. First come, first glow.`,
          kind: "slot", action: { type: "claim", slotId },
        });
        return log(`Waitlist notified — ${weekdayShort(slot.date)} ${slot.time} ${t?.name}`)({ ...next });
      });
      toast("Waitlist notified — check the client app");
    },

    claimSlot: (slotId) => {
      set((d) => {
        const slot = d.openSlots.find((x) => x.id === slotId);
        if (!slot) return d;
        const t = treatmentById(slot.treatmentId);
        const appt: Appointment = {
          id: uid(), clientId: "c1", clientName: "Emma Carter", treatmentId: slot.treatmentId,
          providerId: "p1", date: slot.date, time: slot.time, status: "confirmed", price: t?.price ?? 0,
        };
        let next: DemoState = {
          ...d,
          openSlots: d.openSlots.filter((x) => x.id !== slotId),
          appointments: [...d.appointments, appt],
          flagged: { ...d.flagged, booked: true },
          notifications: d.notifications.map((n) => (n.kind === "slot" ? { ...n, read: true } : n)),
        };
        return log(`Emma claimed the ${weekdayShort(slot.date)} ${slot.time} slot`)({ ...next });
      });
      toast("Slot claimed — added to your appointments ✨");
    },

    finishReview: (viaGoogle) => {
      set((d) => {
        let next: DemoState = patchClient(d, "c1", (c) => ({ ...c, points: c.points + 50 }));
        next = { ...next, pendingReview: null, reviewDone: true, flagged: { ...next.flagged, reviewed: true } };
        next = pushNotif(next, { title: "+50 Glow Points", body: "Thank you for sharing your experience. You're glowing.", kind: "reward" });
        return log(viaGoogle ? "Emma left a 5-star review · +50 pts" : "Emma rated her visit · +50 pts")({ ...next });
      });
      toast("+50 Glow Points — thank you!");
    },

    declineReview: () => set((d) => ({ ...d, pendingReview: null })),

    joinMembership: () => {
      set((d) => {
        let next: DemoState = { ...d, member: true, memberJoins: d.memberJoins + 1, packagesOwned: [...d.packagesOwned, "m1"] };
        next = pushNotif(next, { title: "Welcome to Glow Membership ✨", body: "Your monthly HydraFacial and member perks are now active.", kind: "reward" });
        return log("Emma Carter joined Glow Membership · +$149 MRR")({ ...next });
      });
      toast("Welcome to the Glow Membership ✨");
    },

    buyPackage: (id, name) => {
      set((d) => {
        let next: DemoState = { ...d, packagesOwned: [...d.packagesOwned, id] };
        next = patchClient(next, "c1", (c) => ({ ...c, points: c.points + 300 }));
        next = pushNotif(next, { title: "Package purchased 🎉", body: `${name} is on your account. +300 Glow Points added.`, kind: "reward" });
        return log(`Emma purchased ${name} · +300 pts`)({ ...next });
      });
      toast("Purchase complete (simulated) · +300 Glow Points");
    },

    updateBrand: (patch, silent) => {
      set((d) => ({ ...d, brand: { ...d.brand, ...patch } }));
      if (!silent) toast("Branding updated across the entire demo");
    },

    toggleProvider: (id) =>
      set((d) => ({
        ...d,
        providerOff: d.providerOff.includes(id) ? d.providerOff.filter((x) => x !== id) : [...d.providerOff, id],
      })),

    toggleService: (id) =>
      set((d) => ({
        ...d,
        serviceOff: d.serviceOff.includes(id) ? d.serviceOff.filter((x) => x !== id) : [...d.serviceOff, id],
      })),

    setNotifPref: (k, v) => set((d) => ({ ...d, notifPrefs: { ...d.notifPrefs, [k]: v } })),

    markAllRead: () => set((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) })),

    reset: () => {
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      set(seedState());
      toast("Demo data reset to its original state", "info");
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside DemoProvider");
  return v;
}

export { treatmentById, providerById, addDaysISO };
