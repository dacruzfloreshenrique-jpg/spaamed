/* ------------------------------------------------------------------ */
/*  Glow Med Spa — demo data model                                     */
/*  All people, bookings and figures are fictional demonstration data. */
/* ------------------------------------------------------------------ */

export type Tab = "home" | "book" | "appointments" | "rewards" | "profile";
export type DashSection =
  | "overview" | "appointments" | "clients" | "rebooking" | "promotions"
  | "rewards" | "memberships" | "referrals" | "analytics" | "settings";
export type ApptStatus = "confirmed" | "pending" | "completed" | "cancelled" | "checked-in";
export type ClientStatus = "VIP" | "Active" | "New" | "At Risk";
export type Mode = "client" | "dashboard";

export interface Treatment {
  id: string; name: string; category: string; desc: string; long: string;
  price: number; duration: number; image: string; frequencyWeeks: number;
  benefits: string[]; expect: string[]; popular?: boolean;
}
export interface Provider {
  id: string; name: string; role: string; rating: number; years: number; hue: string;
}
export interface Client {
  id: string; name: string; email: string; phone: string;
  visits: number; lastVisit: string | null; ltv: number; points: number;
  status: ClientStatus; member: boolean; lastTreatmentId: string;
  rebookReadyAt: string | null; reminded: boolean;
}
export interface Appointment {
  id: string; clientId: string; clientName: string; treatmentId: string;
  providerId: string; date: string; time: string; status: ApptStatus;
  price: number; newClient?: boolean;
}
export interface Promotion {
  id: string; kind: "percent" | "dollars" | "upgrade" | "event";
  title: string; offer: string; detail: string; expires: string;
  audience: string; treatmentId: string | null; isNew?: boolean;
}
export interface Notif {
  id: string; title: string; body: string; ts: number; read: boolean;
  kind: "promo" | "system" | "reward" | "slot";
  action?: { type: "tab"; tab: Tab } | { type: "claim"; slotId: string };
}
export interface Redemption { id: string; client: string; reward: string; points: number; date: string; }
export interface WaitlistEntry { id: string; client: string; treatmentId: string; pref: string; notified: boolean; isYou?: boolean; }
export interface OpenSlot { id: string; date: string; time: string; treatmentId: string; note: string; }
export interface Review { id: string; name: string; treatment: string; stars: number; text: string; when: string; }
export interface RewardTier { id: string; name: string; desc: string; cost: number; }
export interface Activity { ts: number; text: string; }

export interface Brand {
  name: string; tagline: string; location: string; address: string;
  phone: string; email: string; accent: string; mono: "serif" | "geo" | "script";
  hours: string;
}

export interface DemoState {
  v: number;
  mode: Mode;
  brand: Brand;
  clients: Client[];
  appointments: Appointment[];
  promotions: Promotion[];
  notifications: Notif[];
  redemptions: Redemption[];
  waitlist: WaitlistEntry[];
  openSlots: OpenSlot[];
  reviews: Review[];
  pendingReview: { appointmentId: string; treatmentId: string; providerId: string } | null;
  reviewDone: boolean;
  member: boolean;
  packagesOwned: string[];
  addedRevenue: number;
  campaignsSent: number;
  memberJoins: number;
  flagged: { booked: boolean; completed: boolean; promo: boolean; notif: boolean; redeemed: boolean; reviewed: boolean };
  prefill: { treatmentId?: string; providerId?: string; promoId?: string } | null;
  clientTab: Tab;
  dashSection: DashSection;
  providerOff: string[];
  serviceOff: string[];
  notifPrefs: { bookings: boolean; promos: boolean; reminders: boolean };
  activity: Activity[];
}

/* ---------------- date helpers ---------------- */

export const DAY = 86400000;

export function isoOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function todayISO(): string { return isoOf(new Date()); }
export function addDaysISO(n: number, from?: string): string {
  const base = from ? new Date(from + "T12:00:00") : new Date();
  base.setDate(base.getDate() + n);
  return isoOf(base);
}
export function daysSince(isoDate: string | null): number {
  if (!isoDate) return 999;
  const then = new Date(isoDate + "T12:00:00").getTime();
  return Math.max(0, Math.round((Date.now() - then) / DAY));
}
export function fmtShort(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
export function fmtLong(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
export function fmtMed(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
export function weekdayShort(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
}
export function nextWeekdayISO(weekday: number): string {
  const d = new Date();
  let diff = (weekday - d.getDay() + 7) % 7;
  if (diff === 0) diff = 7;
  d.setDate(d.getDate() + diff);
  return isoOf(d);
}
export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
export function slotUnavailable(date: string, time: string): boolean {
  const today = todayISO();
  if (date === today) {
    const hour = parseInt(time, 10) + (time.includes("PM") && !time.startsWith("12") ? 12 : 0);
    if (hour <= new Date().getHours()) return true;
  }
  let h = 0;
  const s = date + time;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return h % 10 < 3;
}
export const money = (n: number) => "$" + n.toLocaleString("en-US");
export const uid = () => Math.random().toString(36).slice(2, 9);

export const TIME_SLOTS = [
  "9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM",
  "1:30 PM", "2:15 PM", "3:00 PM", "3:45 PM", "4:30 PM", "5:15 PM", "6:00 PM",
];

/* ---------------- imagery (editorial demo photography) ---------------- */

const IMG = {
  hydro: "https://image.qwenlm.ai/generated-images/a43f7a9d-6edf-497d-80d5-4ce74472e3f0/_result.png",
  botox: "https://image.qwenlm.ai/generated-images/6e17528e-5464-4ca1-aad8-e1e2828f8d8a/_result.png",
  laser: "https://image.qwenlm.ai/generated-images/9218a39e-b9dd-444d-ad35-992cb6ef423c/_result.png",
  glow: "https://image.qwenlm.ai/generated-images/769c403c-2c3a-4bdc-8879-489c225c792a/_result.png",
  micro: "https://image.qwenlm.ai/generated-images/5fc4bc0b-f1de-44ef-992e-5be286b91bba/_result.png",
  body: "https://image.qwenlm.ai/generated-images/b215adbc-8cff-498d-9ff6-eba298f2a638/_result.png",
  before: "https://image.qwenlm.ai/generated-images/b5dbc144-58cd-4b5d-b793-34df21aca7d3/_result.png",
  after: "https://image.qwenlm.ai/generated-images/8814388a-2f27-4e99-a6a5-fbaabf08c1fd/_result.png",
};
export const BEFORE_AFTER = { before: IMG.before, after: IMG.after };

/* ---------------- catalog ---------------- */

export const CATEGORIES = ["All", "Injectables", "Facials", "Laser", "Body", "Skin Rejuvenation", "Wellness"];

export const TREATMENTS: Treatment[] = [
  {
    id: "t-hydro", name: "HydraFacial", category: "Facials", price: 199, duration: 60,
    image: IMG.hydro, frequencyWeeks: 6, popular: true,
    desc: "Deep cleansing + hydration + glow",
    long: "Our signature six-step treatment cleanses, exfoliates and infuses skin with intensive serums for an instant, camera-ready glow with zero downtime.",
    benefits: ["Instant, visible glow", "Deep pore cleansing", "Intense hydration", "Smooths fine lines", "Zero downtime"],
    expect: ["Skin analysis and consultation", "Gentle exfoliation and extraction", "Hydrating serum infusion", "LED light therapy finish"],
  },
  {
    id: "t-botox", name: "Botox", category: "Injectables", price: 350, duration: 30,
    image: IMG.botox, frequencyWeeks: 14, popular: true,
    desc: "Smooth expression lines, keep the expression",
    long: "Precision micro-dosing by our advanced injectors softens forehead lines, frown lines and crow's feet while keeping movement natural.",
    benefits: ["Softens dynamic wrinkles", "Preventive anti-aging", "Natural-looking results", "15-minute treatment"],
    expect: ["Facial mapping and marking", "Precision micro-injections", "Aftercare review", "Two-week perfecting check"],
  },
  {
    id: "t-filler", name: "Juvederm Filler", category: "Injectables", price: 650, duration: 45,
    image: IMG.botox, frequencyWeeks: 24,
    desc: "Restore volume and sculpt definition",
    long: "Hyaluronic-acid filler artfully restores cheeks, lips and jawline for balanced, rested contours tailored to your features.",
    benefits: ["Immediate volume", "Facial balancing", "Lasts 9–18 months", "Reversible and safe"],
    expect: ["Photo analysis and planning", "Numbing for comfort", "Layered injection technique", "Molding and finishing"],
  },
  {
    id: "t-lips", name: "Lip Enhancement", category: "Injectables", price: 550, duration: 40,
    image: IMG.botox, frequencyWeeks: 20,
    desc: "Soft volume, defined shape",
    long: "A conservative, technique-first approach to fuller lips — hydrated, defined and unmistakably yours.",
    benefits: ["Natural definition", "Hydration boost", "Symmetry correction"],
    expect: ["Lip mapping", "Topical numbing", "Micro-droplet placement", "Ice and aftercare"],
  },
  {
    id: "t-glow", name: "Glow Radiance Facial", category: "Facials", price: 159, duration: 50,
    image: IMG.glow, frequencyWeeks: 4,
    desc: "Vitamin-C brightening ritual",
    long: "A luminous pick-me-up facial with vitamin C, gentle enzymes and gua sha massage for instant radiance before any event.",
    benefits: ["Brightens dull skin", "Boosts circulation", "Event-ready glow"],
    expect: ["Double cleanse", "Enzyme exfoliation", "Gua sha contour massage", "Radiance mask and SPF"],
  },
  {
    id: "t-micro", name: "Microneedling", category: "Skin Rejuvenation", price: 349, duration: 60,
    image: IMG.micro, frequencyWeeks: 6, popular: true,
    desc: "Collagen induction for texture and tone",
    long: "Medical-grade microneedling stimulates collagen to refine pores, soften scars and even tone over a series of sessions.",
    benefits: ["Refines pores", "Softens acne scarring", "Firms and thickens skin", "Evens tone"],
    expect: ["Numbing for comfort", "Precision needling passes", "Growth-factor finish", "48-hour glow-down protocol"],
  },
  {
    id: "t-peel", name: "Chemical Peel", category: "Skin Rejuvenation", price: 189, duration: 40,
    image: IMG.micro, frequencyWeeks: 4,
    desc: "Clinical-strength renewal",
    long: "Customized acid blends lift dullness and congestion, revealing fresh, even skin in days.",
    benefits: ["Smoother texture", "Fades dark spots", "Clears congestion"],
    expect: ["Skin prep and degrease", "Layered peel application", "Neutralize and soothe", "Post-care kit included"],
  },
  {
    id: "t-laser", name: "Laser Hair Removal", category: "Laser", price: 249, duration: 45,
    image: IMG.laser, frequencyWeeks: 6, popular: true,
    desc: "Permanently smoother, session by session",
    long: "Fast, comfortable diode laser for all skin tones — most clients see 80–90% reduction within six sessions.",
    benefits: ["Up to 90% reduction", "Safe for all skin tones", "Virtually painless", "No more ingrowns"],
    expect: ["Patch test at first visit", "Cooling gel and laser passes", "Soothing aloe finish"],
  },
  {
    id: "t-ipl", name: "IPL Photofacial", category: "Laser", price: 299, duration: 50,
    image: IMG.laser, frequencyWeeks: 4,
    desc: "Erase sun damage and redness",
    long: "Broad-spectrum light targets sun spots, freckles and diffuse redness for a clear, even complexion.",
    benefits: ["Fades sun spots", "Reduces redness", "Brightens overall tone"],
    expect: ["Skin assessment", "Cooling gel and light pulses", "Post-treatment SPF"],
  },
  {
    id: "t-cool", name: "CoolSculpting", category: "Body", price: 750, duration: 60,
    image: IMG.body, frequencyWeeks: 8,
    desc: "Non-surgical fat reduction",
    long: "FDA-cleared cryolipolysis freezes and eliminates stubborn fat cells — no surgery, no downtime.",
    benefits: ["Permanent fat-cell reduction", "No needles or surgery", "Treats while you relax"],
    expect: ["Applicator fitting", "35-minute cooling cycle", "Massage and aftercare plan"],
  },
  {
    id: "t-lymph", name: "Lymphatic Massage", category: "Body", price: 129, duration: 50,
    image: IMG.body, frequencyWeeks: 2,
    desc: "De-puff and detoxify",
    long: "A gentle rhythmic massage that moves fluid, reduces bloating and leaves you light and sculpted.",
    benefits: ["Reduces bloating", "Boosts circulation", "Deep relaxation"],
    expect: ["Dry-brush prep", "Rhythmic drainage massage", "Warm-towel finish"],
  },
  {
    id: "t-prp", name: "PRP Skin Therapy", category: "Skin Rejuvenation", price: 449, duration: 60,
    image: IMG.micro, frequencyWeeks: 8,
    desc: "Your own plasma, your best skin",
    long: "Platelet-rich plasma supercharges microneedling for next-level firmness, glow and healing.",
    benefits: ["Amplifies collagen", "Accelerates healing", "All-natural booster"],
    expect: ["Gentle blood draw", "Plasma separation", "PRP-infused needling"],
  },
  {
    id: "t-iv", name: "Vitamin IV Drip", category: "Wellness", price: 199, duration: 45,
    image: IMG.glow, frequencyWeeks: 2,
    desc: "Hydration + glow from within",
    long: "A customized cocktail of vitamins, minerals and glutathione for energy, immunity and skin that glows from within.",
    benefits: ["Instant hydration", "Energy and immunity", "Glutathione brightening"],
    expect: ["Wellness consult", "45-minute relaxing drip", "Complimentary herbal tea"],
  },
  {
    id: "t-b12", name: "B12 Energy Shot", category: "Wellness", price: 59, duration: 15,
    image: IMG.glow, frequencyWeeks: 1,
    desc: "A quick metabolic lift",
    long: "A fast, nearly painless B12 injection to support energy, mood and metabolism between visits.",
    benefits: ["Energy support", "Metabolic boost", "In and out in 15 minutes"],
    expect: ["Quick consult", "Single injection", "Go about your day"],
  },
];

export const PROVIDERS: Provider[] = [
  { id: "p1", name: "Emily Johnson", role: "Licensed Aesthetician", rating: 4.9, years: 8, hue: "#8a6f4d" },
  { id: "p2", name: "Sarah Williams", role: "Advanced Injector", rating: 5.0, years: 11, hue: "#5f7a5a" },
  { id: "p3", name: "Amanda Davis", role: "Skin Specialist", rating: 4.8, years: 6, hue: "#7a5f6d" },
  { id: "p4", name: "Priya Shah", role: "Laser Specialist", rating: 4.9, years: 7, hue: "#5c6f7d" },
  { id: "p5", name: "Danielle Moore", role: "Registered Nurse · Injectables", rating: 5.0, years: 12, hue: "#96683f" },
];

export const REWARD_TIERS: RewardTier[] = [
  { id: "r1", name: "$15 Off Retail", desc: "Apply to any medical-grade skincare.", cost: 250 },
  { id: "r2", name: "Free LED Add-On", desc: "Boost any facial with LED therapy.", cost: 500 },
  { id: "r3", name: "$50 Off Any Treatment", desc: "Our most-loved reward.", cost: 750 },
  { id: "r4", name: "Free Radiance Facial", desc: "A complimentary 50-minute glow.", cost: 1200 },
  { id: "r5", name: "$150 Glow Credit", desc: "Use toward any service, anytime.", cost: 2000 },
];

export const MEMBERSHIP_PLANS = [
  {
    id: "m1", name: "Glow Membership", price: 149, per: "month", featured: true,
    includes: ["Monthly HydraFacial", "10% off skincare", "Priority booking", "Exclusive member offers", "Birthday reward"],
  },
  {
    id: "m2", name: "Laser Hair Removal Package", price: 999, per: "6 sessions", featured: false,
    includes: ["6 full sessions", "Save $495 vs. single visits", "Any area, one price", "Priority evening slots"],
  },
  {
    id: "m3", name: "Botox Club", price: 249, per: "quarter", featured: false,
    includes: ["Quarterly Botox visit", "Free touch-up window", "15% off additional units", "Member pricing on filler"],
  },
];

export const EARN_WAYS = [
  { label: "Book a treatment", pts: 100 },
  { label: "Refer a friend", pts: 200 },
  { label: "Leave a review", pts: 50 },
  { label: "Purchase a package", pts: 300 },
];

/* ---------------- chart series (illustrative demo data) ---------------- */

export const REVENUE_SERIES: Record<string, number[]> = {
  "7d": [3120, 2840, 3560, 4110, 3890, 4620, 4250],
  "30d": [2650, 2890, 2410, 3120, 3380, 2960, 3540, 3210, 2870, 3690, 3450, 3980, 3720, 3310, 4120, 3860, 3540, 4280, 3990, 4410, 4150, 3880, 4520, 4260, 4680, 4390, 4110, 4590, 4720, 4250],
  "90d": [18200, 19400, 21100, 20300, 22600, 23900, 22800, 24700, 26100, 25400, 27300, 28900],
};
export const APPT_SERIES: Record<string, number[]> = {
  "7d": [18, 21, 17, 23, 26, 24, 23],
  "30d": [14, 16, 15, 18, 17, 19, 21, 20, 18, 22, 21, 23, 22, 20, 24, 23, 21, 25, 24, 26, 25, 23, 27, 26, 24, 28, 27, 25, 29, 23],
  "90d": [118, 126, 131, 124, 138, 142, 135, 148, 152, 146, 158, 161],
};
export const REFERRAL_SERIES = [6, 9, 8, 12, 15, 14, 18, 21, 19, 24, 27, 31];
export const TOP_TREATMENTS = [
  { name: "HydraFacial", revenue: 12480, share: 100 },
  { name: "Botox", revenue: 10850, share: 87 },
  { name: "Laser Hair Removal", revenue: 8640, share: 69 },
  { name: "Microneedling", revenue: 5420, share: 43 },
  { name: "CoolSculpting", revenue: 4900, share: 39 },
];
export const BASE_METRICS = {
  todayRevenue: 4250, newClientsToday: 7, returningToday: 16,
  rebookTotal: 47, potentialReturns: 32, inactiveHighValue: 7, readyForRewards: 5,
  avgRating: 4.9, reviewsThisMonth: 27,
  membersActive: 84, mrr: 12516, churn: 2.1,
  referrals: 48, referralClients: 31, referralRevenue: 4280, referralRewards: 1240,
  pointsIssued: 128400, redemptionsTotal: 96, rewardLiability: 6240, enrolled: 214,
  repeatRate: 61, avgClientValue: 237, cancellationRate: 4.2,
};

/* ---------------- reviews ---------------- */

export const REVIEWS: Review[] = [
  { id: "rv1", name: "Camila R.", treatment: "HydraFacial", stars: 5, text: "My skin has never looked this good. Emily is an artist — the whole visit feels like a ritual.", when: "2 days ago" },
  { id: "rv2", name: "Jordan P.", treatment: "Botox", stars: 5, text: "Completely natural results. Nobody can tell — I just look rested. Sarah is incredible.", when: "4 days ago" },
  { id: "rv3", name: "Dana W.", treatment: "Laser Hair Removal", stars: 5, text: "Four sessions in and the difference is unreal. The app booking makes it effortless.", when: "1 week ago" },
  { id: "rv4", name: "Felicia M.", treatment: "Microneedling", stars: 4, text: "Great experience and honest advice — no pressure to upsell, just results.", when: "1 week ago" },
  { id: "rv5", name: "Alex T.", treatment: "CoolSculpting", stars: 5, text: "The team tracked my progress visit by visit. Professional, warm, and the results speak.", when: "2 weeks ago" },
  { id: "rv6", name: "Monique S.", treatment: "Glow Radiance Facial", stars: 5, text: "Booked at 9 AM, glowing by 10. The membership basically pays for itself.", when: "2 weeks ago" },
];

/* ---------------- seed builder ---------------- */

const NAMES: Array<[string, number, number, number, number]> = [
  // [name, visits, days since last visit, lifetime value, points]
  ["Emma Carter", 12, 42, 2840, 640],
  ["Sarah Miller", 14, 118, 3120, 410],
  ["Jessica Brown", 9, 58, 1920, 520],
  ["Olivia Martinez", 11, 33, 2410, 780],
  ["Ava Thompson", 6, 71, 1540, 350],
  ["Sophia Nguyen", 16, 21, 3680, 920],
  ["Isabella Rossi", 8, 95, 2130, 260],
  ["Mia Anderson", 4, 12, 840, 410],
  ["Charlotte Hayes", 13, 27, 2980, 610],
  ["Amelia Foster", 7, 64, 1610, 300],
  ["Harper Quinn", 18, 9, 4210, 1150],
  ["Evelyn Brooks", 5, 47, 1120, 220],
  ["Aria Bennett", 10, 36, 2260, 480],
  ["Lily Ramirez", 3, 5, 610, 340],
  ["Grace Sullivan", 12, 83, 2750, 390],
  ["Chloe Turner", 9, 16, 1980, 560],
  ["Zoe Castellano", 2, 3, 380, 240],
  ["Nora Patel", 15, 29, 3340, 830],
  ["Riley Dawson", 6, 52, 1350, 280],
  ["Layla Hassan", 11, 24, 2540, 700],
  ["Madison Reed", 8, 77, 1870, 330],
  ["Victoria Lane", 20, 14, 5120, 1310],
  ["Stella Moreau", 5, 41, 1190, 260],
  ["Hannah Kim", 7, 6, 1520, 480],
  ["Bella Fitzgerald", 10, 68, 2340, 420],
  ["Aurora Diaz", 4, 88, 960, 180],
  ["Penelope Ward", 13, 19, 3060, 740],
  ["Scarlett Vega", 6, 34, 1420, 310],
  ["Ivy Nakamura", 9, 11, 2080, 590],
  ["Ruby Callahan", 3, 74, 720, 160],
];

function clientSeed(): Client[] {
  return NAMES.map(([name, visits, days, ltv, points], i) => {
    const id = `c${i + 1}`;
    const status: ClientStatus =
      visits <= 2 ? "New" : days >= 60 ? "At Risk" : ltv >= 2500 ? "VIP" : "Active";
    const treatments = ["t-hydro", "t-botox", "t-laser", "t-micro", "t-glow", "t-iv", "t-peel", "t-filler"];
    return {
      id, name,
      email: name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ +/g, ".") + "@example.com",
      phone: `(305) 555-0${String(100 + i * 3).slice(-3)}`,
      visits, lastVisit: days > 0 ? addDaysISO(-days) : null,
      ltv, points, status,
      member: i === 5 || i === 10 || i === 21,
      lastTreatmentId: treatments[i % treatments.length],
      rebookReadyAt: null, reminded: false,
    };
  });
}

function appointmentSeed(clients: Client[]): Appointment[] {
  const out: Appointment[] = [];
  const t = todayISO();
  const cyc = ["t-hydro", "t-botox", "t-laser", "t-peel", "t-micro", "t-glow", "t-iv", "t-filler", "t-cool", "t-lymph"];
  const dayTimes = ["9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "1:30 PM", "2:15 PM", "3:00 PM", "3:45 PM", "4:30 PM"];

  // Emma's story
  out.push(
    { id: "ae1", clientId: "c1", clientName: "Emma Carter", treatmentId: "t-hydro", providerId: "p1", date: addDaysISO(-42), time: "2:30 PM", status: "completed", price: 199 },
    { id: "ae2", clientId: "c1", clientName: "Emma Carter", treatmentId: "t-botox", providerId: "p5", date: addDaysISO(-44), time: "11:00 AM", status: "completed", price: 350 },
    { id: "ae3", clientId: "c1", clientName: "Emma Carter", treatmentId: "t-laser", providerId: "p4", date: addDaysISO(-82), time: "3:00 PM", status: "completed", price: 249 },
    { id: "ae4", clientId: "c1", clientName: "Emma Carter", treatmentId: "t-hydro", providerId: "p1", date: addDaysISO(3), time: "2:30 PM", status: "confirmed", price: 199 },
  );

  // Today's schedule (22 bookings across the team)
  for (let i = 0; i < 22; i++) {
    const c = clients[(i + 3) % 27 + 1 < clients.length ? (i + 3) % 27 + 1 : 2];
    const tid = cyc[i % cyc.length];
    const price = TREATMENTS.find((x) => x.id === tid)!.price;
    out.push({
      id: `at${i}`, clientId: c.id, clientName: c.name, treatmentId: tid,
      providerId: PROVIDERS[i % 5].id, date: t, time: dayTimes[i % dayTimes.length],
      status: i < 3 ? "completed" : i === 7 ? "pending" : i === 15 ? "checked-in" : "confirmed",
      price,
    });
  }

  // Upcoming week
  for (let i = 0; i < 8; i++) {
    const c = clients[(i + 11) % clients.length];
    const tid = cyc[(i + 4) % cyc.length];
    out.push({
      id: `af${i}`, clientId: c.id, clientName: c.name, treatmentId: tid,
      providerId: PROVIDERS[(i + 2) % 5].id, date: addDaysISO(1 + (i % 5)), time: dayTimes[(i * 3) % dayTimes.length],
      status: "confirmed", price: TREATMENTS.find((x) => x.id === tid)!.price, newClient: i === 5,
    });
  }

  // Recent past, other clients
  for (let i = 0; i < 10; i++) {
    const c = clients[(i + 6) % clients.length];
    const tid = cyc[(i + 2) % cyc.length];
    out.push({
      id: `ap${i}`, clientId: c.id, clientName: c.name, treatmentId: tid,
      providerId: PROVIDERS[(i + 1) % 5].id, date: addDaysISO(-(4 + i * 6)), time: dayTimes[(i * 5) % dayTimes.length],
      status: "completed", price: TREATMENTS.find((x) => x.id === tid)!.price,
    });
  }
  return out;
}

function promotionSeed(): Promotion[] {
  return [
    { id: "pm1", kind: "percent", title: "Summer Glow Event", offer: "20% OFF HydraFacial", detail: "Your glow deserves a little extra.", expires: addDaysISO(7), audience: "All clients", treatmentId: "t-hydro" },
    { id: "pm2", kind: "upgrade", title: "VIP Treatment Upgrade", offer: "Upgrade your treatment for $49", detail: "Add LED + lymphatic massage to any visit.", expires: addDaysISO(14), audience: "VIP clients", treatmentId: null },
    { id: "pm3", kind: "dollars", title: "We Miss You ✨", offer: "$50 OFF your next visit", detail: "Available for selected returning clients.", expires: addDaysISO(10), audience: "Inactive 60+ days", treatmentId: null },
    { id: "pm4", kind: "percent", title: "Bounce Back", offer: "15% OFF Botox", detail: "Stay smooth through the season.", expires: addDaysISO(14), audience: "All clients", treatmentId: "t-botox" },
    { id: "pm5", kind: "event", title: "Smooth Summer", offer: "Buy 4 laser sessions, get 2 free", detail: "Our best laser package of the year.", expires: addDaysISO(21), audience: "All clients", treatmentId: "t-laser" },
    { id: "pm6", kind: "dollars", title: "Give $50, Get $50", detail: "Share the glow with someone you love.", offer: "Referral reward, both ways", expires: addDaysISO(30), audience: "All clients", treatmentId: null },
    { id: "pm7", kind: "event", title: "Glow After Dark", offer: "Complimentary LED add-on after 5 PM", detail: "Golden-hour appointments, golden perks.", expires: addDaysISO(10), audience: "All clients", treatmentId: null },
    { id: "pm8", kind: "percent", title: "Fresh Start", offer: "10% OFF Chemical Peels", detail: "Reset your skin before the season turns.", expires: addDaysISO(18), audience: "All clients", treatmentId: "t-peel" },
    { id: "pm9", kind: "dollars", title: "Birthday Month", offer: "Free Radiance Facial with any treatment", detail: "Celebrate with us — on the house.", expires: addDaysISO(30), audience: "Members", treatmentId: null },
    { id: "pm10", kind: "event", title: "HydraFacial Fridays", offer: "Every 5th visit free", detail: "Loyalty, the Glow way.", expires: addDaysISO(45), audience: "All clients", treatmentId: "t-hydro" },
  ];
}

const now = Date.now();

export function seedState(): DemoState {
  const clients = clientSeed();
  return {
    v: 3,
    mode: "client",
    brand: {
      name: "Glow Med Spa", tagline: "Your best self starts here.",
      location: "Miami, Florida", address: "2140 Brickell Avenue, Miami, FL 33131",
      phone: "(305) 555-0188", email: "hello@glowmedspa.com",
      accent: "#a67c42", mono: "serif",
      hours: "Mon–Fri 9 AM – 7 PM · Sat 10 AM – 6 PM · Sun closed",
    },
    clients,
    appointments: appointmentSeed(clients),
    promotions: promotionSeed(),
    notifications: [
      { id: "n1", title: "Summer Glow Event", body: "20% off HydraFacial through next week. Your glow deserves a little extra.", ts: now - 3600e3 * 5, read: false, kind: "promo", action: { type: "tab", tab: "book" } },
      { id: "n2", title: "Welcome to Glow ✨", body: "Your digital membership card is ready in Profile. See you soon, Emma.", ts: now - DAY * 2, read: true, kind: "system" },
    ],
    redemptions: [
      { id: "rd1", client: "Victoria Lane", reward: "$50 Off Any Treatment", points: 750, date: addDaysISO(-2) },
      { id: "rd2", client: "Harper Quinn", reward: "$150 Glow Credit", points: 2000, date: addDaysISO(-6) },
    ],
    waitlist: [
      { id: "w1", client: "Emma Carter", treatmentId: "t-hydro", pref: "Friday · 2:30 PM", notified: false, isYou: true },
      { id: "w2", client: "Sarah Miller", treatmentId: "t-laser", pref: "Weekday evenings", notified: false },
      { id: "w3", client: "Jessica Brown", treatmentId: "t-hydro", pref: "Saturday mornings", notified: false },
    ],
    openSlots: [
      { id: "s1", date: nextWeekdayISO(5), time: "2:30 PM", treatmentId: "t-hydro", note: "Recently cancelled" },
    ],
    reviews: REVIEWS,
    pendingReview: null,
    reviewDone: false,
    member: false,
    packagesOwned: [],
    addedRevenue: 0,
    campaignsSent: 0,
    memberJoins: 0,
    flagged: { booked: false, completed: false, promo: false, notif: false, redeemed: false, reviewed: false },
    prefill: null,
    clientTab: "home",
    dashSection: "overview",
    providerOff: [],
    serviceOff: [],
    notifPrefs: { bookings: true, promos: true, reminders: true },
    activity: [
      { ts: now - 60e3 * 4, text: "Reminder sent to Olivia Martinez" },
      { ts: now - 60e3 * 18, text: "Emma Carter booked HydraFacial · Jun " + new Date(addDaysISO(3) + "T12:00:00").getDate() },
      { ts: now - 60e3 * 42, text: "New client Zoe Castellano joined via referral" },
    ],
  };
}

/* ---------------- lookups ---------------- */

export const treatmentById = (id: string) => TREATMENTS.find((t) => t.id === id);
export const providerById = (id: string) => PROVIDERS.find((p) => p.id === id);
export const rebookWindow = (baseISO: string, weeks: number): [string, string] => [
  addDaysISO(weeks * 7 - 7, baseISO), addDaysISO(weeks * 7, baseISO),
];
export const eligibleForRebook = (c: Client): boolean =>
  c.rebookReadyAt !== null || (c.lastVisit !== null && daysSince(c.lastVisit) >= 28);
