import { useState } from "react";
import { useDemo } from "../state/store";
import { TREATMENTS, fmtShort, addDaysISO } from "../data/demo";
import { Seg, MiniPhone, Reveal } from "../components/ui";
import { IcMegaphone, IcBell, IcCheck, IcSparkles, IcTicket, IcSend } from "../components/icons";

type StudioTab = "campaign" | "push";

export default function Promotions() {
  const { s, addPromotion, sendPush } = useDemo();
  const [tab, setTab] = useState<StudioTab>("campaign");

  // campaign builder state
  const [kind, setKind] = useState<"percent" | "dollars" | "upgrade">("percent");
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState(20);
  const [dollars, setDollars] = useState(50);
  const [treatmentId, setTreatmentId] = useState("t-hydro");
  const [expires, setExpires] = useState(addDaysISO(14));
  const [audience, setAudience] = useState("All clients");

  // push state
  const [pTitle, setPTitle] = useState("We miss you ✨");
  const [pBody, setPBody] = useState("Enjoy $50 OFF your next treatment this week.");
  const [pAudience, setPAudience] = useState("Inactive clients");

  const offerText =
    kind === "percent" ? `${discount}% OFF ${TREATMENTS.find((t) => t.id === treatmentId)?.name ?? ""}`
    : kind === "dollars" ? `$${dollars} OFF your next visit`
    : "Upgrade your treatment for $49";
  const campaignName = name.trim() || (kind === "percent" ? "Seasonal Glow Offer" : kind === "dollars" ? "Come Back Offer" : "VIP Upgrade");

  const send = () => {
    addPromotion({
      kind, title: campaignName, offer: offerText,
      detail: kind === "upgrade" ? "Add LED + lymphatic massage to any visit." : "Book in two taps — your spot is waiting.",
      expires, audience, treatmentId: kind === "upgrade" ? null : treatmentId,
    });
    setName("");
  };

  const input = "w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-accent transition-colors";

  return (
    <div className="space-y-8">
      {/* live campaigns */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="kicker text-accent">Live campaigns</p>
            <h3 className="font-display text-[24px] text-ink mt-1">What your clients see right now</h3>
          </div>
          <p className="text-[11px] text-faint">{s.promotions.length} active · synced to the app</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {s.promotions.slice(0, 9).map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 60}>
              <div className="rounded-xl border border-line bg-paper p-4.5 h-full hover:border-accent-soft hover:-translate-y-0.5 transition-all duration-300" style={{ padding: 18 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] bg-charcoal text-goldsoft rounded-full px-2 py-0.5">
                    {p.kind === "percent" ? "% offer" : p.kind === "dollars" ? "$ offer" : p.kind === "upgrade" ? "Upgrade" : "Event"}
                  </span>
                  {p.isNew && <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] bg-sagetint text-sage rounded-full px-2 py-0.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-sage" style={{ animation: "blinkDot 1.6s infinite" }} />Just sent</span>}
                  <span className="ml-auto text-[9.5px] text-faint">ends {fmtShort(p.expires)}</span>
                </div>
                <p className="font-display text-[18px] text-ink mt-2.5 leading-tight">{p.offer}</p>
                <p className="text-[10.5px] font-bold tracking-wider uppercase text-accent mt-0.5">{p.title}</p>
                <p className="text-[11px] text-muted mt-1.5">{p.audience}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* studio */}
      <section className="rounded-2xl border border-line bg-paper overflow-hidden">
        <div className="border-b border-linesoft px-6 py-4 flex flex-wrap items-center gap-4">
          <div>
            <p className="kicker text-accent">Campaign studio</p>
            <h3 className="font-display text-[22px] text-ink mt-0.5">Create &amp; send in seconds</h3>
          </div>
          <div className="ml-auto">
            <Seg<StudioTab> options={[{ id: "campaign", label: "Promotion" }, { id: "push", label: "Push Notification" }]} value={tab} onChange={setTab} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8 p-6">
          {tab === "campaign" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="kicker block mb-1.5">Campaign name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer Glow Event" className={input} />
              </div>
              <div>
                <label className="kicker block mb-1.5">Promotion type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([["percent", "% Off"], ["dollars", "$ Off"], ["upgrade", "Upgrade"]] as const).map(([id, label]) => (
                    <button key={id} onClick={() => setKind(id)}
                      className={`rounded-lg border py-2 text-[11px] font-bold transition-all ${kind === id ? "border-accent bg-accent-tint text-accent" : "border-line bg-cream text-muted hover:border-accent-soft"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="kicker block mb-1.5">{kind === "percent" ? "Discount" : kind === "dollars" ? "Amount" : "Upgrade price"}</label>
                {kind === "percent" && (
                  <div className="flex items-center gap-3">
                    <input type="range" min={5} max={50} step={5} value={discount} onChange={(e) => setDiscount(+e.target.value)} className="flex-1" aria-label="Discount percent" />
                    <span className="font-display text-xl text-accent w-14 text-right">{discount}%</span>
                  </div>
                )}
                {kind === "dollars" && (
                  <div className="flex items-center gap-3">
                    <input type="range" min={10} max={150} step={10} value={dollars} onChange={(e) => setDollars(+e.target.value)} className="flex-1" aria-label="Dollar amount" />
                    <span className="font-display text-xl text-accent w-14 text-right">${dollars}</span>
                  </div>
                )}
                {kind === "upgrade" && <input value="Add-on upgrade · $49" disabled className={`${input} opacity-70`} />}
              </div>
              {kind !== "upgrade" && (
                <div>
                  <label className="kicker block mb-1.5">Treatment</label>
                  <select value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)} className={input}>
                    {TREATMENTS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="kicker block mb-1.5">Expiration date</label>
                <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={input} />
              </div>
              <div>
                <label className="kicker block mb-1.5">Target audience</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value)} className={input}>
                  {["All clients", "Clients inactive for 60+ days", "VIP clients", "Members only", "New clients (first 30 days)"].map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 flex items-center gap-4 flex-wrap">
                <button onClick={send} className="btn-gold rounded-full px-7 py-3 text-[12px] font-bold tracking-wide flex items-center gap-2">
                  <IcSend className="w-4 h-4" /> SEND CAMPAIGN
                </button>
                <p className="text-[11px] text-muted">Lands instantly in the client app's Promotions tab — flip the demo to see it.</p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="kicker block mb-1.5">Title</label>
                <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className="kicker block mb-1.5">Message</label>
                <textarea value={pBody} onChange={(e) => setPBody(e.target.value)} rows={3} className={`${input} resize-none`} />
              </div>
              <div>
                <label className="kicker block mb-1.5">Audience</label>
                <select value={pAudience} onChange={(e) => setPAudience(e.target.value)} className={input}>
                  {["Inactive clients", "All clients", "VIP clients", "Ready to rebook", "Members only"].map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { if (pTitle && pBody) { sendPush(pTitle, pBody, pAudience); } }}
                  disabled={!pTitle || !pBody}
                  className="btn-gold rounded-full px-7 py-3 text-[12px] font-bold tracking-wide flex items-center gap-2 disabled:opacity-40">
                  <IcBell className="w-4 h-4" /> SEND NOTIFICATION
                </button>
              </div>
              <p className="sm:col-span-2 text-[11px] text-muted">Delivered to the client app's notification center in real time — watch the badge appear.</p>
            </div>
          )}

          {/* phone preview */}
          <div className="hidden lg:block justify-self-center">
            <MiniPhone title={tab === "campaign" ? "Client app · Promotions" : "Client app · Lock screen"}>
              {tab === "campaign" ? (
                <div className="px-3.5 pt-2">
                  <p className="kicker mb-2.5">Promotions</p>
                  <div className="rounded-xl border border-accent-soft bg-gradient-to-br from-paper to-goldtint p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7.5px] font-bold uppercase tracking-widest bg-charcoal text-goldsoft rounded-full px-1.5 py-0.5">{kind === "percent" ? "Limited" : "For you"}</span>
                      <span className="text-[7.5px] font-bold uppercase tracking-widest bg-sagetint text-sage rounded-full px-1.5 py-0.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-sage" style={{ animation: "blinkDot 1.6s infinite" }} />New</span>
                    </div>
                    <p className="font-display text-[15px] text-ink mt-2 leading-tight">{offerText}</p>
                    <p className="text-[8px] font-bold tracking-[0.16em] uppercase text-accent mt-0.5">{campaignName}</p>
                    <p className="text-[8.5px] text-muted mt-1">{audience} · through {fmtShort(expires)}</p>
                    <span className="mt-2.5 inline-block btn-gold rounded-full px-3.5 py-1.5 text-[8.5px] font-bold tracking-wide">BOOK NOW</span>
                  </div>
                  <p className="text-[8.5px] text-faint text-center mt-3">Appears at the top of the list ✨</p>
                </div>
              ) : (
                <div className="px-3.5 pt-6">
                  <p className="text-center text-[9px] font-bold text-faint mb-3">9:41</p>
                  <div className="rounded-xl bg-espresso text-cream p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md btn-gold flex items-center justify-center shrink-0"><IcSparkles className="w-3 h-3" /></span>
                      <p className="text-[9px] font-bold text-cream/70 flex-1">{s.brand.name.toUpperCase()}</p>
                      <span className="text-[8px] text-cream/40">now</span>
                    </div>
                    <p className="text-[11px] font-bold mt-1.5">{pTitle || "Your title"}</p>
                    <p className="text-[9.5px] text-cream/70 leading-snug mt-0.5">{pBody || "Your message appears here."}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-[8.5px] text-faint">
                    <IcCheck className="w-3 h-3" /> Badge count updates instantly
                  </div>
                </div>
              )}
            </MiniPhone>
          </div>
        </div>
      </section>

      {/* quick stats */}
      <section className="grid sm:grid-cols-3 gap-3.5">
        {[
          { icon: <IcMegaphone className="w-4 h-4" />, k: "Campaigns sent", v: String(s.campaignsSent), sub: "this demo session" },
          { icon: <IcTicket className="w-4 h-4" />, k: "Active promotions", v: String(s.promotions.length), sub: "visible in the client app" },
          { icon: <IcCheck className="w-4 h-4" />, k: "Campaign revenue", v: "$3,680", sub: "illustrative demo data" },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-line bg-paper p-4 flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-full bg-accent-tint text-accent flex items-center justify-center shrink-0">{c.icon}</span>
            <div>
              <p className="font-display text-xl text-ink leading-none">{c.v}</p>
              <p className="text-[10.5px] font-bold text-muted mt-1">{c.k} <span className="text-faint font-semibold">· {c.sub}</span></p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
