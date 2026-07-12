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

const CHALLENGES = [
  { title: "No clear starting point", body: "Students don't know how or where to begin." },
  { title: "A portfolio without direction", body: "Work is often disconnected and lacks cohesion." },
  { title: "Skills behind the ideas", body: "Students can't yet translate strong ideas into strong visual work." },
  { title: "Low creative confidence", body: "Students doubt their ability and struggle to execute." },
  { title: "No structured feedback", body: "There is no consistent critique or iteration to learn from." },
  { title: "Overwhelming expectations", body: "College portfolio requirements feel unclear and intimidating." },
]

const WHO_THIS_IS_FOR = [
  "Students exploring creative pathways in art, design, architecture, media and other creative fields.",
  "High-achieving students seeking differentiation in competitive admissions through a distinctive creative profile.",
  "Students who want to deepen their skills, receive expert mentorship, or leverage their creative practice as part of a broader application — whether or not they are pursuing a creative discipline professionally.",
]

const PROGRAMMES = [
  {
    num: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567148936_offering1.webp", name: "Arts & Portfolio Consultancy",
    who: "Students wanting comprehensive support from concept to submission.",
    get: "An application-ready portfolio with intention, depth, and strategic direction.",
    tagline: "End-to-end, personalised guidance for students pursuing art school applications or supplemental portfolios.",
  },
  {
    num: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567150051_offering4.webp", name: "The Arts Salon",
    who: "Students who want to understand, question, and shape the ideas behind the work.",
    get: "An insightful discussion based exploration across a myriad of nuanced topics from a creative lens. Sharper critical thinking, reasoning, and wider base of knowledge.",
    tagline: "A curated discussion-based cohort exploring the arts through critical inquiry and creative practice.",
  },
  {
    num: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567148099_offering3.webp", name: "The Upskilling Workshop",
    who: "Students wanting clear direction to strengthen a specific creative skill.",
    get: "Measurable skill progression, portfolio-ready outputs, personalised roadmap.",
    tagline: "Assessment, personalised planning, and guided execution to build a competitive portfolio in a compressed timeline.",
  },
  {
    num: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567148378_offering2.webp", name: "The Portfolio Bootcamp",
    who: "Students needing a strong, submission-ready portfolio with a quick turnaround.",
    get: "A cohesive, polished portfolio demonstrating growth and creative maturity.",
    tagline: "High-impact, guided programme for students starting late or lacking confidence who still need a competitive portfolio.",
  },
]

const RESULTS = [
  { school: "RISD", field: "Fine Arts", outcome: "Admitted Early Decision. GPA below published benchmark. Won on portfolio + personal essay strength alone." },
  { school: "SCAD", field: "Animation", outcome: "11 offers from leading animation programmes — SVA, SAIC, Ringling, SCAD across US, UK & Canada." },
  { school: "SCAD", field: "Product Design", outcome: "Offers from Pratt, Parsons, Chelsea College of Arts and SCAD." },
  { school: "UC Berkeley", field: "Film Studies", outcome: "Offers across film, media and journalism including Berkeley, Northeastern, Pepperdine. Award-winning portfolio." },
  { school: "Fordham", field: "Design & Technology", outcome: "Admitted to first-choice competitive design programme despite non-traditional academic record." },
]

const MENTORS = [
  {
    name: "Gayatri Degan", role: "Arts Specialist, AddedArt", initials: "GD",
    tags: ["Sarah Lawrence College", "UX & Graphic Design", "Illustration", "Animation", "London · Goa"],
    bio: "Gayatri is a multidisciplinary artist and designer with a BA from Sarah Lawrence College in art history and animation, and a consultancy track record spanning non-profits, corporates, and luxury brands. Her work ranges from UX and graphic design to branding, digital illustration, and animation, and she has held creative leadership roles in London and Goa. At AddedEducation, she works as an Art Specialist, helping young artists and designers build compelling portfolios and access top creative programmes worldwide.",
    photo: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567148531_Gayatri.webp",
  },
  {
    name: "Linda Ye", role: "Performing Arts & Music Specialist", initials: "LY",
    tags: ["Harvard College", "Berklee College of Music", "SF Girls Chorus", "6 Languages", "12+ Years Music"],
    bio: "Linda Ye is a dual-degree student at Harvard College and Berklee College of Music — one of only four students selected for this programme in her year. A former member of the five-time GRAMMY Award-winning San Francisco Girls Chorus for 12 years, she has performed at San Francisco's Davies Symphony Hall, shared the stage with Bobby McFerrin, and sung at Senator Dianne Feinstein's Memorial Service. With over 12 years of music experience and fluency in six languages, she brings exceptional expertise to guiding students pursuing music at the university level.",
    photo: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567148158_Linda.webp",
  },
]

const SCHOOL_LOGOS = ["RISD_logo", "SCAD_logo", "Parsons_logo", "Pratt_logo", "SAIC_logo", "UAL_logo"]

const COUNTRIES = [
  { iso: "AF", name: "Afghanistan", dial: "+93" }, { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "BH", name: "Bahrain", dial: "+973" }, { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "BE", name: "Belgium", dial: "+32" }, { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "CA", name: "Canada", dial: "+1" }, { iso: "CN", name: "China", dial: "+86" },
  { iso: "EG", name: "Egypt", dial: "+20" }, { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" }, { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "GR", name: "Greece", dial: "+30" }, { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "IN", name: "India", dial: "+91" }, { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" }, { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" }, { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "JO", name: "Jordan", dial: "+962" }, { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KW", name: "Kuwait", dial: "+965" }, { iso: "LB", name: "Lebanon", dial: "+961" },
  { iso: "MY", name: "Malaysia", dial: "+60" }, { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "MA", name: "Morocco", dial: "+212" }, { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NZ", name: "New Zealand", dial: "+64" }, { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "OM", name: "Oman", dial: "+968" }, { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PH", name: "Philippines", dial: "+63" }, { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" }, { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" }, { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" }, { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "TW", name: "Taiwan", dial: "+886" }, { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TR", name: "Turkey", dial: "+90" }, { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" }, { iso: "US", name: "United States", dial: "+1" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
]

/* ── Reveal ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.unobserve(el) }
    }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  )
}

function Label({ children, light = false }) {
  return (
    <div style={{
      display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600,
      color: light ? C.accentRose : C.ink, textTransform: "uppercase", letterSpacing: 2.5,
      background: light ? "rgba(255,255,255,0.08)" : C.creamWarm,
      border: `1px solid ${light ? "rgba(255,255,255,0.12)" : C.border}`,
      borderRadius: 6, padding: "6px 14px", marginBottom: 20,
    }}>{children}</div>
  )
}

/* ── Mentor Card ── */
function MentorCard({ m, isDark, photoLeft }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div style={{
      border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden",
      background: isDark ? C.inkSoft : C.cream,
      display: "flex", flexDirection: "row", alignItems: "stretch", minHeight: 360,
    }}>
      {/* Photo */}
      <div style={{
        flexShrink: 0, width: 260, position: "relative", overflow: "hidden",
        background: isDark
          ? `linear-gradient(150deg, ${C.maroon} 0%, ${C.ink} 100%)`
          : `linear-gradient(150deg, ${C.creamWarm} 0%, ${C.stoneLight}44 100%)`,
      }}>
        {imgOk
          ? <img src={m.photo} alt={m.name} onError={() => setImgOk(false)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%", position: "absolute", inset: 0 }}  loading="lazy" decoding="async"/>
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 80, color: isDark ? "rgba(255,255,255,0.12)" : `${C.stoneLight}55`, fontWeight: 500 }}>{m.initials}</span>
          </div>
        }
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 80, background: `linear-gradient(to right, transparent, ${isDark ? C.inkSoft : C.cream})` }} />
      </div>
      {/* Text */}
      <div style={{ flex: 1, padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {m.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 12px", borderRadius: 100,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : C.border}`,
              color: isDark ? "rgba(255,255,255,0.7)" : C.stone,
              background: isDark ? "rgba(255,255,255,0.05)" : C.creamWarm,
            }}>{tag}</span>
          ))}
        </div>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: "clamp(22px,2.5vw,28px)", color: isDark ? "#fff" : C.ink, marginBottom: 6, letterSpacing: "-0.01em" }}>{m.name}</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.accent, marginBottom: 18 }}>{m.role}</p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: isDark ? "rgba(255,255,255,0.6)" : C.stone, lineHeight: 1.75 }}>{m.bio}</p>
      </div>
    </div>
  )
}

/* ══ MAIN ══ */
export default function AddedArtsPage() {
  const [form, setForm] = useState({ firstname: "", lastname: "", country: "", countryIso: "US", phone: "", schoolname: "", email: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const phoneRef = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const selectedCountry = COUNTRIES.find(c => c.iso === form.countryIso) || COUNTRIES[0]
  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.dial.includes(countrySearch)
  )

  const scrollToBook = (e) => {
    e.preventDefault()
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function validate() {
    const e = {}
    if (!form.firstname.trim()) e.firstname = "First name is required."
    if (!form.lastname.trim()) e.lastname = "Last name is required."
    if (!form.country) e.country = "Please select a country."
    if (!form.phone.trim()) e.phone = "Phone number is required."
    if (!form.schoolname.trim()) e.schoolname = "School name is required."
    if (!form.email.trim()) e.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setSubmitError("")
    if (!validate()) return
    const fullPhone = `${selectedCountry.dial} ${form.phone.replace(/\D/g, "")}`
    setSubmitting(true)
    try {
      const res = await fetch("https://api-na2.hsforms.com/submissions/v3/integration/submit/4257853/3c7f3437-f436-49f5-b5eb-401cea5eb549", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: form.firstname.trim() },
            { name: "lastname", value: form.lastname.trim() },
            { name: "countryofresidence", value: form.country },
            { name: "phone", value: fullPhone },
            { name: "school", value: form.schoolname.trim() },
            { name: "email", value: form.email.trim() },
          ],
          context: { pageUri: window.location.href, pageName: "AddedArt Landing Page" },
        }),
      })
      if (res.ok) setSubmitted(true)
      else { const d = await res.json().catch(() => null); setSubmitError(d?.message || "Something went wrong. Please try again.") }
    } catch { setSubmitError("Network error. Please check your connection.") }
    finally { setSubmitting(false) }
  }

  return (
    <div style={{ background: C.cream, overflowX: "hidden" }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
.aaw{width:100%;padding:0 clamp(24px,7vw,120px);}
.aa-challenges{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);}
@media(max-width:900px){.aa-challenges{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.aa-challenges{grid-template-columns:1fr;}}
.aa-programmes{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
@media(max-width:980px){.aa-programmes{grid-template-columns:repeat(2,1fr);gap:20px;}}
@media(max-width:560px){.aa-programmes{grid-template-columns:1fr;}}
.aa-who-layout{display:grid;grid-template-columns:260px 1fr;gap:56px;align-items:start;}
@media(max-width:768px){.aa-who-layout{grid-template-columns:1fr;gap:24px;}}
.aa-mentor-card{display:flex;flex-direction:row;}
@media(max-width:768px){.aa-mentor-card{flex-direction:column!important;} .aa-mentor-photo{width:100%!important;height:240px!important;}}
.aa-btn{transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;}
.aa-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(200,53,75,0.28);}
.aa-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
@media(max-width:640px){.aa-form-grid{grid-template-columns:1fr;}}
.aa-form-input{width:100%;padding:13px 16px;border-radius:8px;font-size:15px;font-family:'DM Sans',sans-serif;outline:none;box-sizing:border-box;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#fff;transition:border-color 0.2s;}
.aa-form-input::placeholder{color:rgba(255,255,255,0.3);}
.aa-form-input:focus{border-color:rgba(200,53,75,0.6);}
.aa-form-input-err{border-color:#C8354B!important;}
select.aa-form-input option{background:#1A1A1A;color:#fff;}
.aa-form-err{font-size:12px;color:#E8B4BD;font-family:'DM Sans',sans-serif;margin-top:4px;}
.aa-card{transition:transform 0.25s,box-shadow 0.25s;}
.aa-card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(14,14,14,0.08);}
.aa-result-row{display:grid;grid-template-columns:280px 1fr;gap:32px;align-items:center;}
@media(max-width:700px){.aa-result-row{grid-template-columns:1fr;gap:10px;}}

/* Hero-specific responsive tweaks */
.aa-hero{padding:180px 0 120px;}
@media(max-width:900px){.aa-hero{padding:140px 0 90px;}}
@media(max-width:560px){.aa-hero{padding:120px 0 70px;}}
.aa-hero-fig{display:flex;}
@media(max-width:640px){.aa-hero-fig{display:none;}}
      `}</style>

      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section className="aa-hero" style={{ background: C.ink, position: "relative", overflow: "hidden" }}>
        {/* Background image */}
        <img
          src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1783815334657_oiHtA6P9M6jw4gClIPCJoqv5c__1_.webp"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", zIndex: 0, opacity: 1 }}
          fetchpriority="high" loading="eager" decoding="async"
        />

        {/* Left→right readability gradient — only the left ~55% (where text sits) darkens; right side stays clear so the image reads */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `linear-gradient(90deg, ${C.ink} 0%, ${C.ink}E6 18%, ${C.ink}B3 32%, ${C.ink}55 46%, ${C.ink}1A 58%, transparent 68%)`,
        }} />
        {/* Faint edge vignette on the far right so it doesn't cut off abruptly */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `linear-gradient(90deg, transparent 88%, ${C.ink}55 100%)`,
        }} />
        {/* Top/bottom vignette for depth — kept light so image stays visible */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `linear-gradient(180deg, ${C.ink}B3 0%, transparent 20%, transparent 76%, ${C.ink}CC 100%)`,
        }} />

        {/* Decorative radial glow */}
        <div style={{ position: "absolute", top: -140, right: -140, width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.maroon}22 0%, transparent 65%)`, pointerEvents: "none", zIndex: 1 }} />

        {/* Editorial "Fig." caption, bottom right — matches Challenges section convention */}
        <div className="aa-hero-fig" style={{
          position: "absolute", bottom: 40, right: "clamp(24px,7vw,120px)", zIndex: 2,
          alignItems: "center", gap: 10,
        }}>
          <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.3)" }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Fig. 01 — Portrait Study
          </span>
        </div>

        <div className="aaw" style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 28, height: 2, background: C.accent, borderRadius: 2 }} />
              <Label light>AddedArt · The Creative Arts Division of AddedEducation</Label>
            </div>
          </Reveal>
          <Reveal delay={50}>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(38px,6vw,68px)", fontWeight: 400, color: "#fff", lineHeight: 1.06, maxWidth: 760, letterSpacing: "-0.015em" }}>
              Cultivating the next generation of creative thinkers and makers.
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, maxWidth: 580, marginTop: 28, marginBottom: 40, borderLeft: `2px solid ${C.accent}55`, paddingLeft: 20 }}>
              AddedArt helps students discover their unique artistic voice, produce exceptional work, and build portfolios that open doors to world-class opportunities.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 44 }}>
              {["🎨 Art · Design · Architecture · Media", "🎓 Portfolio & supplemental portfolio", "🌐 Online, global cohorts", "✦ Four distinct programmes"].map(t => (
                <span key={t} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.borderLight}`, borderRadius: 100, padding: "7px 14px" }}>{t}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <a href="#book" onClick={scrollToBook} className="aa-btn" style={{ display: "inline-block", background: C.accent, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "16px 32px", borderRadius: 100 }}>
              Book a complimentary portfolio consultation →
            </a>
            <p style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 13, color: C.stoneLight, marginTop: 14 }}>Just a conversation. No pressure, no commitment.</p>
          </Reveal>
          {/* School logos */}
          <Reveal delay={250}>
            <div style={{ marginTop: 80 }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
                Trusted admissions outcomes at
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 32, paddingTop: 18, borderTop: `1px solid ${C.borderLight}`, alignItems: "center" }}>
                {SCHOOL_LOGOS.map(name => (
                  <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.55 }}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=f0ede8`}
                      alt={name}
                      style={{ height: 28, objectFit: "contain", display: "block" }}
                      onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block" }}
                      loading="lazy" decoding="async"
                    />
                    <span style={{ display: "none", fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 17, color: "rgba(255,255,255,0.4)" }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 2. CHALLENGES ══ */}
      <section style={{ background: C.ink, padding: "88px 0" }}>
        <div className="aaw">
          <Reveal>
            <Label light>We Understand the Journey</Label>
          </Reveal>
          <Reveal delay={50}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: "clamp(26px,3.4vw,40px)", color: "#fff", lineHeight: 1.25, maxWidth: 700, marginBottom: 16 }}>
              Creative potential is common. Knowing what to do with it is not.
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 640, marginBottom: 56 }}>
              Most students who come to us are talented. What they lack is a path. We see the same challenges again and again, and every part of what we do is built to answer them.
            </p>
          </Reveal>
          {/* 3 journey images — ABOVE challenges */}
          <Reveal delay={80}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 48 }}>
              {[
                { img: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567151223_thejourney1.webp", fig: "Fig. 02", label: "Studio Practice" },
                { img: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567151607_thejourney2.webp", fig: "Fig. 03", label: "Critique Review" },
                { img: "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567149616_thejourney3.webp", fig: "Fig. 04", label: "Portfolio Piece" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ borderRadius: 4, overflow: "hidden", aspectRatio: "3/4", background: "#1a1a1a", position: "relative", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={`${item.img}`} alt="" onError={e => e.currentTarget.style.display = "none"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}  loading="lazy" decoding="async"/>
                  </div>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 10, textAlign: "center" }}>{item.fig} — {item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="aa-challenges">
            {CHALLENGES.map((ch, i) => (
              <Reveal key={ch.title} delay={i * 40}>
                <div style={{ background: C.ink, padding: "32px 28px", height: "100%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.accentRose, letterSpacing: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 500, fontSize: 18, color: "#fff", marginTop: 10, marginBottom: 8, lineHeight: 1.3 }}>{ch.title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{ch.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. WHO THIS IS FOR ══ */}
      <section style={{ background: C.cream, padding: "88px 0" }}>
        <div className="aaw aa-who-layout">
          <Reveal>
            <Label>Who This Is For</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px,2.8vw,34px)", color: C.ink, lineHeight: 1.3 }}>
              Three kinds of students find their way to us.
            </h2>
          </Reveal>
          <div>
            {WHO_THIS_IS_FOR.map((text, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 24, padding: "26px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 500, fontSize: 22, color: C.accent, flexShrink: 0, width: 30 }}>{i + 1}</span>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.stone, lineHeight: 1.75 }}>{text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <div style={{ marginTop: 32 }}>
                <a href="#book" onClick={scrollToBook} className="aa-btn" style={{ display: "inline-block", background: C.accent, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "14px 28px", borderRadius: 100 }}>
                  Book a complimentary portfolio consultation →
                </a>
                <p style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 13, color: C.stoneLight, marginTop: 14 }}>Just a conversation. No pressure, no commitment.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 4. FOUR PROGRAMMES ══ */}
      <section style={{ background: C.creamWarm, padding: "88px 0" }}>
        <div className="aaw">
          <Reveal>
            <Label>Our Four Distinct Offerings</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: "clamp(26px,3.4vw,40px)", color: C.ink, lineHeight: 1.25, maxWidth: 700, marginBottom: 56 }}>
              Four ways to turn creative potential into tangible outcomes.
            </h2>
          </Reveal>
          <div className="aa-programmes">
            {PROGRAMMES.map((p, i) => (
              <Reveal key={p.num} delay={i * 60}>
                <div className="aa-card" style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Placeholder image area */}
                  <div style={{ width: "100%", aspectRatio: "4/3", background: C.creamWarm, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    <img src={`${p.num}`} alt={p.name} onError={e => e.currentTarget.style.display = "none"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}  loading="lazy" decoding="async"/>
                    <span style={{ position: "absolute", bottom: 10, right: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "rgba(0,0,0,0.3)" }}>Fig. {p.num}</span>
                  </div>
                  <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 500, fontSize: 20, color: C.ink, lineHeight: 1.25, marginTop: 12, marginBottom: 12 }}>{p.name}</h3>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.stone, lineHeight: 1.6, marginBottom: 20 }}>{p.tagline}</p>
                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.stoneLight, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Who it's for</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.stone, lineHeight: 1.55, marginBottom: 16 }}>{p.who}</p>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.stoneLight, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>What you'll get</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.stone, lineHeight: 1.55 }}>{p.get}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. RESULTS ══ */}
      <section style={{ background: C.ink, padding: "88px 0" }}>
        <div className="aaw">
          <Reveal>
            <Label light>Guiding Creative Futures, From Portfolio to Pro</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px,3.4vw,40px)", color: "#fff", lineHeight: 1.25, marginBottom: 48 }}>
              Our results speak for themselves.
            </h2>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.borderLight}` }}>
            {RESULTS.map((r, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="aa-result-row" style={{ padding: "26px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div>
                      <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 500, fontSize: 18, color: "#fff" }}>{r.school}</span>
                      <span style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.accentRose, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{r.field}</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{r.outcome}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={{ marginTop: 40 }}>
              <a href="#book" onClick={scrollToBook} className="aa-btn" style={{ display: "inline-block", background: C.accent, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "14px 28px", borderRadius: 100 }}>
                Book a complimentary portfolio consultation →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 6. MENTORS ══ */}
      <section style={{ background: C.cream, padding: "88px 0" }}>
        <div className="aaw">
          <Reveal>
            <Label>Who You Work With</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: "clamp(26px,3.4vw,40px)", color: C.ink, lineHeight: 1.25, marginBottom: 56 }}>
              Mentors who nurture artistic growth.
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {MENTORS.map((m, i) => (
              <Reveal key={m.name} delay={i * 60}>
                <MentorCard m={m} isDark={i % 2 === 0} photoLeft={true} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. BOOK FORM ══ */}
      <section id="book" style={{ background: C.ink, padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -180, left: "50%", transform: "translateX(-50%)", width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, ${C.maroon}22 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div className="aaw" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Label light>Book Now · Complimentary</Label>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px,4vw,48px)", color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
                Let's get artsy with Added.
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 16px" }}>
                Book a complimentary portfolio consultation. Just a conversation. No pressure, no commitment. Tell us a little about your child and our team will be in touch to arrange your consultation.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 48px" }}>
                You'll leave with 2 to 3 concrete paths forward, each matched to your child's goals, timeline, and your family's needs.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ maxWidth: 720, margin: "0 auto", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderLight}`, borderRadius: 14, padding: "40px clamp(20px,4vw,48px)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 400, fontSize: 24, color: "#fff", marginBottom: 12 }}>Thank you — request received.</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Our team will be in touch shortly to arrange your complimentary consultation.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="aa-form-grid">
                    {[
                      { key: "firstname", label: "First name*", type: "text", placeholder: "First name" },
                      { key: "lastname", label: "Last name*", type: "text", placeholder: "Last name" },
                    ].map(f => (
                      <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{f.label}</label>
                        <input className={`aa-form-input${errors[f.key] ? " aa-form-input-err" : ""}`} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                        {errors[f.key] && <span className="aa-form-err">{errors[f.key]}</span>}
                      </div>
                    ))}
                    {/* Country */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Country*</label>
                      <select aria-label="Country" className={`aa-form-input${errors.country ? " aa-form-input-err" : ""}`} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                        <option value="">Please Select</option>
                        {COUNTRIES.map(c => <option key={c.iso} value={c.name}>{c.name}</option>)}
                      </select>
                      {errors.country && <span className="aa-form-err">{errors.country}</span>}
                    </div>
                    {/* Phone */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Phone number*</label>
                      <div ref={phoneRef} style={{ position: "relative" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button type="button" onClick={() => setPhoneOpen(!phoneOpen)} className="aa-form-input" style={{ width: "auto", padding: "13px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <span style={{ fontSize: 13 }}>{selectedCountry.dial}</span>
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>▾</span>
                          </button>
                          <input className={`aa-form-input${errors.phone ? " aa-form-input-err" : ""}`} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Mobile number" style={{ flex: 1 }} />
                        </div>
                        {phoneOpen && (
                          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, background: C.inkSoft, border: `1px solid ${C.borderLight}`, borderRadius: 8, width: 260, maxHeight: 220, overflowY: "auto" }}>
                            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${C.borderLight}`, position: "sticky", top: 0, background: C.inkSoft }}>
                              <input className="aa-form-input" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder="Search country..." style={{ padding: "8px 12px", fontSize: 13 }} />
                            </div>
                            <div>
                              {filteredCountries.map(c => (
                                <div key={c.iso} onClick={() => { setForm({ ...form, countryIso: c.iso }); setPhoneOpen(false); setCountrySearch("") }} style={{ padding: "9px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: form.countryIso === c.iso ? C.accent : "#fff", background: form.countryIso === c.iso ? "rgba(200,53,75,0.1)" : "transparent" }}>
                                  <span>{c.name}</span>
                                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{c.dial}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.phone && <span className="aa-form-err">{errors.phone}</span>}
                    </div>
                    {/* School */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>School Name*</label>
                      <input className={`aa-form-input${errors.schoolname ? " aa-form-input-err" : ""}`} type="text" value={form.schoolname} onChange={e => setForm({ ...form, schoolname: e.target.value })} placeholder="School name" />
                      {errors.schoolname && <span className="aa-form-err">{errors.schoolname}</span>}
                    </div>
                    {/* Email */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Email*</label>
                      <input className={`aa-form-input${errors.email ? " aa-form-input-err" : ""}`} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                      {errors.email && <span className="aa-form-err">{errors.email}</span>}
                    </div>
                  </div>
                  {submitError && <p style={{ color: C.accentRose, fontSize: 13, marginTop: 18, fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>{submitError}</p>}
                  <div style={{ textAlign: "center", marginTop: 28 }}>
                    <button type="submit" disabled={submitting} className="aa-btn" style={{ background: C.accent, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", padding: "18px 40px", borderRadius: 100 }}>
                      {submitting ? "Submitting…" : "Book my consultation →"}
                    </button>
                    <p style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 400, fontSize: 13, color: C.stoneLight, marginTop: 18 }}>Just a conversation. No pressure, no commitment.</p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}