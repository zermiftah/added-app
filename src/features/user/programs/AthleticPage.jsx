import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  maroon: "#6B1818",
  accent: "#C8354B", accentDeep: "#9E2538", accentRose: "#E8B4BD",
}

/* Existing photo assets already on this page — reused across sections */
const IMG = {
  hero:      "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1783815240063_4HqncUNowLxlzxBUMoNmav5cVVw.webp",
  athleteA:  "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567174666_AUz2BLwkpTIHYJiFse3sOCC8Yk.webp",
  athleteB:  "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567174841_fKILhnpyIz6Ucwp5qZd70qfgF4.webp",
  athleteC:  "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567173852_jPODV665keZha2lLPnOaEimvU.webp",
  athleteD:  "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567177303_wiq7C3s1ppEIBtfdFWpSfhMtto.webp",
  journey:   "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782568861908_4JurFBBvF6sRZ0c0VwBTw5E1Q.webp",
}

/* ── Stats — kept same as before, per copy doc ── */
const STATS = [
  { value: "2000+", label: "coach connections across tennis, soccer, golf, swimming, and 18 other sports" },
  { value: "93%",   label: "of students placed at a top-3 target school" },
  { value: "614+",  label: "Kids recruited at top universities" },
]

/* ── Section 2 — Proof Point / Placements ── */
const FEATURED_PLACEMENT = {
  school: "Tufts University", sport: "TENNIS · DIVISION III", athletes: "Garv & Eren", color: "#26406B",
  body: "2026 NESCAC champions and a top-four nationally ranked programme, with national semi-final runs in three of the last four seasons.",
  photo: IMG.athleteA,
}
const PLACEMENTS = [
  { school: "MIT", sport: "Division III", athletes: "Saina Deshpande", color: "#6B1818", body: "Division III, and the all-time leader in Academic All-Americans.", photo: IMG.athleteB },
  { school: "Texas A&M", sport: "Division I", athletes: "Krish Tyagi", color: "#7E2424", body: "Top-ten Division I programme, NCAA Tournament every year since 1994.", photo: IMG.athleteC },
  { school: "Amherst College", sport: "Division III", athletes: "Tim", color: "#4B2E6B", body: "2024 Division III men's soccer national champions.", photo: IMG.athleteD },
  { school: "Brown University", sport: "Division I", athletes: "Rugby", color: "#4A342A", body: "NCR Division I national champions with a heavily international squad.", photo: IMG.athleteA },
]

/* ── Section 3 — Our Service (6 items) ── */
const SERVICE_ITEMS = [
  { title: "Recruitment strategy", body: "Identifying best-fit programmes (D1, D2, D3) for your athlete's level and ambitions." },
  { title: "Tournament planning", body: "Mapping the competitive calendar that builds a recruitable record." },
  { title: "Summer planning", body: "US showcases, camps and college coach meet-ups that create exposure." },
  { title: "Coach communication", body: "Direct outreach and relationship-building with college coaches through our network." },
  { title: "Mental performance", body: "Preparing athletes to compete and present themselves with confidence." },
  { title: "NCAA eligibility", body: "Managing compliance so nothing derails an offer." },
]

/* ── Section 4 — Counselor profiles ── */
const COUNSELORS = [
  { name: "Ross Leebody", role: "Deputy General Manager, Sports Division", sport: "Soccer", bio: "Former professional footballer. Represented Scotland at U16 and U18, played for Kilmarnock's U19 side, then earned a US scholarship to the University of Washington, scoring 30 goals over three years. Drafted into the USL and went on to play professionally in the United States, Australia and Costa Rica." },
  { name: "Jessica Lydia", role: "Senior Lead Counselor", sport: "Golf & Swimming", bio: "Division 1 golfer and team captain at the University of Richmond on a full athletic scholarship, and an Indonesian National Team golfer." },
  { name: "Ashilla Safiya", role: "Senior Lead Counselor", sport: "Tennis, Squash, Soccer", bio: "Silver medallist at the 2019 SEA Games and a national representative in softball at the Asian Games." },
  { name: "Rakshit Rishi", role: "Senior Lead Counselor", sport: "Tennis", bio: "Former professional tennis player and NCAA Division 1 athlete at Drake University on a full scholarship. Reached a career-high ATP ranking, was a top-10 junior (U18) in India and ranked inside the ITF junior top 250." },
  { name: "Yash Majmudar", role: "Lead Counselor", sport: "Golf", bio: "Division 1 college golfer at UNLV and the University of San Diego. Winner of the Singapore Amateur Championship and now competing on the Professional Golf Tour of India." },
  { name: "Tyler Garrison", role: "Lead Counselor", sport: "Soccer & Team Sports", bio: "Former elite Division 1 footballer and top scorer at California Baptist University, a back-to-back national champion, who also played semi-professional soccer in Southern California." },
  { name: "Adam", role: "Lead Counselor", sport: "Soccer & Team Sports", bio: "Former college soccer player with a master's in Sport Psychology from the University of Stirling." },
  { name: "Melvin", role: "Lead Counselor & Sports Specialist", sport: "Multi-Sport", bio: "Former competitive footballer in India, athletic recruitment specialist with a master's in Sports Management." },
]

/* ── Section 5 — How It Works (5 steps) ── */
const JOURNEY_STEPS = [
  { title: "Evaluation", body: "We assess your athlete's profile honestly, athletically and academically, and tell you where they realistically stand." },
  { title: "Strategy", body: "We build the recruitment plan: target programmes, tournament and summer calendar, and the profile work to get there." },
  { title: "Exposure", body: "We put your athlete in front of college coaches through showcases, highlight materials and direct communication." },
  { title: "Offers & decision", body: "We help you weigh offers and choose the programme that is the right athletic and academic fit." },
  { title: "Commitment", body: "We guide the final application and commitment so your athlete arrives ready to compete." },
]

/* ── Section 6 — Testimonials (kept exactly as on the live site) ── */
const TESTIMONIALS = [
  { name: "Saina", school: "MIT'27", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saina&backgroundColor=ffe4e4", quote: "Getting into top universities isn't just about grades. I'm glad I started planning early. AddedEducation really helped me make my profile shine." },
  { name: "Eren", school: "Tufts'27", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eren&backgroundColor=e0d5f5", quote: "They gave me benchmarks for my grades, helped me plan my tournament schedule, and guided me through reaching out to coaches and the CommonApp. They helped me find the balance with everything." },
  { name: "Anjan", school: "CMU'28", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjan&backgroundColor=f5f0d5", quote: "AddedEducation connected me with coaches and helped me understand what they were looking for, and what in my profile could set me apart." },
  { name: "Mik", school: "Dartmouth'27", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mik&backgroundColor=d5f0e0", quote: "AddedEducation helped me define my purpose and clarify my future goals, leading to acceptances at Brown, Dartmouth, UC Berkeley, and Notre Dame." },
  { name: "Alfonso", school: "Vassar'28", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alfonso&backgroundColor=f5e0d5", quote: "Choose your best tournaments and videos and send them to everyone. You never know who might be looking." },
  { name: "Tim", school: "UMass Amherst'28", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tim&backgroundColor=d5e0f5", quote: "Work on your communication and practice interviews often. An outgoing personality and showing genuine interest can make a world of difference." },
]

/* ─────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────── */
function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)
  useEffect(() => { if (contentRef.current) setHeight(contentRef.current.scrollHeight) }, [isOpen])

  return (
    <div style={{ background: isOpen ? "#fff" : "rgba(255,255,255,0.92)", borderRadius: 8, overflow: "hidden", marginBottom: 6, transition: "background 0.2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0, fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 500, color: C.accent, lineHeight: 1 }}>
          {isOpen ? "−" : "+"}
        </span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>{item.title}</span>
      </button>
      <div style={{ maxHeight: isOpen ? height + 20 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s ease" }}>
        <div ref={contentRef} style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.stone, lineHeight: 1.65, padding: "0 16px 14px 46px" }}>{item.body}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COUNSELOR CARD
───────────────────────────────────────── */
function CounselorCard({ c }) {
  const [imgOk, setImgOk] = useState(true)
  const seed = encodeURIComponent(c.name)
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, overflow: "hidden", flexShrink: 0, background: C.creamWarm }}>
          {imgOk
            ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=f0efea`} alt={c.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={() => setImgOk(false)} loading="lazy" decoding="async" />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: C.stoneLight }}>{c.name[0]}</span>
              </div>}
        </div>
        <div>
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 15, color: C.ink, margin: "0 0 2px" }}>{c.name}</h3>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>{c.role}</p>
        </div>
      </div>
      <span style={{ display: "inline-block", alignSelf: "flex-start", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.stone, background: C.creamWarm, borderRadius: 999, padding: "4px 12px", marginBottom: 14 }}>
        {c.sport}
      </span>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350, flex: 1 }}>{c.bio}</p>
    </div>
  )
}

/* ─────────────────────────────────────────
   TESTIMONIAL CARD + CAROUSEL (unchanged)
───────────────────────────────────────── */
function TestimonialCard({ t }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div style={{ height: CARD_H, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 20px 20px", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>{t.name}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#A6A39E", margin: 0 }}>{t.school}</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#2a2a2a", marginLeft: 10 }}>
          {imgOk
            ? <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setImgOk(false)} loading="lazy" decoding="async" />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "rgba(255,255,255,0.3)" }}>{t.name[0]}</span>
              </div>}
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 12, flexShrink: 0 }} />
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.55, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>{t.quote}</p>
    </div>
  )
}

const GAP = 20
const CARD_H = 230
function getVisibleCount(w) { if (w < 640) return 1; if (w < 1024) return 2; return 3 }

function TestimonialsCarousel() {
  const N = TESTIMONIALS.length
  const [visible, setVisible] = useState(() => typeof window !== "undefined" ? getVisibleCount(window.innerWidth) : 3)
  useEffect(() => {
    const onResize = () => setVisible(getVisibleCount(window.innerWidth))
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const items = [...TESTIMONIALS.slice(N - visible), ...TESTIMONIALS, ...TESTIMONIALS.slice(0, visible)]
  const OFFSET = visible

  const wrapRef = useRef(null), trackRef = useRef(null), idxRef = useRef(OFFSET), timerRef = useRef(null), busyRef = useRef(false)
  const [dot, setDot] = useState(0)
  const [cardW, setCardW] = useState(0)
  const cardWRef = useRef(0)
  const cw = () => cardWRef.current

  const jump = (idx) => { if (!trackRef.current) return; const w = cw(); trackRef.current.style.transition = "none"; trackRef.current.style.transform = `translateX(-${idx * (w + GAP)}px)`; idxRef.current = idx }
  const slide = (idx) => {
    if (!trackRef.current) return
    const w = cw()
    trackRef.current.style.transition = "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)"
    trackRef.current.style.transform = `translateX(-${idx * (w + GAP)}px)`
    idxRef.current = idx
    setTimeout(() => { if (idx >= OFFSET + N) jump(idx - N); if (idx < OFFSET) jump(idx + N); busyRef.current = false }, 720)
  }
  const move = (dir) => { if (busyRef.current) return; busyRef.current = true; const next = idxRef.current + dir; setDot((next - OFFSET + N) % N); slide(next) }
  const resetTimer = () => { clearInterval(timerRef.current); timerRef.current = setInterval(() => move(1), 4000) }
  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return
      const w = wrapRef.current.getBoundingClientRect().width || wrapRef.current.offsetWidth
      if (w > 0) { cardWRef.current = (w - GAP * (visible - 1)) / visible; setCardW(cardWRef.current) }
      jump(visible)
    }
    const ro = new ResizeObserver(update)
    if (wrapRef.current) ro.observe(wrapRef.current)
    requestAnimationFrame(() => { update(); resetTimer() })
    return () => { ro.disconnect(); clearInterval(timerRef.current) }
  }, [visible])

  const handlePrev = () => { move(-1); resetTimer() }
  const handleNext = () => { move(1); resetTimer() }

  return (
    <section style={{ background: C.ink, width: "100%", padding: "80px 0 96px" }}>
      <div style={{ width: "100%", padding: "0 clamp(24px,6vw,80px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 18px", flexShrink: 0 }}>Testimonials</span>
          <div style={{ textAlign: "right" }}>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(24px,2.8vw,42px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 20px" }}>
              What some of our <em style={{ fontStyle: "italic", color: C.accent }}>student-athletes</em> have to say.
            </h2>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {[{ label: "←", fn: handlePrev }, { label: "→", fn: handleNext }].map(({ label, fn }) => (
                <button key={label} onClick={fn} style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}>{label}</button>
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
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function AthleticPage() {
  const px = "clamp(24px,6vw,80px)"
  const [openStep, setOpenStep] = useState(null)

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section style={{ position: "relative", width: "100%", minHeight: "62vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(14,14,14,0.5) 0%, rgba(14,14,14,0.78) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#1a1010 0%,#2d1518 100%)" }} />
        <img
          src={IMG.hero}
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          fetchpriority="high" loading="eager" decoding="async" />

        <div style={{ position: "relative", zIndex: 2, padding: `clamp(110px,15vw,190px) ${px} clamp(56px,7vw,88px)`, width: "100%" }}>
          <span style={{ display: "inline-block", marginBottom: 22, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "5px 14px" }}>
            AddedSport
          </span>

          <h1 className="fraunces-display" style={{ fontSize: "clamp(30px,4.2vw,60px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: "#fff", maxWidth: 720, margin: "0 0 20px" }}>
            Get your athlete recruited by{" "}
            <em style={{ color: C.accent }}>people who have been recruited.</em>
          </h1>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.3vw,17px)", color: "rgba(255,255,255,0.72)", margin: "0 0 32px", fontWeight: 350, maxWidth: 540, lineHeight: 1.65 }}>
            AddedSport places student-athletes into the right college sports programme, not just any offer. Every counselor
            on our team competed at a national, collegiate or professional level, so your child is guided by someone who
            has walked the exact path ahead of them.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <a href="#contact" style={{ display: "inline-block", background: C.accent, color: "#fff", borderRadius: 999, padding: "15px 38px", fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentDeep}
              onMouseLeave={e => e.currentTarget.style.background = C.accent}>
              Book a consultation
            </a>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>
              Take the first step towards your next level.
            </span>
          </div>
        </div>
      </section>

      {/* ══ 2. STATS ══ */}
      <section style={{ background: C.cream, padding: `60px ${px}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Fraunces',serif", fontOpticalSizing: "auto", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, color: C.accent, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.stone, margin: 0, lineHeight: 1.55 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 3. PROOF POINT / PLACEMENTS ══ */}
      <section style={{ background: C.cream, padding: `24px ${px} 80px` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ display: "inline-block", marginBottom: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.stone, border: "1px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "6px 16px" }}>
              Placements
            </span>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "-0.02em", color: C.ink, margin: "0 auto 16px", maxWidth: 700 }}>
              Recruited at some of the <em style={{ fontStyle: "italic", color: C.accent }}>most competitive</em> programmes in the world.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.stone, maxWidth: 560, margin: "0 auto", lineHeight: 1.65, fontWeight: 350 }}>
              Our student-athletes get recruited at some of the most competitive universities in the world, often with scholarship support.
            </p>
          </div>

          {/* Featured placement (Tufts) */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(200px,1fr) minmax(240px,1.6fr)", gap: 0, borderRadius: 18, overflow: "hidden", marginBottom: 20, background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ position: "relative", background: FEATURED_PLACEMENT.color, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24 }}>
              <img src={FEATURED_PLACEMENT.photo} alt="" onError={e => e.currentTarget.style.display = "none"}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.32 }}
                loading="lazy" decoding="async" />
              <span style={{ position: "relative", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>{FEATURED_PLACEMENT.school}</span>
              <span style={{ position: "relative", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)" }}>ATHLETE PHOTO</span>
            </div>
            <div style={{ padding: "28px 32px" }}>
              <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.stone, background: C.creamWarm, borderRadius: 999, padding: "4px 12px", marginBottom: 14 }}>{FEATURED_PLACEMENT.sport}</span>
              <h3 className="fraunces-heading" style={{ fontSize: "clamp(20px,2vw,28px)", color: C.ink, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{FEATURED_PLACEMENT.school}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13, color: C.accent, margin: "0 0 12px" }}>{FEATURED_PLACEMENT.athletes}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350 }}>{FEATURED_PLACEMENT.body}</p>
            </div>
          </div>

          {/* 4-up placement grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
            {PLACEMENTS.map((p, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ position: "relative", background: p.color, height: 96, display: "flex", alignItems: "center", padding: "0 18px" }}>
                  <img src={p.photo} alt="" onError={e => e.currentTarget.style.display = "none"}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
                    loading="lazy" decoding="async" />
                  <span style={{ position: "relative", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>{p.school}</span>
                </div>
                <div style={{ padding: "18px 18px 22px" }}>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stoneLight, margin: "0 0 8px" }}>{p.sport}</p>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13, color: C.accent, margin: "0 0 8px" }}>{p.athletes}</p>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, lineHeight: 1.6, color: C.stone, margin: 0, fontWeight: 350 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* banner */}
          <div style={{ background: C.maroon, borderRadius: 14, padding: "18px 28px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#F0C94A", fontSize: 18, fontWeight: 700, lineHeight: 1 }}>+</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#fff", fontWeight: 500 }}>
              Multiple Division I scholarship offers across tennis, soccer, golf and swimming.
            </span>
          </div>
        </div>
      </section>

      {/* ══ 4. OUR SERVICE ══ */}
      <section style={{ background: C.creamSoft, padding: `72px ${px}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ display: "inline-block", marginBottom: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.stone, border: "1px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "6px 16px" }}>
              Our Service
            </span>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "-0.02em", color: C.ink, margin: "0 auto 16px", maxWidth: 640 }}>
              More than recruitment. <em style={{ fontStyle: "italic", color: C.accent }}>Athlete development.</em>
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.stone, maxWidth: 640, margin: "0 auto", lineHeight: 1.7, fontWeight: 350 }}>
              Getting recruited is the goal, but it is the work in the years and months before that makes it happen. We build
              your athlete's profile the way college coaches actually evaluate it, then put it in front of the right people at the right time.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
            {SERVICE_ITEMS.map((item, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, padding: "26px 22px" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 13, color: C.stoneLight }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 15, color: C.ink, margin: "8px 0 8px" }}>{item.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350 }}>{item.body}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, lineHeight: 1.75, color: C.stone, maxWidth: 720, margin: "0 auto", textAlign: "center", fontWeight: 350 }}>
            And because the best athletic offer should also be the right academic home, our guidance covers the application
            alongside the recruitment, so your athlete is set up to succeed on and off the field.
          </p>
        </div>
      </section>

      {/* ══ 5. GET ADVICE FROM THE BEST ══ */}
      <section style={{ background: C.cream, padding: `72px ${px}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ display: "inline-block", marginBottom: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.stone, border: "1px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "6px 16px" }}>
              Our Counselors
            </span>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "-0.02em", color: C.ink, margin: "0 auto 16px", maxWidth: 640 }}>
              Guided by <em style={{ fontStyle: "italic", color: C.accent }}>athletes</em> who have done it.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.stone, maxWidth: 640, margin: "0 auto", lineHeight: 1.7, fontWeight: 350 }}>
              Every AddedSport counselor has competed at a level your athlete is aiming for. They have been recruited, played
              in college, represented their country or turned professional. That lived experience is the difference between advice and insight.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {COUNSELORS.map((c, i) => <CounselorCard key={i} c={c} />)}
          </div>
        </div>
      </section>

      {/* ══ 6. HOW IT WORKS ══ */}
      <section style={{ background: C.ink, width: "100%", padding: `64px ${px}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1a", maxHeight: 380 }}>
              <img src={IMG.journey} alt="" onError={e => e.currentTarget.style.display = "none"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy" decoding="async" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ display: "inline-block", marginBottom: 20, alignSelf: "flex-end", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "6px 16px" }}>
                How It Works
              </span>
              <h2 className="fraunces-heading" style={{ fontSize: "clamp(24px,2.8vw,40px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 32px", textAlign: "right" }}>
                From prospect to <em style={{ fontStyle: "italic", color: C.accent }}>admitted student-athlete.</em>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 440, marginLeft: "auto" }}>
                {JOURNEY_STEPS.map((step, i) => (
                  <AccordionItem key={i} item={step} isOpen={openStep === i} onToggle={() => setOpenStep(openStep === i ? null : i)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. TESTIMONIALS ══ */}
      <TestimonialsCarousel />

      {/* ══ 8. FINAL CTA ══ */}
      <section id="contact" style={{ background: C.cream, padding: `80px ${px}`, textAlign: "center" }}>
        <span style={{ display: "inline-block", marginBottom: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.stone, border: "1px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "6px 16px" }}>
          Get Started
        </span>

        <h2 className="fraunces-heading" style={{ fontSize: "clamp(26px,3.5vw,52px)", letterSpacing: "-0.02em", color: C.ink, margin: "0 0 20px" }}>
          Take your first step towards <em style={{ fontStyle: "italic", color: C.accent }}>getting recruited.</em>
        </h2>

        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.7, color: C.stone, maxWidth: 600, margin: "0 auto 36px", fontWeight: 350 }}>
          The athletes who get recruited start early and start with the right guidance. Book a consultation and we will
          tell you exactly where your child stands and what it takes to get to the next level.
        </p>

        <a href="#" style={{ display: "inline-block", background: C.ink, color: "#fff", borderRadius: 999, padding: "14px 36px", fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "background 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.background = C.inkSoft}
          onMouseLeave={e => e.currentTarget.style.background = C.ink}>
          Book a consultation
        </a>
      </section>

      <Footer />
    </div>
  )
}
