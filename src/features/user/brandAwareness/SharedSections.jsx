import { useState, useRef, useEffect } from "react"
import { Reveal } from "../../../hooks/useReveal"
import { STATS, TEAM, CASES, PILLARS, STEPS } from "./sharedContent"
import { PHONE_COUNTRIES } from "./phoneCountries"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  maroon: "#6B1818", maroonSoft: "#7E2424",
  accent: "#C8354B", accentDeep: "#9E2538", accentRose: "#E8B4BD",
}
const serifFont = "'Fraunces',serif"
const sansFont = "'Inter',sans-serif"
const monoFont = "'JetBrains Mono',monospace"

export { C, serifFont, sansFont, monoFont }

/* ── Stat strip ── */
export function StatStrip({ variant = "light" }) {
  const dark = variant === "dark"
  return (
    <section style={{ background: dark ? C.ink : C.cream, padding: "56px clamp(20px,5vw,64px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 28, maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 60}>
            <p style={{ fontFamily: serifFont, fontSize: "clamp(26px,3.2vw,42px)", fontWeight: 400, color: C.accent, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{s.n}</p>
            <p style={{ fontFamily: sansFont, fontSize: 12.5, color: dark ? "rgba(255,255,255,0.55)" : C.stone, margin: 0, lineHeight: 1.5 }}>{s.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── Pillars (what a strong profile needs) ── */
export function PillarsSection({ variant = "light" }) {
  const dark = variant === "dark"
  return (
    <section style={{ background: dark ? C.inkSoft : C.creamSoft, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 14, textAlign: "center" }}>What we build</p>
          <h2 style={{ fontFamily: serifFont, fontSize: "clamp(24px,3vw,38px)", color: dark ? "#fff" : C.ink, textAlign: "center", margin: "0 0 44px", letterSpacing: "-0.01em" }}>
            What a strong application actually needs.
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {PILLARS.map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, borderRadius: 14, padding: "24px 22px", height: "100%" }}>
                <h3 style={{ fontFamily: serifFont, fontStyle: "italic", fontSize: 20, color: dark ? "#fff" : C.ink, margin: "0 0 10px" }}>{p.t}</h3>
                <p style={{ fontFamily: sansFont, fontSize: 13.5, lineHeight: 1.6, color: dark ? "rgba(255,255,255,0.6)" : C.stone, margin: 0 }}>{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Team grid ── */
export function TeamSection({ team = TEAM, variant = "light" }) {
  const dark = variant === "dark"
  return (
    <section style={{ background: dark ? C.ink : C.cream, padding: "80px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 14, textAlign: "center" }}>Your team</p>
          <h2 style={{ fontFamily: serifFont, fontSize: "clamp(24px,3vw,38px)", color: dark ? "#fff" : C.ink, textAlign: "center", margin: "0 0 44px", letterSpacing: "-0.01em" }}>
            Senior counselors. Not junior advisors.
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
          {team.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: 24, height: "100%" }}>
                <div style={{ width: 52, height: 52, borderRadius: 999, background: `linear-gradient(135deg,${C.accent},${C.maroon})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ fontFamily: serifFont, fontSize: 17, color: "#fff" }}>{t.initials}</span>
                </div>
                <h3 style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 15, color: dark ? "#fff" : C.ink, margin: "0 0 3px" }}>{t.name}</h3>
                <p style={{ fontFamily: sansFont, fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>{t.role}</p>
                <p style={{ fontFamily: sansFont, fontSize: 13, lineHeight: 1.6, color: dark ? "rgba(255,255,255,0.55)" : C.stone, margin: 0, fontWeight: 350 }}>{t.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Case studies — compact 2x2 grid ── */
export function CasesSection({ variant = "light" }) {
  const dark = variant === "dark"
  return (
    <section style={{ background: dark ? C.inkSoft : C.creamSoft, padding: "80px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 14, textAlign: "center" }}>What we've built</p>
          <h2 style={{ fontFamily: serifFont, fontSize: "clamp(24px,3vw,38px)", color: dark ? "#fff" : C.ink, textAlign: "center", margin: "0 0 44px", letterSpacing: "-0.01em" }}>
            Real students. Real applications.
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18 }}>
          {CASES.map((c, i) => (
            <Reveal key={c.name} delay={i * 70}>
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, borderRadius: 16, padding: 26, height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: serifFont, fontSize: 19, color: dark ? "#fff" : C.ink, margin: 0 }}>{c.name}</h3>
                  <span style={{ fontFamily: monoFont, fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.tag}</span>
                </div>
                <p style={{ fontFamily: sansFont, fontSize: 13, lineHeight: 1.6, color: dark ? "rgba(255,255,255,0.5)" : C.stoneLight, margin: "0 0 12px", fontStyle: "italic" }}>{c.snapshot}</p>
                <p style={{ fontFamily: sansFont, fontSize: 13.5, lineHeight: 1.65, color: dark ? "rgba(255,255,255,0.72)" : C.stone, margin: "0 0 14px", fontWeight: 350 }}>{c.built}</p>
                <p style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 13, color: C.accent, margin: 0 }}>→ {c.outcome}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 3-step process ── */
export function StepsSection({ variant = "light" }) {
  const dark = variant === "dark"
  return (
    <section style={{ background: dark ? C.ink : C.cream, padding: "80px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 14, textAlign: "center" }}>How it works</p>
          <h2 style={{ fontFamily: serifFont, fontSize: "clamp(24px,3vw,38px)", color: dark ? "#fff" : C.ink, textAlign: "center", margin: "0 0 48px", letterSpacing: "-0.01em" }}>
            Three steps. No pressure to commit today.
          </h2>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div style={{ display: "flex", gap: 22, padding: "22px 4px", borderTop: i > 0 ? `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` : "none" }}>
                <span style={{ fontFamily: serifFont, fontStyle: "italic", fontSize: 26, color: C.accent, flexShrink: 0, width: 40 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 16, color: dark ? "#fff" : C.ink, margin: "0 0 6px" }}>{s.t}</h3>
                  <p style={{ fontFamily: sansFont, fontSize: 13.5, lineHeight: 1.65, color: dark ? "rgba(255,255,255,0.55)" : C.stone, margin: 0, fontWeight: 350 }}>{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Same curriculum list + HubSpot property name used across every regional
// landing page (default theme + all Framer sources) — kept identical so
// the value HubSpot receives is consistent everywhere.
const HS_FIELD_CURRICULUM = "which_curriculum_is_your_child_enrolled_in"
const CURRICULUM_OPTIONS = ["A-Levels", "IB (International Baccalaureate)", "IGCSE / GCSE", "AP / American Curriculum", "CBSE", "ICSE", "Others"]

/* ── HubSpot lead-capture form (HK / UK only) ──
   Posts directly to HubSpot's Forms Submission API — same pattern used by
   registerForWebinar's HubSpot leg — no internal API/DB involved here,
   this is a pure lead-capture form. */
export function HubspotLeadForm({ portalId = "4257853", formId, region = "na2", dark = true, defaultIso = "HK" }) {
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", countryIso: defaultIso, phone: "", school: "", countryofresidence: "", curriculum: "" })
  const [state, setState] = useState({ submitting: false, done: false, error: "" })
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const phoneRef = useRef(null)
  const [residenceOpen, setResidenceOpen] = useState(false)
  const [residenceSearch, setResidenceSearch] = useState("")
  const residenceRef = useRef(null)
  const [curriculumOpen, setCurriculumOpen] = useState(false)
  const curriculumRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false)
      if (residenceRef.current && !residenceRef.current.contains(e.target)) setResidenceOpen(false)
      if (curriculumRef.current && !curriculumRef.current.contains(e.target)) setCurriculumOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const selectedCountry = PHONE_COUNTRIES.find((c) => c.iso === form.countryIso) || PHONE_COUNTRIES[0]
  const filteredCountries = countrySearch
    ? PHONE_COUNTRIES.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.dial.includes(countrySearch))
    : PHONE_COUNTRIES
  const filteredResidenceCountries = residenceSearch
    ? PHONE_COUNTRIES.filter((c) => c.name.toLowerCase().includes(residenceSearch.toLowerCase()))
    : PHONE_COUNTRIES

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const fieldCls = dark
    ? "w-full bg-white/[0.05] border border-white/15 rounded-lg px-3.5 py-3 text-[13.5px] text-white placeholder-white/35 focus:outline-none focus:border-accent transition-colors"
    : "w-full bg-white border border-black/10 rounded-lg px-3.5 py-3 text-[13.5px] text-ink placeholder-stone-light focus:outline-none focus:border-accent transition-colors"
  const labelCls = `block text-[11.5px] font-semibold mb-1.5 ${dark ? "text-white/70" : "text-stone"}`

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formId) { setState((s) => ({ ...s, error: "Form is not configured yet." })); return }
    if (!form.firstname || !form.email) { setState((s) => ({ ...s, error: "First name and email are required." })); return }
    if (!form.countryofresidence) { setState((s) => ({ ...s, error: "Please select your country of residence." })); return }
    if (!form.school.trim()) { setState((s) => ({ ...s, error: "Please enter your school name." })); return }
    if (!form.curriculum) { setState((s) => ({ ...s, error: "Please select your child's curriculum." })); return }
    setState({ submitting: true, done: false, error: "" })
    try {
      const fullPhone = form.phone ? `${selectedCountry.dial} ${form.phone}` : ""
      const base = region ? `https://api-${region}.hsforms.com` : "https://api.hsforms.com"
      const res = await fetch(`${base}/submissions/v3/integration/submit/${portalId}/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: form.firstname },
            { name: "lastname", value: form.lastname },
            { name: "email", value: form.email.trim() },
            { name: "phone", value: fullPhone },
            { name: "countryofresidence", value: form.countryofresidence },
            { name: "school", value: form.school.trim() },
            { name: HS_FIELD_CURRICULUM, value: form.curriculum },
          ].filter((f) => f.value),
          context: { pageUri: window.location.href, pageName: document.title },
        }),
      })
      if (!res.ok) throw new Error("Submission failed")
      setState({ submitting: false, done: true, error: "" })
    } catch (err) {
      setState({ submitting: false, done: false, error: "Something went wrong — please try again." })
    }
  }

  if (state.done) {
    return (
      <div style={{ textAlign: "center", padding: "36px 0" }}>
        <p style={{ fontFamily: serifFont, fontStyle: "italic", fontSize: 24, color: dark ? "#fff" : C.ink, marginBottom: 8 }}>Thank you</p>
        <p style={{ fontFamily: sansFont, fontSize: 13.5, color: dark ? "rgba(255,255,255,0.55)" : C.stone }}>We'll be in touch within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>First name *</label>
          <input placeholder="First name" value={form.firstname} onChange={set("firstname")} className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>Last name</label>
          <input placeholder="Last name" value={form.lastname} onChange={set("lastname")} className={fieldCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email *</label>
        <input type="email" placeholder="Email address" value={form.email} onChange={set("email")} className={fieldCls} />
      </div>

      {/* Phone — searchable country-code dropdown + number */}
      <div>
        <label className={labelCls}>Mobile phone number</label>
        <div style={{ display: "flex", gap: 8, position: "relative" }} ref={phoneRef}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button type="button" onClick={() => setPhoneOpen((v) => !v)}
              className={dark ? "bg-white/[0.07] border border-white/15 text-white" : "bg-white border border-black/10 text-ink"}
              style={{ height: "100%", minWidth: 92, padding: "12px 10px", borderRadius: 8, fontFamily: sansFont, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontWeight: 600 }}>{selectedCountry.iso}</span>
              <span style={{ color: dark ? "rgba(255,255,255,0.5)" : C.stoneLight }}>{selectedCountry.dial}</span>
              <span style={{ color: dark ? "rgba(255,255,255,0.4)" : C.stoneLight, fontSize: 10, marginLeft: "auto" }}>▾</span>
            </button>
            {phoneOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, width: 260, maxHeight: 280, overflowY: "auto",
                background: dark ? C.inkSoft : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                borderRadius: 12, zIndex: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}>
                <div style={{ padding: "10px 10px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                  <input type="text" placeholder="Search country…" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)}
                    className={dark ? "bg-white/[0.06] border border-white/10 text-white placeholder-white/30" : "bg-cream-soft border border-black/10 text-ink placeholder-stone-light"}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 7, fontFamily: sansFont, fontSize: 13, outline: "none" }} />
                </div>
                {filteredCountries.map((c) => (
                  <button key={c.iso} type="button"
                    onClick={() => { setForm((f) => ({ ...f, countryIso: c.iso })); setPhoneOpen(false); setCountrySearch("") }}
                    style={{
                      width: "100%", background: form.countryIso === c.iso ? "rgba(200,53,75,0.13)" : "none", border: "none", cursor: "pointer",
                      padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                      color: dark ? "#fff" : C.ink, fontFamily: sansFont, fontSize: 13, textAlign: "left",
                    }}>
                    <span>{c.name}</span>
                    <span style={{ color: dark ? "rgba(255,255,255,0.4)" : C.stoneLight, fontSize: 12 }}>{c.dial}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input type="tel" placeholder="Phone number" value={form.phone} onChange={set("phone")} className={fieldCls} style={{ flex: 1 }} />
        </div>
      </div>

      <div>
        <label className={labelCls}>School name *</label>
        <input placeholder="e.g. Raffles Institution" value={form.school} onChange={set("school")} className={fieldCls} />
      </div>

      {/* Country of residence — custom dropdown (native <select> popups can't
          be styled — they render as an unstyleable white OS/browser sheet,
          especially on mobile). Same searchable pattern as the phone code
          dropdown above, so it actually respects dark/light theme. */}
      <div style={{ position: "relative" }} ref={residenceRef}>
        <label className={labelCls}>Country of residence *</label>
        <button type="button" onClick={() => setResidenceOpen((v) => !v)}
          className={fieldCls}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}>
          <span style={{ color: form.countryofresidence ? "inherit" : (dark ? "rgba(255,255,255,0.35)" : C.stoneLight) }}>
            {form.countryofresidence || "Select country"}
          </span>
          <span style={{ color: dark ? "rgba(255,255,255,0.4)" : C.stoneLight, fontSize: 10, marginLeft: 8 }}>▾</span>
        </button>
        {residenceOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: 280, overflowY: "auto",
            background: dark ? C.inkSoft : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 12, zIndex: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}>
            <div style={{ padding: "10px 10px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, position: "sticky", top: 0, background: dark ? C.inkSoft : "#fff" }}>
              <input type="text" placeholder="Search country…" value={residenceSearch} onChange={(e) => setResidenceSearch(e.target.value)}
                className={dark ? "bg-white/[0.06] border border-white/10 text-white placeholder-white/30" : "bg-cream-soft border border-black/10 text-ink placeholder-stone-light"}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 7, fontFamily: sansFont, fontSize: 13, outline: "none" }} />
            </div>
            {filteredResidenceCountries.map((c) => (
              <button key={c.iso} type="button"
                onClick={() => { setForm((f) => ({ ...f, countryofresidence: c.name })); setResidenceOpen(false); setResidenceSearch("") }}
                style={{
                  width: "100%", background: form.countryofresidence === c.name ? "rgba(200,53,75,0.13)" : "none", border: "none", cursor: "pointer",
                  padding: "9px 14px", display: "block", textAlign: "left",
                  color: dark ? "#fff" : C.ink, fontFamily: sansFont, fontSize: 13,
                }}>
                {c.name}
              </button>
            ))}
            {filteredResidenceCountries.length === 0 && (
              <p style={{ padding: "14px", fontFamily: sansFont, fontSize: 12.5, color: dark ? "rgba(255,255,255,0.4)" : C.stoneLight, margin: 0 }}>No matches</p>
            )}
          </div>
        )}
      </div>

      {/* Curriculum — same custom-dropdown pattern (short list, no search needed) */}
      <div style={{ position: "relative" }} ref={curriculumRef}>
        <label className={labelCls}>Which curriculum is your child enrolled in? *</label>
        <button type="button" onClick={() => setCurriculumOpen((v) => !v)}
          className={fieldCls}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}>
          <span style={{ color: form.curriculum ? "inherit" : (dark ? "rgba(255,255,255,0.35)" : C.stoneLight) }}>
            {form.curriculum || "Select curriculum"}
          </span>
          <span style={{ color: dark ? "rgba(255,255,255,0.4)" : C.stoneLight, fontSize: 10, marginLeft: 8 }}>▾</span>
        </button>
        {curriculumOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: 240, overflowY: "auto",
            background: dark ? C.inkSoft : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 12, zIndex: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}>
            {CURRICULUM_OPTIONS.map((c) => (
              <button key={c} type="button"
                onClick={() => { setForm((f) => ({ ...f, curriculum: c })); setCurriculumOpen(false) }}
                style={{
                  width: "100%", background: form.curriculum === c ? "rgba(200,53,75,0.13)" : "none", border: "none", cursor: "pointer",
                  padding: "9px 14px", display: "block", textAlign: "left",
                  color: dark ? "#fff" : C.ink, fontFamily: sansFont, fontSize: 13,
                }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {state.error && <p style={{ color: C.accentRose, fontSize: 12 }}>{state.error}</p>}
      <button type="submit" disabled={state.submitting}
        style={{ width: "100%", background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontFamily: sansFont, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 6, opacity: state.submitting ? 0.6 : 1 }}>
        {state.submitting ? "Submitting…" : "Book a free 30-minute call →"}
      </button>
    </form>
  )
}

/* ── Final CTA ── */
export function CtaSection({ headline, bookingUrl }) {
  return (
    <section style={{ background: C.cream, padding: "88px clamp(20px,5vw,64px)", textAlign: "center" }}>
      <Reveal>
        <h2 style={{ fontFamily: serifFont, fontSize: "clamp(26px,3.6vw,46px)", color: C.ink, margin: "0 0 22px", letterSpacing: "-0.02em", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
          {headline}
        </h2>
        <a href={bookingUrl} style={{ display: "inline-block", background: C.ink, color: "#fff", borderRadius: 999, padding: "14px 36px", fontFamily: sansFont, fontSize: 14.5, fontWeight: 500, textDecoration: "none" }}>
          Book a free 30-minute call →
        </a>
      </Reveal>
    </section>
  )
}
