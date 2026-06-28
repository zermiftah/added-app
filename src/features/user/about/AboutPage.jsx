import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  accent: "#C8354B", accentDeep: "#9E2538",
  border: "rgba(0,0,0,0.07)",
}

/* ── Countries ── */
const COUNTRIES = [ 
  { iso: "AF", name: "Afghanistan", dial: "+93" },
  { iso: "AL", name: "Albania", dial: "+355" },
  { iso: "DZ", name: "Algeria", dial: "+213" },
  { iso: "AR", name: "Argentina", dial: "+54" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "AT", name: "Austria", dial: "+43" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "BE", name: "Belgium", dial: "+32" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "BN", name: "Brunei", dial: "+673" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "CZ", name: "Czechia", dial: "+420" },
  { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "FI", name: "Finland", dial: "+358" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "GR", name: "Greece", dial: "+30" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "HU", name: "Hungary", dial: "+36" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "JO", name: "Jordan", dial: "+962" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "LB", name: "Lebanon", dial: "+961" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "MA", name: "Morocco", dial: "+212" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "PL", name: "Poland", dial: "+48" },
  { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "RO", name: "Romania", dial: "+40" },
  { iso: "RU", name: "Russia", dial: "+7" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "TW", name: "Taiwan", dial: "+886" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
  { iso: "ZM", name: "Zambia", dial: "+260" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263" },
]

function isValidEmail(e) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const d = e.trim().split("@")[1] || ""
  return re.test(e.trim()) && !d.includes("..") && !d.startsWith(".") && !d.endsWith(".")
}

/* ─────────────────────────────
   CONTACT FORM
───────────────────────────────*/
function ContactForm() {
  const [form, setForm] = useState({
    firstname: "", lastname: "", countryIso: "GB",
    phoneDialIso: "GB", phone: "", schoolname: "", email: "", message: "",
  })
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [phoneOpen, setPhoneOpen]   = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const phoneRef = useRef(null)

  useEffect(() => {
    const fn = (e) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  const handleSubmit = async () => {
    setSubmitError("")
    const errs = {}
    if (!form.firstname.trim()) errs.firstname = "Required."
    if (!form.email.trim())     errs.email     = "Required."
    else if (!isValidEmail(form.email)) errs.email = "Invalid email."
    if (!form.countryIso)       errs.countryIso = "Required."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const dial     = COUNTRIES.find(c => c.iso === form.phoneDialIso)?.dial || ""
    const fullPhone = `${dial} ${form.phone.replace(/\D/g, "")}`

    setSubmitting(true)
    try {
      const res = await fetch(
        `https://api-na2.hsforms.com/submissions/v3/integration/submit/4257853/79dd27af-728f-4125-9017-4fa9feb1cdb9`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname",  value: form.firstname.trim() },
              { name: "lastname",   value: form.lastname.trim() },
              { name: "email",      value: form.email.trim() },
              { name: "phone",      value: fullPhone },
              { name: "schoolname", value: form.schoolname.trim() },
              { name: "countryofresidance", value: COUNTRIES.find(c => c.iso === form.countryIso)?.name || "" },
              { name: "message",    value: form.message.trim() },
            ],
            context: {
              pageUri: typeof window !== "undefined" ? window.location.href : "",
              pageName: "AddedEducation — About Us",
            },
          }),
        }
      )
      if (res.ok) {
        setSubmitted(true)
        if (typeof window !== "undefined") {
          if (window.fbq) window.fbq("trackCustom", "Finally_Leads", { landing_page: "about_us" })
          if (window.gtag) window.gtag("event", "Finally_Leads", { landing_page: "about_us" })
        }
      } else {
        const d = await res.json().catch(() => null)
        setSubmitError(d?.message || "Something went wrong. Please try again.")
      }
    } catch {
      setSubmitError("Network error. Please check your connection.")
    } finally {
      setSubmitting(false)
    }
  }

  const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.08)",
    border: `1px solid ${err ? C.accent : "rgba(255,255,255,0.15)"}`,
    borderRadius: 6, padding: "11px 14px",
    fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#fff",
    outline: "none", transition: "border-color 0.18s",
  })

  const lbl = {
    display: "block", fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8, fontWeight: 500, letterSpacing: "0.18em",
    textTransform: "uppercase", color: C.stoneLight, marginBottom: 6,
  }

  const ErrMsg = ({ k }) => errors[k]
    ? <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: "#E8B4BD", margin: "4px 0 0" }}>{errors[k]}</p>
    : null

  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A6A39E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
  const currentDial = COUNTRIES.find(c => c.iso === form.phoneDialIso)
  const filteredCountries = COUNTRIES.filter(c => {
    const q = countrySearch.trim().toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q)
  })

  if (submitted) {
    return (
      <div style={{ padding: "48px 0" }}>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 26, color: "#fff", margin: "0 0 10px" }}>Thanks for reaching out!</p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.stoneLight, lineHeight: 1.6, margin: 0 }}>
          One of our counselors will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .ab-inp::placeholder { color: rgba(255,255,255,0.25) !important; }
        .ab-sel option { background: #1A1A1A; color: #fff; }
        .ab-search::placeholder { color: rgba(255,255,255,0.35) !important; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Row 1: First + Last */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <div>
            <label style={lbl}>First Name*</label>
            <input type="text" placeholder="Jane" value={form.firstname}
              onChange={e => set("firstname", e.target.value)}
              className="ab-inp" style={inp(!!errors.firstname)} />
            <ErrMsg k="firstname" />
          </div>
          <div>
            <label style={lbl}>Last Name</label>
            <input type="text" placeholder="Smith" value={form.lastname}
              onChange={e => set("lastname", e.target.value)}
              className="ab-inp" style={inp(false)} />
          </div>
        </div>

        {/* Row 2: Country + Phone + School */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {/* Country */}
          <div>
            <label style={lbl}>Country*</label>
            <select aria-label="Country of residence" value={form.countryIso} onChange={e => set("countryIso", e.target.value)}
              className="ab-sel"
              style={{ ...inp(!!errors.countryIso), appearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 28, cursor: "pointer" }}>
              {COUNTRIES.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}
            </select>
            <ErrMsg k="countryIso" />
          </div>

          {/* Phone */}
          <div>
            <label style={lbl}>Phone Number</label>
            <div ref={phoneRef} style={{ position: "relative", display: "flex", gap: 5 }}>
              <button type="button" onClick={() => setPhoneOpen(v => !v)}
                style={{ ...inp(false), width: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 8px", cursor: "pointer", fontSize: 12 }}>
                <span style={{ color: "#fff" }}>{currentDial?.iso} {currentDial?.dial}</span>
                <span style={{ fontSize: 7, opacity: 0.5, transform: phoneOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
              </button>
              <input type="tel" inputMode="numeric" placeholder="Mobile" value={form.phone}
                onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
                className="ab-inp" style={{ ...inp(false), flex: 1, minWidth: 0 }} />
              {phoneOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, width: 260, background: C.inkSoft, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.4)", zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <input autoFocus placeholder="Search…" value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)} className="ab-search"
                      style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", fontSize: 12, fontFamily: "'Inter',sans-serif", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", outline: "none" }} />
                  </div>
                  <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {filteredCountries.map(c => {
                      const sel = c.iso === form.phoneDialIso
                      return (
                        <button key={c.iso} type="button"
                          onClick={() => { setForm(f => ({ ...f, phoneDialIso: c.iso })); setPhoneOpen(false); setCountrySearch("") }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", border: "none", background: sel ? "rgba(200,53,75,0.18)" : "transparent", color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 12, textAlign: "left" }}
                          onMouseEnter={e => e.currentTarget.style.background = sel ? "rgba(200,53,75,0.18)" : "rgba(255,255,255,0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = sel ? "rgba(200,53,75,0.18)" : "transparent"}>
                          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, opacity: 0.6, width: 20 }}>{c.iso}</span>
                            {c.name}
                          </span>
                          <span style={{ color: C.stoneLight, fontSize: 11 }}>{c.dial}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* School */}
          <div>
            <label style={lbl}>School Name</label>
            <input type="text" placeholder="School" value={form.schoolname}
              onChange={e => set("schoolname", e.target.value)}
              className="ab-inp" style={inp(false)} />
          </div>
        </div>

        {/* Row 3: Email */}
        <div>
          <label style={lbl}>Email Address*</label>
          <input type="email" placeholder="jane@gmail.com" value={form.email}
            onChange={e => set("email", e.target.value)}
            className="ab-inp" style={inp(!!errors.email)} />
          <ErrMsg k="email" />
        </div>

        {/* Row 4: Message */}
        <div>
          <input type="text" placeholder="Anything else you'd like us to know?" value={form.message}
            onChange={e => set("message", e.target.value)}
            className="ab-inp" style={inp(false)} />
        </div>

        {submitError && (
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#E8B4BD", margin: 0 }}>⚠ {submitError}</p>
        )}

        <div>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ background: submitting ? C.accentDeep : C.accent, color: "#fff", border: "none", borderRadius: 999, padding: "13px 36px", fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.18s", opacity: submitting ? 0.8 : 1 }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentDeep }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = C.accent }}>
            {submitting ? "Submitting…" : "Submit Now"}
          </button>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function AboutPage() {
  const px = "clamp(24px,6vw,80px)"

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      
      <style>{`
        .ab-responsive-card { padding: clamp(24px, 4vw, 56px) !important; }
        @media (max-width: 768px) {
          .ab-sticky-img { position: static !important; }
        }
      `}</style>
      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section style={{ position: "relative", width: "100%", minHeight: "42vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(14,14,14,0.30) 0%, rgba(14,14,14,0.65) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)" }} />
        <img
          src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567186493_hero.webp"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0 }}
        />
        <div style={{ position: "relative", zIndex: 2, padding: `clamp(120px,16vw,200px) ${px} clamp(48px,6vw,80px)`, width: "100%" }}>
          <h1 className="fraunces-display" style={{
            fontSize: "clamp(28px,3.8vw,56px)", lineHeight: 1.04,
            letterSpacing: "-0.025em", color: "#fff", maxWidth: 820, margin: 0,
          }}>
            Your Child Has One Shot.<br />
            We Take That <em style={{ color: C.accent }}>Seriously</em>.
          </h1>
        </div>
      </section>

      {/* ══ 2. INTRO COPY ══ */}
      <section style={{ background: C.cream, padding: `48px ${px}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.stone, margin: 0, fontWeight: 350 }}>
            AddedEducation works with families across 12+ countries to get students into the universities they're actually aiming for.{" "}
            Every student gets one <span style={{ color: C.accent }}>lead counselor</span> – backed by essay specialists and former admissions officers – who stays with them from the first call to final submission.
          </p>
        </div>
      </section>

      {/* ══ 3. DARK CARD — WE HELP YOU EXECUTE ══ */}
      <section style={{ background: C.cream, padding: `0 ${px} 72px` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: C.ink, borderRadius: 20, overflow: "hidden", padding: "56px 56px 56px 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

            {/* Left: two pill sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {/* We help you execute */}
              <div>
                <span style={{
                  display: "inline-block", marginBottom: 20,
                  fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999,
                  padding: "7px 18px", color: "rgba(255,255,255,0.85)",
                }}>We Help You Execute.</span>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", margin: 0, fontWeight: 350 }}>
                  Most consultancies advise. We actually help you execute. That means managing every deadline, draft, and decision alongside your family. Our job isn't just to tell you what to do next; it's to make sure it actually gets done.
                </p>
              </div>

              {/* For high-achievers */}
              <div>
                <span style={{
                  display: "inline-block", marginBottom: 20,
                  fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999,
                  padding: "7px 18px", color: "rgba(255,255,255,0.85)",
                }}>For High-Achievers</span>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", margin: 0, fontWeight: 600 }}>
                  Every course choice, activity, and essay angle is built around who your child actually is. We help build the narrative before we help write it.
                </p>
              </div>
            </div>

            {/* Right: heading + image */}
            <div>
              <h2 className="fraunces-heading" style={{
                fontSize: "clamp(20px,2.2vw,32px)", lineHeight: 1.2,
                letterSpacing: "-0.015em", color: "#fff", margin: "0 0 12px",
              }}>
                Beyond advising, we also help you execute every step of the way.
              </h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.accent, fontWeight: 600, margin: "0 0 28px" }}>
                Our students have earned offers from Harvard, Yale, Columbia, Oxford, Imperial, and more across 12+ countries.
              </p>
              <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: "#2a2a2a" }}>
                <img
                  src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567184030_beyond.webp"
                  alt=""
                  onError={e => e.currentTarget.style.display = "none"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>

          </div>
        </div>
        </div>
      </section>

      {/* ══ 4. CONTACT US ══ */}
      <section style={{ background: C.cream, padding: `0 ${px} 80px` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "start" }}>

          {/* Left: form */}
          <div>
            {/* eyebrow */}
            <span style={{
              display: "inline-block", marginBottom: 24,
              fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              border: `1px solid rgba(0,0,0,0.2)`, borderRadius: 999,
              padding: "7px 18px", color: C.stone,
            }}>Contact Us</span>

            <h2 className="fraunces-heading" style={{
              fontSize: "clamp(24px,3vw,44px)", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: C.ink, margin: "0 0 16px",
            }}>
              Not sure where your child<br />stands? Let's find out{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>together.</em>
            </h2>

            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.stone, margin: "0 0 8px", fontWeight: 350 }}>
              Book a complementary 30-minute call with one of our counselors.
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.stone, margin: "0 0 20px", fontWeight: 350 }}>
              You'll walk away knowing exactly where your child stands, what it would actually take to get them in, and 2–3 concrete next steps – whether you work with us or not.
            </p>

            {/* trust badges */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              {["Families in 12+ countries", "Former admissions officers", "WhatsApp support"].map(t => (
                <span key={t} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.stone, fontWeight: 350 }}>{t}</span>
              ))}
            </div>

            {/* dark form card */}
            <div style={{ background: C.ink, borderRadius: 16, padding: "28px 28px 32px" }}>
              <ContactForm />
            </div>
          </div>

          {/* Right: image */}
          <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "3/4", background: C.creamWarm, position: "sticky", top: 80 }}>
            <img
              src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567184062_form.webp"
              alt=""
              onError={e => e.currentTarget.style.display = "none"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
