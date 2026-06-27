import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  maroon: "#6B1818", maroonSoft: "#7E2424",
  accent: "#C8354B", accentDeep: "#9E2538", accentRose: "#E8B4BD",
  border: "rgba(0,0,0,0.06)", borderLight: "rgba(255,255,255,0.08)",
}

/* ── What your child gains ── */
const GAINS = [
  {
    title: "Outcomes that matter for admissions",
    body: "Every AddedNova student leaves with a completed research report ready for journal submission, a signed mentor evaluation for their academic portfolio, and advanced skills in academic writing.",
  },
  {
    title: "Inside the program",
    body: "Your child is guided through every stage of the research process: methodology, academic writing, data analysis, and presentation.",
  },
  {
    title: "Dedicated expert support",
    body: "They'll have dedicated mentor support from topic selection through to a finished paper, plus access to curated academic tools, guest lectures, and a network of high-achieving peers from around the world.",
  },
]

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    name: "Bhavna",
    school: "Singapore | Economics, University of Chicago",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/bhavna.jpg",
    uni: "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/University_of_Chicago_shield.svg/200px-University_of_Chicago_shield.svg.png",
    quote: "How can EPR laws be used in Indonesia to fight plastic pollution? Bhavna was already a strong applicant. She joined AddedNova in Grade 10 to give her profile more academic weight. Her paper on Indonesia's extended producer responsibility laws gave her something specific and well-argued to bring to her applications.",
  },
  {
    name: "Aryan",
    school: "USA | Biomedical Engineering, Cornell",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/aryan.jpg",
    uni: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cornell_University_seal.svg/200px-Cornell_University_seal.svg.png",
    quote: "Environmental and Sustainable Applications of Fungi A high performer in Grade 9 with strong extracurriculars, Aryan wanted to do something with his long-standing interest in bioengineering. His AddedNova paper was selected for presentation at the Fungi Future Project Award.",
  },
  {
    name: "Maddie",
    school: "Hong Kong | Biology, Northwestern",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/maddie.jpg",
    uni: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Northwestern_University_seal.svg/200px-Northwestern_University_seal.svg.png",
    quote: "Nitrogen concentrations in Tolo Harbour and effects on marine life Maddie had been thinking about this question for years. AddedNova gave her the structure and mentorship to pursue it properly. Her paper was published in a peer-reviewed journal.",
  },
]

/* ── Countries list ── */
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
  { iso: "CO", name: "Colombia", dial: "+57" },
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

/* ═══════════════════════════════
   TESTIMONIALS — static 3-column grid
═══════════════════════════════ */
function TestimonialCard({ t }) {
  const [uniOk, setUniOk] = useState(true)
  return (
    <div style={{
      background: "#1A1A1A",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
      padding: "28px 28px 32px", display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{t.name}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#6B6863", margin: 0 }}>{t.school}</p>
        </div>
        <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.04)", marginLeft: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {uniOk && t.uni
            ? <img src={t.uni} alt="uni" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} onError={() => setUniOk(false)} />
            : <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "rgba(255,255,255,0.3)" }}>{t.name[0]}</span>
          }
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />
      <p style={{
        fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600,
        color: "#fff", lineHeight: 1.65, margin: 0,
      }}>{t.quote}</p>
    </div>
  )
}

function TestimonialsSection() {
  return (
    <section style={{ background: C.ink, width: "100%", padding: "80px 0 96px" }}>
      <div style={{ width: "100%", padding: "0 clamp(24px,6vw,80px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 18px",
          }}>Testimonials</span>
          <div style={{ textAlign: "right" }}>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
              Hear it from<br />students <em style={{ fontStyle: "italic", color: C.accent }}>who made it.</em>
            </h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════
   ENQUIRY FORM
═══════════════════════════════ */
function EnquiryForm() {
  const [form, setForm] = useState({
    firstname: "", lastname: "", countryIso: "GB",
    phoneDialIso: "GB", phone: "", schoolname: "",
    email: "", researchTopic: "",
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const phoneRef = useRef(null)

  useEffect(() => {
    const fn = (e) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target))
        setPhoneOpen(false)
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
    if (!form.firstname.trim()) errs.firstname = "Please enter your first name."
    if (!form.email.trim()) errs.email = "Please enter your email address."
    else if (!isValidEmail(form.email)) errs.email = "Please enter a valid email."
    if (!form.countryIso) errs.countryIso = "Please select your country."
    if (!form.phone.trim()) errs.phone = "Please enter your phone number."
    if (!form.schoolname.trim()) errs.schoolname = "Please enter your school name."
    if (!form.researchTopic.trim()) errs.researchTopic = "Please describe your research interest."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const dial = COUNTRIES.find(c => c.iso === form.phoneDialIso)?.dial || ""
    const fullPhone = `${dial} ${form.phone.replace(/\D/g, "")}`

    setSubmitting(true)
    try {
      const res = await fetch(
        `https://api-na2.hsforms.com/submissions/v3/integration/submit/4257853/8b149d5f-32b3-4870-bd41-78110a6a86fc`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname", value: form.firstname.trim() },
              { name: "lastname", value: form.lastname.trim() },
              { name: "email", value: form.email.trim() },
              { name: "phone", value: fullPhone },
              { name: "schoolname", value: form.schoolname.trim() },
              { name: "countryofresidance", value: COUNTRIES.find(c => c.iso === form.countryIso)?.name || "" },
              { name: "what_is_your_teen_interested_in_researching", value: form.researchTopic.trim() },
            ],
            context: {
              pageUri: typeof window !== "undefined" ? window.location.href : "",
              pageName: "AddedEducation — Research Enquiry",
            },
          }),
        }
      )
      if (res.ok) {
        setSubmitted(true)
        if (typeof window !== "undefined") {
          if (window.fbq) window.fbq("trackCustom", "Finally_Leads", { landing_page: "research_enquiry" })
          if (window.gtag) window.gtag("event", "Finally_Leads", { landing_page: "research_enquiry" })
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

  /* shared styles */
  const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.08)",
    border: `1px solid ${err ? C.accent : "rgba(255,255,255,0.13)"}`,
    borderRadius: 8, padding: "13px 16px",
    fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 400,
    color: "#fff", outline: "none", transition: "border-color 0.18s",
  })

  const lbl = {
    display: "block", fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, fontWeight: 500, letterSpacing: "0.16em",
    textTransform: "uppercase", color: C.stoneLight, marginBottom: 8,
  }

  const ErrMsg = ({ k }) => errors[k] ? (
    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.accentRose, margin: "5px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
      <span>⚠</span>{errors[k]}
    </p>
  ) : null

  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A6A39E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
  const currentDial = COUNTRIES.find(c => c.iso === form.phoneDialIso)
  const filteredCountries = COUNTRIES.filter(c => {
    const q = countrySearch.trim().toLowerCase()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q)
  })

  if (submitted) {
    return (
      <div style={{ padding: "48px 0" }}>
        <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 28, color: "#fff", margin: "0 0 12px" }}>
          Thanks for your enquiry!
        </p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 15, color: C.stoneLight, lineHeight: 1.55, margin: 0 }}>
          Our team will be in touch shortly about the research programme.
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .re-inp::placeholder { color: rgba(255,255,255,0.28) !important; }
        .re-sel option { background: #1A1A1A; color: #fff; }
        .re-search::placeholder { color: rgba(255,255,255,0.35) !important; }
        .re-textarea::placeholder { color: rgba(255,255,255,0.25) !important; }
        .re-textarea { resize: vertical; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Row 1: First + Last Name */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={lbl}>First Name *</label>
            <input type="text" placeholder="Jane" value={form.firstname}
              onChange={e => set("firstname", e.target.value)}
              className="re-inp" style={inp(!!errors.firstname)} />
            <ErrMsg k="firstname" />
          </div>
          <div>
            <label style={lbl}>Last Name</label>
            <input type="text" placeholder="Smith" value={form.lastname}
              onChange={e => set("lastname", e.target.value)}
              className="re-inp" style={inp(false)} />
          </div>
        </div>

        {/* Row 2: Country + Phone */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={lbl}>Country *</label>
            <select aria-label="Country of residence" value={form.countryIso} onChange={e => set("countryIso", e.target.value)}
              className="re-sel"
              style={{ ...inp(!!errors.countryIso), appearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" }}>
              {COUNTRIES.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}
            </select>
            <ErrMsg k="countryIso" />
          </div>
          <div>
            <label style={lbl}>Phone Number</label>
            <div ref={phoneRef} style={{ position: "relative", display: "flex", gap: 6 }}>
              <button type="button" onClick={() => setPhoneOpen(v => !v)}
                style={{ ...inp(false), width: 96, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, padding: "13px 10px", cursor: "pointer", fontSize: 13 }}>
                <span style={{ color: "#fff" }}>{currentDial?.iso} {currentDial?.dial}</span>
                <span style={{ fontSize: 8, opacity: 0.5, transform: phoneOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
              </button>
              <input type="tel" inputMode="numeric" placeholder="7700 900 000" value={form.phone}
                onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => {
                  const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"]
                  if (!/[0-9]/.test(e.key) && !allowed.includes(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault()
                }}
                className="re-inp" style={{ ...inp(!!errors.phone), flex: 1, minWidth: 0 }} />
              {phoneOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: 280, background: C.inkSoft, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, boxShadow: "0 16px 48px rgba(0,0,0,0.4)", zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <input autoFocus placeholder="Search country or code…" value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)} className="re-search"
                      style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 13, fontFamily: "'Inter',sans-serif", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", outline: "none" }} />
                  </div>
                  <div style={{ maxHeight: 220, overflowY: "auto" }}>
                    {filteredCountries.map(c => {
                      const sel = c.iso === form.phoneDialIso
                      return (
                        <button key={c.iso} type="button"
                          onClick={() => { setForm(f => ({ ...f, phoneDialIso: c.iso })); setPhoneOpen(false); setCountrySearch("") }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: sel ? "rgba(200,53,75,0.18)" : "transparent", color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13, textAlign: "left" }}
                          onMouseEnter={e => e.currentTarget.style.background = sel ? "rgba(200,53,75,0.18)" : "rgba(255,255,255,0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = sel ? "rgba(200,53,75,0.18)" : "transparent"}>
                          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, opacity: 0.6, width: 22 }}>{c.iso}</span>
                            {c.name}
                          </span>
                          <span style={{ color: C.stoneLight, fontSize: 12 }}>{c.dial}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <ErrMsg k="phone" />
          </div>
        </div>

        {/* Row 3: School Name */}
        <div>
          <label style={lbl}>School Name *</label>
          <input type="text" placeholder="HKIS" value={form.schoolname}
            onChange={e => set("schoolname", e.target.value)}
            className="re-inp" style={inp(!!errors.schoolname)} />
          <ErrMsg k="schoolname" />
        </div>

        {/* Row 4: Email */}
        <div>
          <label style={lbl}>Email *</label>
          <input type="email" placeholder="jane@gmail.com" value={form.email}
            onChange={e => set("email", e.target.value)}
            className="re-inp" style={inp(!!errors.email)} />
          <ErrMsg k="email" />
        </div>

        {/* Row 5: Research Topic */}
        <div>
          <label style={lbl}>What do you want to do a research project about? *</label>
          <textarea placeholder="" value={form.researchTopic}
            onChange={e => set("researchTopic", e.target.value)}
            rows={4} className="re-inp re-textarea"
            style={{ ...inp(!!errors.researchTopic), resize: "vertical", minHeight: 100, fontFamily: "'Inter', sans-serif" }} />
          <ErrMsg k="researchTopic" />
        </div>

        {submitError && (
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.accentRose, margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
            <span>⚠</span>{submitError}
          </p>
        )}

        <div>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ background: submitting ? C.accentDeep : C.accent, color: "#fff", border: "none", borderRadius: 999, padding: "15px 40px", fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.18s", opacity: submitting ? 0.8 : 1 }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentDeep }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = C.accent }}>
            {submitting ? "Submitting…" : "Submit Now"}
          </button>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
export default function ResearchPage() {
  const px = "clamp(24px,6vw,80px)"

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section style={{ position: "relative", width: "100%", minHeight: "72vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* overlay — zIndex: 1 (di atas image) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(14,14,14,0.55) 0%, rgba(14,14,14,0.72) 100%)" }} />
        {/* fallback bg — zIndex: 0 */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(135deg, #1a1a1a 0%, #2d1a1e 100%)" }} />
        {/* image — zIndex: 0 (sama dengan fallback, render belakangan jadi di atas) */}
        <img
          src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Research+Page/Research+Hero.jpg"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        {/* fallback gradient if image fails */}
        <div style={{ position: "absolute", inset: 0, zIndex: -2, background: "linear-gradient(135deg, #1a1a1a 0%, #2d1a1e 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: `clamp(120px,16vw,200px) ${px} clamp(56px,7vw,96px)`, width: "100%" }}>
          {/* eyebrow */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["AddedNova", "Research", "Program"].map(t => (
              <span key={t} style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999,
                padding: "5px 14px",
              }}>{t}</span>
            ))}
          </div>

          <h1 className="fraunces-display" style={{
            fontSize: "clamp(28px,3.8vw,56px)", lineHeight: 1.06,
            letterSpacing: "-0.025em", color: "#fff", maxWidth: 640,
            margin: "0 0 20px",
          }}>
            The research credential{" "}
            <em style={{ color: C.accent }}>top universities actually notice.</em>
          </h1>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.4vw,18px)", color: "rgba(255,255,255,0.72)", margin: "0 0 36px", fontWeight: 350 }}>
            A mentor from your child's field&nbsp;|&nbsp;A published paper
          </p>

          <a href="#enquiry" style={{
            display: "inline-block",
            background: C.cream, color: C.ink,
            borderRadius: 999, padding: "14px 36px",
            fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 500,
            textDecoration: "none", transition: "background 0.18s, color 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff" }}
            onMouseLeave={e => { e.currentTarget.style.background = C.cream }}
          >Apply Now</a>
        </div>
      </section>

      {/* ══ 2. INTRO — research mentorship pitch ══ */}
      <section style={{ background: C.ink, padding: `72px ${px}` }}>
        <p style={{
          fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,2.4vw,32px)",
          fontWeight: 400, color: "#fff", textAlign: "center",
          maxWidth: 800, margin: "0 auto 64px", lineHeight: 1.25, letterSpacing: "-0.01em",
        }}>
          Research mentorship for students looking to stand out.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 56, alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          {/* Left: image */}
          <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1a" }}>
            <img
              src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Research+Page/Stand+Out.jpg"
              alt="Library"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.parentElement.style.background = "linear-gradient(135deg,#1a1a1a,#2d1a1e)" }}
            />
          </div>

          {/* Right: copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              "Top universities don't just want good grades. They want students who've done something with their curiosity: research, independent projects, published work.",
              "AddedNova is a university-level mentorship for exceptional high school students, led by top academics, industry professionals, and published researchers.",
              "Every participant writes original, publication-grade work in disciplines ranging STEM, Non-STEM and Interdisciplinary.",
            ].map((text, i) => (
              <p key={i} style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.72)", fontWeight: 350, margin: 0 }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. WHAT YOUR CHILD GAINS ══ */}
      <section style={{ background: C.cream, padding: `80px ${px}` }}>
        <h2 className="fraunces-heading" style={{
          fontSize: "clamp(28px,3.5vw,52px)", textAlign: "center",
          letterSpacing: "-0.02em", color: C.ink, margin: "0 0 64px",
        }}>
          What your child gains
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
          {/* Left image block */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "3/4", background: C.creamWarm }}>
              <img
                src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Research+Page/aqQAEBeYi3Kvp6OTolc2dhkyME.jpg"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => e.currentTarget.parentElement.style.background = C.creamWarm}
              />
            </div>
          </div>

          {/* Right: gain items + right image */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {GAINS.map((g, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 16, color: C.ink, margin: "0 0 8px" }}>{g.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350 }}>{g.body}</p>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "3/4", width: 180, background: C.creamWarm, flexShrink: 0 }}>
              <img
                src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Research+Page/xia0TiExGYvXDNfk530P81TImiE.jpg"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => e.currentTarget.parentElement.style.background = C.creamWarm}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. TESTIMONIALS (dark) ══ */}
      <TestimonialsSection />

      {/* ══ 5. LEAD MENTOR ══ */}
      <section style={{ background: C.cream, padding: `80px ${px}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 56, maxWidth: 1000, margin: "0 auto", alignItems: "center" }}>
          {/* mentor photo */}
          <div style={{ width: 260, height: 320, borderRadius: 14, overflow: "hidden", background: C.creamWarm, flexShrink: 0 }}>
            <img
              src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Research+Page/Mentor.png"
              alt="Dr. Mritunjay Sharma"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => {
                e.currentTarget.style.display = "none"
                e.currentTarget.parentElement.style.display = "flex"
                e.currentTarget.parentElement.style.alignItems = "center"
                e.currentTarget.parentElement.style.justifyContent = "center"
                e.currentTarget.parentElement.innerHTML = `<span style="font-family:'Fraunces',serif;font-size:64px;color:rgba(0,0,0,0.15)">MS</span>`
              }}
            />
          </div>

          {/* copy */}
          <div>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(26px,3vw,44px)", letterSpacing: "-0.02em", color: C.ink, margin: "0 0 20px" }}>
              Meet your Lead Mentor.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.7, color: C.stone, margin: 0, fontWeight: 350 }}>
              Dr. Mritunjay Sharma holds a PhD in Materials Chemistry from the University of Manchester and has mentored 100+ students across fields ranging from Political Science to Machine Learning to Economics. His students have published in top journals, won global competitions, and gained admission to Yale, Columbia, UPenn, and more. A fellow of LIMP, EduDoC, and NIUS, he has coached students for platforms including IRIS, St. Yau, and the CREST Award. The top 10 papers from each cohort receive a one-on-one consultation with Dr. Sharma directly.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 6. ENQUIRY FORM ══ */}
      <section id="enquiry" style={{ background: C.ink, width: "100%" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          alignItems: "start", minHeight: 560,
        }}>
          {/* Left — headline */}
          <div style={{ padding: `64px ${px} 64px clamp(24px,6vw,80px)`, background: C.cream, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(28px,3vw,42px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 20px" }}>
              Ready to start?
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.55, color: C.stone, margin: 0 }}>
              AddedNova runs in limited cohorts. If your child has ideas they want to do something with, this is how.
            </p>
          </div>

          {/* Right — form */}
          <div style={{ padding: "64px clamp(24px,6vw,80px) 64px 24px", boxSizing: "border-box" }}>
            <EnquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
