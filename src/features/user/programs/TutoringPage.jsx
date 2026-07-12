import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  maroon: "#6B1818", maroonSoft: "#7E2424",
  accent: "#C8354B", accentDeep: "#9E2538", accentRose: "#E8B4BD",
  border: "rgba(0,0,0,0.06)",
}

const APPROACH_STEPS = [
  { num: "01", title: "Identify Gap",       body: "We test your child against their exact curriculum to find where marks are being lost. The plan is built from the diagnostic, not a template." },
  { num: "02", title: "Academic Roadmap",   body: "Tutor, family advisor, and student agree on goals, milestones, and the universities the work is pointed at. Everyone knows what the next 90 days look like before session one." },
  { num: "03", title: "1:1 Tutoring",       body: "1-on-1 sessions with a curriculum-specialist tutor, scheduled around your child's actual life. Past papers, structured drills, and written feedback — not generic content review." },
  { num: "04", title: "Session Insights",   body: "Every session generates a 24-hour report. Every month, the family advisor reviews progress against milestones with you and adjusts the plan if marks aren't moving." },
  { num: "05", title: "Grow",               body: "As your child masters the material, sessions shift toward exam-day independence. They walk into the final paper able to perform without the tutor in the room." },
]

const OFFERS = [
  {
    id: "curriculum", label: "Curriculum Tutoring",
    subhead: "MYP, IB, IGCSE, AS, A-Level, AP",
    body: "Subject-specialist tutors who know your child's exam board inside out. Sessions are built around their school's syllabus, their teacher's marking patterns, and the universities they're targeting.",
    cta: "Book a diagnostic",
  },
  {
    id: "oxbridge", label: "Oxbridge Entrance Test Prep",
    subhead: "Admissions tests required for Oxford and Cambridge applicants",
    body: "Dedicated prep for the subject and aptitude tests that decide Oxbridge offers. Tutors with first-hand experience of these papers, working from past questions and examiner reports.",
    cta: "Book a strategy call",
  },
]

const WHY_FEATURES = [
  { num: "01", title: "Curriculum-specialist tutors",    body: "Every tutor is matched to your child's exact curriculum: MYP, IB, IGCSE, AS, A-Level, or AP." },
  { num: "02", title: "Diagnostic before session one",   body: "We identify exactly where marks are being lost before we begin, so no session is ever wasted on the wrong thing." },
  { num: "03", title: "24-hour reports via WhatsApp",    body: "Every session generates a written report on what was covered, what was missed, and what's next." },
  { num: "04", title: "Past-paper strategy",             body: "We work backwards from your child's exam board's actual papers, so prep is built around the marks they need." },
  { num: "05", title: "Scheduling that adapts",          body: "Sessions adapt to student-athletes, performers, and student leaders who can't move training or rehearsal." },
]

const COMPARISON_ROWS = [
  { label: "Diagnostic assessment",       other: false,     ae: true },
  { label: "Dedicated tutor",             other: false,     ae: true },
  { label: "24-hour post-session reports",other: false,     ae: true },
  { label: "Monthly plan review",         other: false,     ae: true },
  { label: "Tutor credentials",           other: "Varies",  ae: "Top university graduates" },
  { label: "Family advisor calls",        other: false,     ae: true },
  { label: "Past-paper strategy",         other: false,     ae: true },
  { label: "Scheduling flexibility",      other: false,     ae: true },
]

const FAQ_ITEMS = [
  { question: "How do you build a personalised plan?",              answer: "Before sessions begin, your child completes a diagnostic. We use that to identify gaps and build a curriculum around what they actually need. The plan is reviewed and updated regularly." },
  { question: "Who are the tutors?",                                answer: "Graduates of Oxford, Cambridge, Stanford, MIT, and Harvard, selected for subject expertise and how well they teach. Matched to your child based on subject, learning style, and goals." },
  { question: "Are sessions online?",                               answer: "Yes — all sessions are 1-on-1 and online. This lets us match your child with the best tutor for them regardless of location, and keeps scheduling flexible around everything else they have going on." },
  { question: "Do you cover Oxbridge entrance test prep?",          answer: "Yes. We run a dedicated Oxbridge Entrance Test Prep program covering the subject and aptitude tests required by Oxford and Cambridge, taught by tutors with first-hand experience of those papers." },
  { question: "What's in the 24-hour post-session report?",         answer: "Every session generates a written report covering what was taught, how your child performed, what gaps remain, and the homework set for the next session. It arrives on WhatsApp or email within 24 hours of every session." },
  { question: "How does scheduling work around competitions or other commitments?", answer: "Sessions adapt to your child's schedule, not the other way around. We work with student-athletes, performers, and student leaders who can't move training or rehearsal, and the family advisor handles all rescheduling." },
]

const COUNTRIES = [
  { iso: "AF", name: "Afghanistan", dial: "+93" }, { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "AT", name: "Austria", dial: "+43" }, { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "BD", name: "Bangladesh", dial: "+880" }, { iso: "BE", name: "Belgium", dial: "+32" },
  { iso: "BR", name: "Brazil", dial: "+55" }, { iso: "BN", name: "Brunei", dial: "+673" },
  { iso: "CA", name: "Canada", dial: "+1" }, { iso: "CN", name: "China", dial: "+86" },
  { iso: "CO", name: "Colombia", dial: "+57" }, { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "EG", name: "Egypt", dial: "+20" }, { iso: "FI", name: "Finland", dial: "+358" },
  { iso: "FR", name: "France", dial: "+33" }, { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "GH", name: "Ghana", dial: "+233" }, { iso: "GR", name: "Greece", dial: "+30" },
  { iso: "HK", name: "Hong Kong", dial: "+852" }, { iso: "HU", name: "Hungary", dial: "+36" },
  { iso: "IN", name: "India", dial: "+91" }, { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" }, { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" }, { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "JO", name: "Jordan", dial: "+962" }, { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KW", name: "Kuwait", dial: "+965" }, { iso: "LB", name: "Lebanon", dial: "+961" },
  { iso: "MY", name: "Malaysia", dial: "+60" }, { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "MA", name: "Morocco", dial: "+212" }, { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NZ", name: "New Zealand", dial: "+64" }, { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "NO", name: "Norway", dial: "+47" }, { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PK", name: "Pakistan", dial: "+92" }, { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "PL", name: "Poland", dial: "+48" }, { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "QA", name: "Qatar", dial: "+974" }, { iso: "RU", name: "Russia", dial: "+7" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" }, { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" }, { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" }, { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "SE", name: "Sweden", dial: "+46" }, { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "TW", name: "Taiwan", dial: "+886" }, { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TR", name: "Turkey", dial: "+90" }, { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" }, { iso: "US", name: "United States", dial: "+1" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
]

/* ── Reveal ── */
function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setV(true), delay); io.unobserve(el) }
    }, { threshold: 0.06 })
    io.observe(el); return () => io.disconnect()
  }, [delay])
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── FAQ Accordion ── */
function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)
  useEffect(() => { if (contentRef.current) setHeight(contentRef.current.scrollHeight) }, [isOpen])
  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", marginBottom: 6 }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0, fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 500, color: C.accent, lineHeight: 1 }}>
          {isOpen ? "−" : "+"}
        </span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>{item.question}</span>
      </button>
      <div style={{ maxHeight: isOpen ? height + 20 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s ease" }}>
        <div ref={contentRef} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.stone, lineHeight: 1.65, padding: "0 16px 14px 46px" }}>{item.answer}</div>
      </div>
    </div>
  )
}

/* ── Testimonials ── */
const DEFAULT_TESTIMONIALS = [
  { name: "Omar",   location: "UAE | Physics",       quote: "AE Tutoring Program has completely changed the way I approach Physics. I always understood theory but struggled with numericals. My tutor diagnosed my topic-wise gaps and built a structured, goal-based lesson plan. The progress tracker helped me visualise my accuracy and areas that needed revision." },
  { name: "Li Wei", location: "Singapore | Economics", quote: "The AddedEducation Tutoring Program made Economics so much clearer for me. I struggled with evaluation and structured answers, but my tutor quickly diagnosed my weaknesses and built a personalised strategy along with a chapter-wise lesson plan, all tracked neatly through the progress tracker." },
  { name: "Aanya",  location: "India | English",       quote: "My one-on-one tutor at AddedEducation genuinely transformed my writing. I struggled with structuring arguments and maintaining clarity. From the very first week, we worked around comprehension techniques and timed writing practice." },
]

/* ══ MAIN ══ */
export default function TutoringPage() {
  const formRef = useRef(null)
  const phoneRef = useRef(null)
  const [tIdx, setTIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  const [form, setForm] = useState({ firstname: "", lastname: "", countryIso: "GB", phoneDialIso: "GB", phone: "", schoolname: "", email: "", subject: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")

  useEffect(() => {
    const fn = (e) => { if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  const filteredCountries = COUNTRIES.filter(c => {
    const q = countrySearch.trim().toLowerCase()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q)
  })
  const currentDial = COUNTRIES.find(c => c.iso === form.phoneDialIso)

  const scrollToForm = (e) => {
    e.preventDefault()
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSubmit = async () => {
    setSubmitError("")
    const errs = {}
    if (!form.firstname.trim()) errs.firstname = "Please enter your first name."
    if (!form.email.trim()) errs.email = "Please enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Please enter a valid email."
    if (!form.countryIso) errs.countryIso = "Please select your country."
    if (!form.phone.trim()) errs.phone = "Please enter your phone number."
    if (!form.schoolname.trim()) errs.schoolname = "Please enter your school name."
    if (!form.subject.trim()) errs.subject = "Please tell us which subjects you need help with."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const dial = COUNTRIES.find(c => c.iso === form.phoneDialIso)?.dial || ""
    const fullPhone = `${dial} ${form.phone.replace(/\D/g, "")}`
    setSubmitting(true)
    try {
      const res = await fetch("https://api-na2.hsforms.com/submissions/v3/integration/submit/4257853/3c826716-c38e-43d7-a620-61f00118691d", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: form.firstname.trim() },
            { name: "lastname",  value: form.lastname.trim() },
            { name: "email",     value: form.email.trim() },
            { name: "phone",     value: fullPhone },
            { name: "schoolname",value: form.schoolname.trim() },
            { name: "countryofresidence", value: COUNTRIES.find(c => c.iso === form.countryIso)?.name || "" },
            { name: "subject",   value: form.subject.trim() },
          ],
          context: { pageUri: window.location.href, pageName: "AddedEducation — Tutoring Enquiry" },
        }),
      })
      if (res.ok) setSubmitted(true)
      else { const d = await res.json().catch(() => null); setSubmitError(d?.message || "Something went wrong. Please try again.") }
    } catch { setSubmitError("Network error. Please check your connection.") }
    finally { setSubmitting(false) }
  }

  const inpStyle = (err) => ({
    width: "100%", boxSizing: "border-box", background: C.ink,
    border: `1.5px solid ${err ? C.accent : "transparent"}`,
    borderRadius: 10, padding: "14px 16px",
    fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 400,
    color: "#fff", outline: "none", transition: "border-color 0.18s",
  })
  const lblStyle = { display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.stone, marginBottom: 8 }
  const ErrMsg = ({ k }) => errors[k] ? <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.accentRose, margin: "5px 0 0" }}>⚠ {errors[k]}</p> : null
  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A6A39E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`

  return (
    <div style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", background: C.cream }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=Inter:wght@350;400;450;500&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
.tpw{padding:0 clamp(24px,7vw,112px);}
.tp-hero-pill{display:inline-flex;align-items:center;background:transparent;border:1px solid rgba(255,255,255,0.25);border-radius:999px;padding:6px 14px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:24px;}
.tp-hero-cta{display:inline-flex;align-items:center;gap:10px;background:#fff;color:${C.ink};border-radius:999px;padding:15px 32px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;text-decoration:none;transition:all 0.3s cubic-bezier(.16,1,.3,1);cursor:pointer;border:none;}
.tp-hero-cta:hover{background:${C.accentRose};transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,53,75,0.18);}
.tp-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);border-radius:16px 16px 0 0;overflow:hidden;}
.tp-why-grid-bottom{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);border-top:none;border-radius:0 0 16px 16px;overflow:hidden;}
.tp-why-card{background:#fff;padding:32px 28px;transition:background 0.3s ease;}
.tp-why-card:hover{background:${C.creamSoft};}
.tp-cmp-table{width:100%;border-collapse:separate;border-spacing:0 6px;}
.tp-cmp-head td{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:${C.accent};padding:0 20px 16px;text-align:center;}
.tp-cmp-head td:first-child{text-align:left;color:transparent;}
.tp-cmp-row td{background:#fff;padding:14px 20px;font-family:'DM Sans',sans-serif;font-size:13px;color:${C.stone};}
.tp-cmp-row td:first-child{border-radius:8px 0 0 8px;font-family:'Fraunces',serif;font-size:14px;color:${C.accent};font-weight:500;background:rgba(255,255,255,0.95);}
.tp-cmp-row td:nth-child(2){text-align:center;}
.tp-cmp-row td:last-child{border-radius:0 8px 8px 0;text-align:center;}
.tp-test-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px 24px;display:flex;flex-direction:column;transition:background 0.3s ease;}
.tp-test-card.active{background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.14);}
.tp-test-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);border:none;cursor:pointer;padding:8px 0;margin:-8px 0;box-sizing:content-box;transition:all 0.3s ease;}
.tp-test-dot.on{background:${C.accent};transform:scale(1.3);}
.tp-test-arrow{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;}
.tp-test-arrow:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.4);}
.tp-step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 16px;position:relative;z-index:1;}
.tp-step-dot{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;margin-bottom:20px;transition:all 0.4s cubic-bezier(.16,1,.3,1);flex-shrink:0;}
.tp-step:hover .tp-step-dot{transform:scale(1.1);box-shadow:0 8px 32px rgba(107,24,24,0.15);}
.tp-offer-cta-light{background:${C.ink};color:#fff;} .tp-offer-cta-light:hover{background:${C.maroon};}
.tp-offer-cta-dark{background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.2);} .tp-offer-cta-dark:hover{background:rgba(255,255,255,0.2);}
.te-inp::placeholder{color:rgba(255,255,255,0.28)!important;}
.te-sel option{background:#0E0E0E;color:#fff;}
.te-search::placeholder{color:rgba(255,255,255,0.35)!important;}
@media(max-width:960px){
  .tp-why-grid,.tp-why-grid-bottom{grid-template-columns:1fr 1fr;}
  .tp-steps-wrap{grid-template-columns:repeat(3,1fr)!important;gap:36px 0!important;}
  .tp-offers-grid{grid-template-columns:1fr!important;}
  .tp-faq-layout{grid-template-columns:1fr!important;gap:32px!important;}
  .tp-faq-img{aspect-ratio:16/10!important;min-height:auto!important;}
  .tp-faq-section{padding:64px 0!important;}
  .tp-form-section{grid-template-columns:1fr!important;}
  .tp-test-cards{grid-template-columns:1fr!important;}
}
@media(max-width:640px){
  .tp-why-grid,.tp-why-grid-bottom{grid-template-columns:1fr;}
  .tp-steps-wrap{grid-template-columns:1fr!important;gap:0!important;}
  .tp-step{flex-direction:row!important;text-align:left!important;align-items:flex-start!important;padding:0 0 28px!important;gap:16px!important;}
  .tp-step-dot{width:44px!important;height:44px!important;font-size:12px!important;margin-bottom:0!important;}
}
      `}</style>

      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section style={{ position: "relative", minHeight: 540, display: "flex", alignItems: "flex-end", overflow: "hidden", background: C.ink }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: `linear-gradient(135deg, ${C.inkSoft} 0%, #1a1a1a 60%, ${C.maroon}30 100%)` }} />
        <img
          src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1783856362771_tHjQDoq295dCxsgmBLFAJqQI.webp"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
         fetchpriority="high" loading="eager" decoding="async"/>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(90deg, rgba(14,14,14,0.82) 0%, rgba(14,14,14,0.3) 70%, transparent 100%)" }} />
        <div className="tpw" style={{ position: "relative", zIndex: 2, padding: "120px clamp(24px,7vw,112px) 80px", maxWidth: 780 }}>
          <FadeIn>
            <div className="tp-hero-pill">Tutoring Program</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,3.8vw,56px)", fontWeight: 400, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8, maxWidth: 640 }}>
              Curriculum tutoring built around your child's schedule{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>with a written report after every session.</em>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(13px,1.4vw,15px)", color: "rgba(255,255,255,0.6)", marginBottom: 36, lineHeight: 1.55, marginTop: 16 }}>
              MYP, IB, IGCSE, AS, A-Level, AP, and Oxbridge entrance prep. Tutors from Oxford, Cambridge, MIT, Harvard, and Stanford.
            </p>
            <button className="tp-hero-cta" onClick={scrollToForm}>Book a diagnostic session</button>
          </FadeIn>
        </div>
      </section>

      {/* ══ 2. INTRO ══ */}
      <section style={{ background: C.ink, padding: "72px clamp(24px,7vw,112px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
        <FadeIn>
          <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1a", position: "relative" }}>
            <img src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567151111_added_tutoring.webp" alt="" onError={e => e.currentTarget.style.display="none"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}  loading="lazy" decoding="async"/>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 400, color: "#fff", lineHeight: 1.4 }}>
            AddedTutoring is a prestigious, high touch learning experience for families who refuse to let their child fall behind academically. We diagnose hidden cognitive learning gaps, enforce high-frequency communication accountability, and align your child's daily performance with the brutal requirements of Ivy & Oxbridge admissions.
          </p>
        </FadeIn>
      </section>

      {/* ══ 3. WHY PARENTS ══ */}
      <section style={{ background: C.cream }}>
        <div style={{ padding: "80px clamp(24px,7vw,112px) 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "end", marginBottom: 48 }}>
            <FadeIn>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,4vw,48px)", fontWeight: 300, color: C.ink, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Why parents & students<br />work with <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>AE tutors.</em>
              </h2>
            </FadeIn>
            <FadeIn delay={80}>
              <div style={{ borderRadius: 14, overflow: "hidden", height: 180, background: C.creamWarm, position: "relative" }}>
                <img src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567168736_bvXo38Kc5Z51K98t6ZrpGeVOpg.webp" alt="" onError={e => e.currentTarget.style.display="none"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}  loading="lazy" decoding="async"/>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={120}>
            <div className="tp-why-grid">
              {WHY_FEATURES.slice(0, 3).map(f => (
                <div className="tp-why-card" key={f.num}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.accent, letterSpacing: 1.5, marginBottom: 14 }}>{f.num}</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 500, color: C.ink, lineHeight: 1.25, marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.stone, lineHeight: 1.6 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={180}>
            <div className="tp-why-grid-bottom">
              {WHY_FEATURES.slice(3).map(f => (
                <div className="tp-why-card" key={f.num}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.accent, letterSpacing: 1.5, marginBottom: 14 }}>{f.num}</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 500, color: C.ink, lineHeight: 1.25, marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.stone, lineHeight: 1.6 }}>{f.body}</div>
                </div>
              ))}
              {/* image cell */}
               <div style={{ background: C.ink, overflow: "hidden", position: "relative", minHeight: 180 }}>
                <img src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567168548_LclcFm8NLFa9DMy3nwiUQO4uTWg.webp" alt="" onError={e => e.currentTarget.style.display="none"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}  loading="lazy" decoding="async"/>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 4. COMPARISON ══ */}
      <section style={{ position: "relative", padding: "96px clamp(24px,7vw,112px)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: C.ink }} />
        <img src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567186877_tutoring_FAQ.webp" alt="" onError={e => e.currentTarget.style.display="none"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.18 }}  loading="lazy" decoding="async"/>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(14,14,14,0.7)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 400, color: "#fff", lineHeight: 1.2, marginBottom: 40 }}>
            How we stack up <em style={{ fontStyle: "italic", color: C.accent }}>against the rest.</em>
          </h2>
          <table className="tp-cmp-table">
            <tbody>
              <tr className="tp-cmp-head">
                <td style={{ width: "40%" }}></td>
                <td style={{ width: "30%" }}>Other Tutoring</td>
                <td style={{ width: "30%" }}>AE Tutoring</td>
              </tr>
              {COMPARISON_ROWS.map((row, i) => (
                <tr className="tp-cmp-row" key={i}>
                  <td>{row.label}</td>
                  <td>{row.other === false ? <span style={{ color: C.stoneLight, fontSize: 16 }}>✕</span> : typeof row.other === "string" ? row.other : <span style={{ color: C.accent, fontSize: 16 }}>✓</span>}</td>
                  <td>{row.ae === true ? <span style={{ color: C.accent, fontSize: 16 }}>✓</span> : typeof row.ae === "string" ? row.ae : <span style={{ color: C.stoneLight, fontSize: 16 }}>✕</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>
        </div>
      </section>

      {/* ══ 5. TESTIMONIALS ══ */}
      <section style={{ background: C.ink, padding: "96px clamp(24px,7vw,112px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48, gap: 24, flexWrap: "wrap" }}>
          <FadeIn>
            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Testimonials</div>
          </FadeIn>
          <FadeIn delay={60}>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
                Hear it from students <em style={{ fontStyle: "italic", color: C.accent }}>who made it.</em>
              </h2>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="tp-test-arrow" aria-label="Previous testimonial" onClick={() => setTIdx(i => (i - 1 + DEFAULT_TESTIMONIALS.length) % DEFAULT_TESTIMONIALS.length)}>←</button>
                <button className="tp-test-arrow" aria-label="Next testimonial" onClick={() => setTIdx(i => (i + 1) % DEFAULT_TESTIMONIALS.length)}>→</button>
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={100}>
          <div className="tp-test-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {DEFAULT_TESTIMONIALS.map((t, i) => (
              <div key={i} className={`tp-test-card${tIdx === i ? " active" : ""}`}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.stoneLight }}>{t.location}</div>
                  </div>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: C.inkSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.2)" }}>{t.name[0]}</span>
                  </div>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>"{t.quote}"</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ══ 6. APPROACH ══ */}
      <section style={{ background: C.cream, padding: "96px 0 80px" }}>
        <div className="tpw">
          <FadeIn>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 400, color: C.ink, lineHeight: 1.15 }}>
              The AE Tutoring <em style={{ fontStyle: "italic", color: C.maroon }}>Approach.</em>
            </h2>
          </FadeIn>
          <div className="tp-steps-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0, position: "relative", marginTop: 56 }}>
            <div style={{ position: "absolute", top: 28, left: "calc(10% + 14px)", right: "calc(10% + 14px)", height: 1, background: `linear-gradient(90deg,${C.border} 0%,${C.stoneLight} 25%,${C.stoneLight} 75%,${C.border} 100%)`, zIndex: 0 }} />
            {APPROACH_STEPS.map((s, i) => (
              <FadeIn key={s.num} delay={i * 80}>
                <div className="tp-step">
                  <div className="tp-step-dot" style={{ background: i === 0 ? C.ink : "#fff", color: i === 0 ? "#fff" : C.ink, border: i === 0 ? "none" : `1.5px solid ${C.border}`, boxShadow: i === 0 ? "0 6px 24px rgba(14,14,14,0.12)" : "none" }}>{s.num}</div>
                  <div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 500, color: C.ink, lineHeight: 1.25, marginBottom: 10 }}>{s.title}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.stone, lineHeight: 1.6, maxWidth: 220 }}>{s.body}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. OFFERS ══ */}
      <section style={{ background: C.cream, padding: "0 0 96px" }}>
        <div className="tpw">
          <FadeIn>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 400, color: C.ink, lineHeight: 1.15 }}>
              What we <em style={{ fontStyle: "italic", color: C.maroon }}>offer.</em>
            </h2>
          </FadeIn>
          <div className="tp-offers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, marginTop: 48 }}>
            {OFFERS.map((o, i) => (
              <FadeIn key={o.id} delay={i * 100}>
                <div style={{ borderRadius: 18, padding: "40px 36px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: i === 0 ? C.creamWarm : C.ink, border: i === 0 ? `1.5px solid ${C.border}` : "none" }}>
                  {i === 1 && <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${C.maroon}30 0%,transparent 65%)`, pointerEvents: "none" }} />}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28, color: i === 0 ? C.stone : "rgba(255,255,255,0.4)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: i === 0 ? C.accent : C.stoneLight, flexShrink: 0 }} />
                    {i === 0 ? "Core Program" : "Specialist Track"}
                  </div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.01em", marginBottom: 8, color: i === 0 ? C.ink : "#fff" }}>{o.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: 0.5, marginBottom: 20, color: i === 0 ? C.stone : "rgba(255,255,255,0.4)" }}>{o.subhead}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.65, flex: 1, marginBottom: 32, color: i === 0 ? C.stone : "rgba(255,255,255,0.6)" }}>{o.body}</div>
                  <button className={`tp-offer-cta ${i === 0 ? "tp-offer-cta-light" : "tp-offer-cta-dark"}`} onClick={scrollToForm} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: "14px 28px", borderRadius: 999, width: "fit-content", transition: "all 0.3s cubic-bezier(.16,1,.3,1)", cursor: "pointer" }}>
                    {o.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. FAQ ══ */}
      <section className="tp-faq-section" style={{ background: C.ink, padding: "96px 0" }}>
        <div className="tpw">
          <div className="tp-faq-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <FadeIn>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(38px,3.5vw,50px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, marginBottom: 28 }}>Frequently Asked<br />Questions</h2>
              </FadeIn>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem key={i} item={item} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                ))}
              </div>
            </div>
            <FadeIn delay={120}>
              <div className="tp-faq-img" style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "1/1", background: "#1a1a1a", minHeight: 400, position: "relative" }}>
                <img src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Tutoring+Page/tutoring+FAQ.png" alt="" onError={e => e.currentTarget.style.display="none"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}  loading="lazy" decoding="async"/>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 9. CLOSING CTA ══ */}
      <section style={{ background: C.ink, padding: "0" }}>
        <div className="tpw">
          <div style={{ padding: "80px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, position: "relative", borderTop: "1px solid rgba(200,53,75,0.15)", flexWrap: "wrap" }}>
            <div style={{ position: "absolute", bottom: -80, left: "50%", transform: "translateX(-50%)", width: 400, height: 200, borderRadius: "50%", background: `radial-gradient(circle,${C.maroon}18 0%,transparent 65%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <FadeIn>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 400, color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>
                  Ready to <em style={{ fontStyle: "italic", color: C.accentRose }}>start?</em>
                </h2>
              </FadeIn>
              <FadeIn delay={60}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 520 }}>
                  Earlier is always better. The diagnostic takes 30 minutes and tells you exactly where your child stands and what the next 90 days should focus on.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={120}>
              <button onClick={scrollToForm} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: C.ink, background: "#fff", borderRadius: 12, padding: "16px 32px", flexShrink: 0, transition: "all 0.35s cubic-bezier(.16,1,.3,1)", border: "none", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.accentRose; e.currentTarget.style.transform = "translateY(-2px)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)" }}
              >Book your diagnostic</button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 10. FORM ══ */}
      <section id="tutoring-form" ref={formRef} style={{ background: C.cream, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start" }} className="tp-form-section">
        {/* Left copy */}
        <div style={{ padding: "80px clamp(24px,7vw,112px)" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 20px" }}>Start with a diagnostic.</h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.55, color: C.stone, margin: 0 }}>
            We'll assess where your child stands before the first session, so day one is already targeted.
          </p>
        </div>
        {/* Right form */}
        <div style={{ padding: "80px clamp(24px,5vw,80px) clamp(24px,7vw,112px) 24px", boxSizing: "border-box" }}>
          {submitted ? (
            <div style={{ padding: "24px 0" }}>
              <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 28, color: C.ink, margin: "0 0 12px" }}>Thanks for your enquiry!</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.stone, lineHeight: 1.55, margin: 0 }}>Our team will be in touch to discuss a tailored tutoring plan.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Names */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lblStyle}>First Name *</label>
                  <input type="text" placeholder="Jane" value={form.firstname} onChange={e => setField("firstname", e.target.value)} className="te-inp" style={inpStyle(!!errors.firstname)} />
                  <ErrMsg k="firstname" />
                </div>
                <div>
                  <label style={lblStyle}>Last Name</label>
                  <input type="text" placeholder="Smith" value={form.lastname} onChange={e => setField("lastname", e.target.value)} className="te-inp" style={inpStyle(false)} />
                </div>
              </div>
              {/* Country + Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lblStyle}>Country *</label>
                  <select aria-label="Country of residence" value={form.countryIso} onChange={e => setField("countryIso", e.target.value)} className="te-sel" style={{ ...inpStyle(!!errors.countryIso), appearance: "none", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 30, cursor: "pointer", color: "#fff" }}>
                    {COUNTRIES.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}
                  </select>
                  <ErrMsg k="countryIso" />
                </div>
                <div>
                  <label style={lblStyle}>Phone *</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }} ref={phoneRef}>
                    <div style={{ position: "relative" }}>
                      <button type="button" onClick={() => setPhoneOpen(o => !o)} style={{ ...inpStyle(false), width: "auto", padding: "14px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", border: `1.5px solid ${phoneOpen ? C.accent : "transparent"}` }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#fff" }}>{currentDial?.dial}</span>
                        <span style={{ fontSize: 8, color: C.stoneLight }}>▼</span>
                      </button>
                      {phoneOpen && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100, background: C.ink, border: `1.5px solid ${C.accent}`, borderRadius: 10, overflow: "hidden", width: 260 }}>
                          <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <input autoFocus className="te-search" type="text" placeholder="Search country…" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#fff" }} />
                          </div>
                          <div style={{ maxHeight: 180, overflowY: "auto" }}>
                            {filteredCountries.map(c => (
                              <button key={c.iso} type="button" onClick={() => { setField("phoneDialIso", c.iso); setPhoneOpen(false); setCountrySearch("") }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: c.iso === form.phoneDialIso ? "rgba(200,53,75,0.15)" : "transparent", border: "none", cursor: "pointer", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, opacity: 0.6, width: 22 }}>{c.iso}</span>
                                  {c.name}
                                </span>
                                <span style={{ color: C.stoneLight, fontSize: 12 }}>{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input type="tel" placeholder="8123456789" value={form.phone} onChange={e => setField("phone", e.target.value)} className="te-inp" style={inpStyle(!!errors.phone)} />
                    </div>
                  </div>
                  <ErrMsg k="phone" />
                </div>
              </div>
              {/* School */}
              <div>
                <label style={lblStyle}>School Name</label>
                <input type="text" placeholder="HKIS" value={form.schoolname} onChange={e => setField("schoolname", e.target.value)} className="te-inp" style={inpStyle(!!errors.schoolname)} />
                <ErrMsg k="schoolname" />
              </div>
              {/* Email */}
              <div>
                <label style={lblStyle}>Email *</label>
                <input type="email" placeholder="jane@gmail.com" value={form.email} onChange={e => setField("email", e.target.value)} className="te-inp" style={inpStyle(!!errors.email)} />
                <ErrMsg k="email" />
              </div>
              {/* Subjects */}
              <div>
                <label style={lblStyle}>What subjects do you need help with? *</label>
                <textarea placeholder="e.g. IB Mathematics, Chemistry, English Literature…" value={form.subject} onChange={e => setField("subject", e.target.value)} rows={4} className="te-inp te-textarea" style={{ ...inpStyle(!!errors.subject), resize: "vertical", minHeight: 110, fontFamily: "'Inter',sans-serif" }} />
                <ErrMsg k="subject" />
              </div>
              {submitError && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.accentRose, margin: 0 }}>⚠ {submitError}</p>}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? C.accentDeep : C.accent, color: "#fff", border: "none", borderRadius: 999, padding: "15px 40px", fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.18s", opacity: submitting ? 0.8 : 1 }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentDeep }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = C.accent }}
                >
                  {submitting ? "Submitting…" : "Submit Now"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
