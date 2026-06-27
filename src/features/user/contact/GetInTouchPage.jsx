import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import UniversityTicker from "../../../components/UniversityTicker"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  accent: "#C8354B", accentDeep: "#9E2538", accentRose: "#E8B4BD",
}

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

/* ── Four things ── */
const FOUR_THINGS = [
  {
    icon: "◎",
    title: "Where your child stands right now",
    body: "A deep assessment of their profile and how they compare to successful applicants at their target schools.",
  },
  {
    icon: "◎",
    title: "What it would actually take to get in",
    body: "A look at their strengths, gaps, and the specific things that would move the needle on their application.",
  },
  {
    icon: "◎",
    title: "How AE works, and if it's the right fit",
    body: "We'll walk you through our approach and the kind of personalised roadmap we'd build for your child.",
  },
  {
    icon: "◎",
    title: "A plan (with options)",
    body: "You'll leave with 2–3 concrete paths forward, each matched to your child's goals, timeline, and your family's needs.",
  },
]

/* ── FAQ ── */
const FAQ = [
  {
    q: "My child is in Grade 9 or 10. Is it too early?",
    a: "No — Grade 9–11 is the right time to start. By Grade 12, the profile is mostly set. Early engagement means more options, not more pressure.",
  },
  {
    q: "What does working with AE cost?",
    a: "Programmes vary depending on your child's grade, timeline, and target schools. We'll walk you through the options on the call — there's no one-size-fits-all package.",
  },
  {
    q: "My child's grades aren't perfect. Can you still help?",
    a: "Yes. Grades matter, but selective universities look at the full picture. Many of our admitted students had uneven transcripts and strong everything else.",
  },
  {
    q: "Do you guarantee admission?",
    a: "No. Anyone who does is lying to you. What we do: build the strongest possible application, target the right schools, and give you an honest view of the odds throughout.",
  },
  {
    q: "What happens after the consultation?",
    a: "You'll receive a written summary of what we discussed and gain clarity on what you should do next, regardless of whether you continue with us.",
  },
]

/* ── Stats ── */
const STATS = [
  { value: "3170+", label: "students guided across 12 countries" },
  { value: "20%",   label: "Ivy acceptance rate, 5× the global average of 4%" },
  { value: "812",   label: "Offers from top-20 universities" },
  { value: "3:1",   label: "Each student admitted to at least 3 of their top choices" },
]

/* ── University logos ── */
const UNIS = ["CETON", "Columbia", "Oxford", "Cornell", "MIT", "Bocconi", "IE", "NUS", "HKUST", "Harvard"]

/* ── Testimonials ── */
const TESTIMONIALS = [
  { name: "Linda",  school: "Harvard'29",     photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/linda.jpg",  quote: "I could always count on them to respond within 24 hours. They made me feel so secure through the whole process." },
  { name: "Yosie",  school: "Yale'28",        photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/yosie.jpg",  quote: "I had a lot of interests but no common thread. AE hand-held me throughout — ensuring my application reflected who I really was." },
  { name: "Anna",   school: "UC Berkeley'29", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/anna.jpg",   quote: "They helped me transform my love for film and media into a powerful application narrative. The strategy and essay guidance were key to my acceptance." },
  { name: "Lyla",   school: "Columbia'28",    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/lyla.jpg",   quote: "AddedEducation was my rock. What stood out was their ability to connect the dots across all my projects — links I wouldn't have noticed myself." },
  { name: "Aryan",  school: "Cornell'29",     photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/aryan.jpg",  quote: "With everything going on, AddedEducation helped me figure out my activities and align my major, making sure I got into the right programs that fit my needs and dreams." },
  { name: "Ethan",  school: "Stanford'28",    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/ethan.jpg",  quote: "With my counselor's guidance, I took my engineering projects, environmental leadership, and artistic portfolio and turned them into one standout application." },
  { name: "Saina",  school: "MIT'27",         photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/saina.jpg",  quote: "Getting into top universities isn't just about grades. I'm glad I started planning early. AddedEducation really helped me make my profile shine." },
  { name: "Eren",   school: "Tufts'27",       photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/eren.jpg",   quote: "They gave me benchmarks for my grades, helped me plan my tournament schedule, and guided me through reaching out to coaches and the CommonApp. They helped me find the balance with everything." },
  { name: "Anjan",  school: "CMU'28",         photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/anjan.jpg",  quote: "AddedEducation connected me with coaches and helped me understand what they were looking for, and what in my profile could set me apart." },
  { name: "Sondre", school: "RISD'28",        photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/sondre.jpg", quote: "I've always had a passion for animation and art. With AddedEducation's guidance, I built a strong foundation and navigated the application process seamlessly." },
]

function isValidEmail(e) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const d = e.trim().split("@")[1] || ""
  return re.test(e.trim()) && !d.includes("..") && !d.startsWith(".") && !d.endsWith(".")
}

/* ─────────────────────────────
   ACCORDION
───────────────────────────────*/
function AccordionItem({ item, isOpen, onToggle }) {
  const ref = useRef(null)
  const [h, setH] = useState(0)
  useEffect(() => { if (ref.current) setH(ref.current.scrollHeight) }, [isOpen])
  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", transition: "background 0.2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ color: C.accent, fontSize: 16, fontWeight: 500, flexShrink: 0, lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, color: C.ink }}>{item.q}</span>
      </button>
      <div style={{ maxHeight: isOpen ? h + 20 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s" }}>
        <div ref={ref} style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.stone, lineHeight: 1.65, padding: "0 18px 14px 46px" }}>{item.a}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────
   CONTACT FORM
───────────────────────────────*/
function ContactForm() {
  const [form, setForm] = useState({ firstname: "", lastname: "", countryIso: "", phoneDialIso: "GB", phone: "", schoolname: "", email: "" })
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [phoneOpen, setPhoneOpen]   = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const phoneRef = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false) }
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
    if (!form.firstname.trim()) errs.firstname  = "Please enter your first name."
    if (!form.email.trim())     errs.email      = "Please enter your email address."
    else if (!isValidEmail(form.email)) errs.email = "Please enter a valid email."
    if (!form.countryIso)       errs.countryIso = "Please select your country."
    if (!form.phone.trim())     errs.phone      = "Please enter your phone number."
    if (!form.schoolname.trim()) errs.schoolname = "Please enter your school name."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const dial = COUNTRIES.find(c => c.iso === form.phoneDialIso)?.dial || ""
    const fullPhone = `${dial} ${form.phone.replace(/\D/g, "")}`

    setSubmitting(true)
    try {
      const res = await fetch(
        `https://api-na2.hsforms.com/submissions/v3/integration/submit/4257853/e5ca474a-39dd-4fe2-b47c-5da477425a3e`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname",         value: form.firstname.trim() },
              { name: "lastname",          value: form.lastname.trim() },
              { name: "email",             value: form.email.trim() },
              { name: "phone",             value: fullPhone },
              { name: "schoolname",        value: form.schoolname.trim() },
              { name: "countryofresidance", value: COUNTRIES.find(c => c.iso === form.countryIso)?.name || "" },
            ],
            context: {
              pageUri: typeof window !== "undefined" ? window.location.href : "",
              pageName: "AddedEducation — Get In Touch",
            },
          }),
        }
      )
      if (res.ok) {
        setSubmitted(true)
        if (typeof window !== "undefined") {
          if (window.fbq) window.fbq("trackCustom", "Finally_Leads", { landing_page: "contact" })
          if (window.gtag) window.gtag("event", "Finally_Leads", { landing_page: "contact" })
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
    border: `1px solid ${err ? C.accent : "rgba(255,255,255,0.13)"}`,
    borderRadius: 8, padding: "13px 16px",
    fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#fff",
    outline: "none", transition: "border-color 0.18s",
  })

  const lbl = {
    display: "block", fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
    textTransform: "uppercase", color: C.stoneLight, marginBottom: 8,
  }

  const ErrMsg = ({ k }) => errors[k]
    ? <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.accentRose, margin: "5px 0 0", display: "flex", alignItems: "center", gap: 4 }}><span>⚠</span>{errors[k]}</p>
    : null

  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A6A39E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
  const currentDial = COUNTRIES.find(c => c.iso === form.phoneDialIso)
  const filteredCountries = COUNTRIES.filter(c => {
    const q = countrySearch.trim().toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q)
  })

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <p style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: "#fff", margin: "0 0 12px" }}>Thanks for reaching out!</p>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.stoneLight, lineHeight: 1.55, margin: 0 }}>One of our counselors will be in touch shortly.</p>
    </div>
  )

  return (
    <>
      <style>{`
        .git-inp::placeholder { color: rgba(255,255,255,0.28) !important; }
        .git-sel option { background: #0E0E0E; color: #fff; }
        .git-search::placeholder { color: rgba(255,255,255,0.35) !important; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Row 1: First + Last */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={lbl}>First Name *</label>
            <input type="text" placeholder="Jane" value={form.firstname} onChange={e => set("firstname", e.target.value)} className="git-inp" style={inp(!!errors.firstname)} />
            <ErrMsg k="firstname" />
          </div>
          <div>
            <label style={lbl}>Last Name</label>
            <input type="text" placeholder="Smith" value={form.lastname} onChange={e => set("lastname", e.target.value)} className="git-inp" style={inp(false)} />
          </div>
        </div>

        {/* Row 2: Country */}
        <div>
          <label style={lbl}>Country *</label>
          <select aria-label="Country of residence" value={form.countryIso} onChange={e => set("countryIso", e.target.value)} className="git-sel"
            style={{ ...inp(!!errors.countryIso), appearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36, cursor: "pointer", color: form.countryIso ? "#fff" : "rgba(255,255,255,0.28)" }}>
            <option value="" disabled>Please Select</option>
            {COUNTRIES.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}
          </select>
          <ErrMsg k="countryIso" />
        </div>

        {/* Row 3: Phone */}
        <div>
          <label style={lbl}>Phone Number *</label>
          <div ref={phoneRef} style={{ position: "relative", display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setPhoneOpen(v => !v)}
              style={{ ...inp(false), width: 110, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "13px 12px", cursor: "pointer", fontSize: 14 }}>
              <span style={{ color: "#fff" }}>{currentDial?.iso} {currentDial?.dial}</span>
              <span style={{ fontSize: 9, opacity: 0.55, transform: phoneOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
            </button>
            <input type="tel" inputMode="numeric" placeholder="7700 900 000" value={form.phone}
              onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => { const ok = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"]; if (!/[0-9]/.test(e.key) && !ok.includes(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault() }}
              className="git-inp" style={{ ...inp(!!errors.phone), flex: 1 }} />
            {phoneOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: 300, background: C.ink, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, boxShadow: "0 16px 48px rgba(0,0,0,0.5)", zIndex: 50, overflow: "hidden" }}>
                <div style={{ padding: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <input autoFocus placeholder="Search country or code…" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} className="git-search"
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 13, fontFamily: "'Inter',sans-serif", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", outline: "none" }} />
                </div>
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {filteredCountries.map(c => {
                    const sel = c.iso === form.phoneDialIso
                    return (
                      <button key={c.iso} type="button" onClick={() => { setForm(f => ({ ...f, phoneDialIso: c.iso })); setPhoneOpen(false); setCountrySearch("") }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: sel ? "rgba(200,53,75,0.18)" : "transparent", color: "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13, textAlign: "left" }}
                        onMouseEnter={e => e.currentTarget.style.background = sel ? "rgba(200,53,75,0.18)" : "rgba(255,255,255,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = sel ? "rgba(200,53,75,0.18)" : "transparent"}>
                        <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, opacity: 0.7, width: 22 }}>{c.iso}</span>
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

        {/* Row 4: School */}
        <div>
          <label style={lbl}>School Name *</label>
          <input type="text" placeholder="DAIS" value={form.schoolname} onChange={e => set("schoolname", e.target.value)} className="git-inp" style={inp(!!errors.schoolname)} />
          <ErrMsg k="schoolname" />
        </div>

        {/* Row 5: Email */}
        <div>
          <label style={lbl}>Email *</label>
          <input type="email" placeholder="jane@gmail.com" value={form.email} onChange={e => set("email", e.target.value)} className="git-inp" style={inp(!!errors.email)} />
          <ErrMsg k="email" />
        </div>

        {submitError && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.accentRose, margin: 0, display: "flex", alignItems: "center", gap: 5 }}><span>⚠</span>{submitError}</p>}

        <div style={{ marginTop: 4 }}>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ background: submitting ? C.accentDeep : C.accent, color: "#fff", border: "none", borderRadius: 999, padding: "14px 36px", fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.18s", opacity: submitting ? 0.8 : 1 }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentDeep }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = C.accent }}>
            {submitting ? "Submitting…" : "Submit Now"}
          </button>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────
   TESTIMONIALS CAROUSEL — 4 visible
───────────────────────────────*/
const GAP    = 16
const VISIBLE = 4
const CARD_H  = 240

function TestimonialCard({ t }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div style={{ height: CARD_H, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>{t.name}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#6B6863", margin: 0 }}>{t.school}</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#2a2a2a", marginLeft: 10 }}>
          {imgOk
            ? <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setImgOk(false)} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "rgba(255,255,255,0.3)" }}>{t.name[0]}</span></div>
          }
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 12, flexShrink: 0 }} />
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.55, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>{t.quote}</p>
    </div>
  )
}

function TestimonialsCarousel() {
  const N = TESTIMONIALS.length
  const items = [...TESTIMONIALS.slice(N - VISIBLE), ...TESTIMONIALS, ...TESTIMONIALS.slice(0, VISIBLE)]
  const OFFSET = VISIBLE

  const wrapRef  = useRef(null)
  const trackRef = useRef(null)
  const idxRef   = useRef(OFFSET)
  const timerRef = useRef(null)
  const busyRef  = useRef(false)
  const [dot, setDot] = useState(0)
  const [cardW, setCardW] = useState(0)

  const cardWRef = useRef(0)

  const cw = () => cardWRef.current
  const jump = (idx) => { if (!trackRef.current) return; const w = cw(); trackRef.current.style.transition = "none"; trackRef.current.style.transform = `translateX(-${idx * (w + GAP)}px)`; idxRef.current = idx }
  const slide = (idx) => {
    if (!trackRef.current) return; const w = cw()
    trackRef.current.style.transition = "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)"
    trackRef.current.style.transform = `translateX(-${idx * (w + GAP)}px)`
    idxRef.current = idx
    setTimeout(() => { if (idx >= OFFSET + N) jump(idx - N); if (idx < OFFSET) jump(idx + N); busyRef.current = false }, 720)
  }
  const move = (dir) => { if (busyRef.current) return; busyRef.current = true; const next = idxRef.current + dir; setDot((next - OFFSET + N) % N); slide(next) }
  const resetTimer = () => { clearInterval(timerRef.current); timerRef.current = setInterval(() => move(1), 4000) }

  useEffect(() => {
    const update = () => { if (!wrapRef.current) return; cardWRef.current = (wrapRef.current.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE; setCardW(cardWRef.current); jump(OFFSET) }
    const ro = new ResizeObserver(update)
    if (wrapRef.current) ro.observe(wrapRef.current)
    requestAnimationFrame(() => { update(); resetTimer() })
    return () => { ro.disconnect(); clearInterval(timerRef.current) }
  }, [])

  const handlePrev = () => { move(-1); resetTimer() }
  const handleNext = () => { move(1);  resetTimer() }
  const handleDot  = (i) => { if (busyRef.current) return; busyRef.current = true; setDot(i); slide(OFFSET + i); resetTimer() }

  return (
    <section style={{ background: C.ink, width: "100%", padding: "80px 0 96px" }}>
      <div style={{ width: "100%", padding: "0 clamp(24px,6vw,80px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 18px" }}>Testimonials</span>
          <div style={{ textAlign: "right" }}>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(24px,2.8vw,42px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 20px" }}>
              Hear it from<br />students <em style={{ fontStyle: "italic", color: C.accent }}>who made it.</em>
            </h2>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {[{ label: "←", fn: handlePrev }, { label: "→", fn: handleNext }].map(({ label, fn }) => (
                <button key={label} onClick={fn} style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>
        <div ref={wrapRef} style={{ overflow: "hidden", height: CARD_H }}>
          <div ref={trackRef} style={{ display: "flex", gap: GAP, height: CARD_H, willChange: "transform" }}>
            {items.map((t, i) => (
              <div key={i} style={{ width: cardW || cw(), flexShrink: 0 }}><TestimonialCard t={t} /></div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => handleDot(i)} aria-label={`Go to slide ${i + 1}`} style={{ width: i === dot ? 24 : 8, height: 8, borderRadius: 999, border: "none", background: i === dot ? C.accent : "rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function GetInTouchPage() {
  const px = "clamp(24px,6vw,80px)"
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* ══ 1. HERO BANNER ══ */}
      <section style={{ position: "relative", width: "100%", height: 280, overflow: "hidden", background: C.inkSoft }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", zIndex: 0 }} />
        <img
          src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Contact+Us+Page/hero.png"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />
        <div style={{ position: "absolute", bottom: 36, left: 52, zIndex: 2 }}>
          <h1 className="fraunces-display" style={{ fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", margin: 0, textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}>
            Contact Us
          </h1>
        </div>
      </section>

      {/* ══ 2. FORM + IMAGE ══ */}
      <section style={{ background: C.cream, padding: `0` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", minHeight: "auto" }}>
          {/* Left: copy + form */}
          <div style={{ padding: `56px ${px} 56px clamp(24px,6vw,80px)`, display: "flex", flexDirection: "column" }}>
            {/* eyebrow */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ display: "inline-block", background: C.inkSoft, color: C.stoneLight, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 18px", borderRadius: 999 }}>
                Book a 30-minute consultation
              </span>
            </div>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1.05, letterSpacing: "-0.015em", color: C.ink, margin: "0 0 16px", maxWidth: 480 }}>
              Find out what's possible for your child in{" "}
              <em style={{ color: C.accent, fontStyle: "italic" }}>30 minutes.</em>
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.55, color: C.stone, margin: "0 0 28px", fontWeight: 350 }}>
              You'll walk away knowing exactly where your child stands, what it would actually take to get them in, and 2–3 concrete next steps — whether you work with us or not.
            </p>
            {/* dark form card */}
            <div style={{ background: C.ink, borderRadius: 18, padding: "32px 28px 28px" }}>
              <ContactForm />
            </div>
          </div>

          {/* Right: hero image */}
          <div style={{ padding: "24px", boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 20, overflow: "hidden", background: C.creamWarm, minHeight: 400, position: "relative" }}>
              <img
                src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Contact+Us+Page/form.png"
                alt=""
                onError={e => e.currentTarget.style.display = "none"}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. STATS ══ */}
      <section style={{ background: C.cream, padding: `48px ${px}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 400, color: C.accent, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.stone, margin: 0, lineHeight: 1.55 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 4. FOUR THINGS + FAQ — single dark section ══ */}
      <section style={{ background: C.ink, padding: `72px ${px} 80px` }}>

        {/* Four things heading */}
        <h2 className="fraunces-heading" style={{ textAlign: "center", fontSize: "clamp(24px,3vw,42px)", letterSpacing: "-0.02em", color: "#fff", margin: "0 0 56px", fontWeight: 700 }}>
          Four things you'll walk away<br />
          <em style={{ fontStyle: "italic", color: C.accent }}>knowing.</em>
        </h2>

        {/* Four items 2x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px 40px", maxWidth: 860, margin: "0 auto 80px" }}>
          {FOUR_THINGS.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              {/* SVG circle-check icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="10" cy="10" r="9" stroke={C.accent} strokeWidth="1.5" fill="none"/>
                <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", margin: "0 0 6px" }}>{item.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: 0, fontWeight: 350 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ — 2 col: left heading, right accordion */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>
          {/* Left */}
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.stoneLight, margin: "0 0 20px" }}>
              Common Questions
            </p>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(32px,4vw,56px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 20px" }}>
              Questions<br />parents ask<br />
              <em style={{ fontStyle: "italic", color: C.accent }}>before booking.</em>
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: "0 0 36px", fontWeight: 350 }}>
              If you don't see yours, the consultation is the right place.
            </p>
            <a href="#" style={{ display: "inline-block", background: C.accent, color: "#fff", borderRadius: 999, padding: "13px 30px", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "background 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentDeep}
              onMouseLeave={e => e.currentTarget.style.background = C.accent}>
              Book a free 30-minute call
            </a>
          </div>

          {/* Right: accordion — white boxes with red + */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FAQ.map((item, i) => (
              <AccordionItem key={i} item={item} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. UNIVERSITIES ══ */}
      <UniversityTicker />

      {/* ══ 7. TESTIMONIALS ══ */}
      <TestimonialsCarousel />

      <Footer />
    </div>
  )
}
