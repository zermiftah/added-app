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

/* ── Stats ── */
const STATS = [
  { value: "2000+", label: "coach connections across tennis, soccer, golf, swimming, and 18 other sports" },
  { value: "93%",   label: "of students placed at a top-3 target school" },
  { value: "614+",  label: "Kids recruited at top universities" },
]

/* ── Athletic support bullets ── */
const ATHLETIC_BULLETS = [
  {
    title: "Find your best fit",
    body: "We advise on the right tournaments, camps, and divisions to attend – and which universities will best support your child's sport and goals.",
  },
  {
    title: "Connect with coaches",
    body: "With 2,000+ coach connections across tennis, soccer, golf, and swimming, we'll introduce your child directly.",
  },
  {
    title: "Build your athletic brand",
    body: "We create the highlight reel, personal profile, and achievement portfolio that makes coaches stop and take notice.",
  },
]

/* ── Academic support cards ── */
const ACADEMIC_CARDS = [
  {
    title: "Application Guidance",
    body: "Every deadline, portal, requirements specific to athletic recruitment – fully managed.",
  },
  {
    title: "Scholarship Strategy",
    body: "We map your child's financial aid options early so you can focus on school fit.",
  },
  {
    title: "Ongoing Dedicated Support",
    body: "Weekly check-ins and WhatsApp access keep your child on track.",
  },
]

/* ── How we take your child accordion ── */
const JOURNEY_STEPS = [
  {
    title: "Profile Evaluation",
    body: "We start with a complimentary 1-on-1 session to get a true picture of your child's strengths, athletic level, and academic profile.",
  },
  {
    title: "Meet your Team",
    body: "After mapping your child's profile, we assign the right counselors and specialists. You'll always have a direct point of contact.",
  },
  {
    title: "Craft the Roadmap",
    body: "We produce a tailored 12–24 month plan: target schools, coach outreach calendar, academic milestones, and essay angles.",
  },
]

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    name: "Saina",
    school: "MIT'27",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/saina.jpg",
    quote: "Getting into top universities isn't just about grades. I'm glad I started planning early. AddedEducation really helped me make my profile shine.",
  },
  {
    name: "Eren",
    school: "Tufts'27",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/eren.jpg",
    quote: "They gave me benchmarks for my grades, helped me plan my tournament schedule, and guided me through reaching out to coaches and the CommonApp. They helped me find the balance with everything.",
  },
  {
    name: "Anjan",
    school: "CMU'28",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/anjan.jpg",
    quote: "AddedEducation connected me with coaches and helped me understand what they were looking for, and what in my profile could set me apart.",
  },
  {
    name: "Mik",
    school: "Dartmouth'27",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/mik.jpg",
    quote: "AddedEducation helped me define my purpose and clarify my future goals, leading to acceptances at Brown, Dartmouth, UC Berkeley, and Notre Dame.",
  },
  {
    name: "Alfonso",
    school: "Vassar'28",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/alfonso.jpg",
    quote: "Choose your best tournaments and videos and send them to everyone. You never know who might be looking.",
  },
  {
    name: "Tim",
    school: "UMass Amherst'28",
    photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/tim.jpg",
    quote: "Work on your communication and practice interviews often. An outgoing personality and showing genuine interest can make a world of difference.",
  },
]

/* ─────────────────────────────────────────
   ACCORDION ITEM (same pattern as Tutoring FAQ)
───────────────────────────────────────── */
function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight)
  }, [isOpen])

  return (
    <div style={{
      background: isOpen ? "#fff" : "rgba(255,255,255,0.92)",
      borderRadius: 8, overflow: "hidden", marginBottom: 6,
      transition: "background 0.2s",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, flexShrink: 0,
          fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 500,
          color: C.accent, lineHeight: 1,
        }}>
          {isOpen ? "−" : "+"}
        </span>
        <span style={{
          fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500,
          color: C.ink, lineHeight: 1.4,
        }}>{item.title}</span>
      </button>
      <div style={{
        maxHeight: isOpen ? height + 20 : 0,
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s ease",
      }}>
        <div ref={contentRef} style={{
          fontFamily: "'Inter',sans-serif", fontSize: 13,
          color: C.stone, lineHeight: 1.65,
          padding: "0 16px 14px 46px",
        }}>{item.body}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────── */
function TestimonialCard({ t }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div style={{
      height: CARD_H, background: "#1A1A1A",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
      padding: "20px 20px 20px", display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>{t.name}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#A6A39E", margin: 0 }}>{t.school}</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#2a2a2a", marginLeft: 10 }}>
          {imgOk
            ? <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setImgOk(false)} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "rgba(255,255,255,0.3)" }}>{t.name[0]}</span>
              </div>
          }
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 12, flexShrink: 0 }} />
      <p style={{
        fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600,
        color: "#fff", lineHeight: 1.55, margin: 0, overflow: "hidden",
        display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical",
      }}>{t.quote}</p>
    </div>
  )
}

/* ─────────────────────────────────────────
   TESTIMONIALS CAROUSEL (infinite, same as home)
───────────────────────────────────────── */
const GAP = 20
const VISIBLE = 4
const CARD_H = 230

function TestimonialsCarousel() {
  const N = TESTIMONIALS.length
  const items = [
    ...TESTIMONIALS.slice(N - VISIBLE),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, VISIBLE),
  ]
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

  const jump = (idx) => {
    if (!trackRef.current) return
    const w = cw()
    trackRef.current.style.transition = "none"
    trackRef.current.style.transform = `translateX(-${idx * (w + GAP)}px)`
    idxRef.current = idx
  }
  const slide = (idx) => {
    if (!trackRef.current) return
    const w = cw()
    trackRef.current.style.transition = "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)"
    trackRef.current.style.transform = `translateX(-${idx * (w + GAP)}px)`
    idxRef.current = idx
    setTimeout(() => {
      if (idx >= OFFSET + N) jump(idx - N)
      if (idx < OFFSET)      jump(idx + N)
      busyRef.current = false
    }, 720)
  }
  const move = (dir) => {
    if (busyRef.current) return
    busyRef.current = true
    const next = idxRef.current + dir
    setDot((next - OFFSET + N) % N)
    slide(next)
  }
  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => move(1), 4000)
  }
  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return
      cardWRef.current = (wrapRef.current.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE
      setCardW(cardWRef.current)
      jump(OFFSET)
    }
    const ro = new ResizeObserver(update)
    if (wrapRef.current) ro.observe(wrapRef.current)
    requestAnimationFrame(() => { update(); resetTimer() })
    return () => { ro.disconnect(); clearInterval(timerRef.current) }
  }, [])

  const handlePrev = () => { move(-1); resetTimer() }
  const handleNext = () => { move(1);  resetTimer() }
  const handleDot  = (i) => {
    if (busyRef.current) return
    busyRef.current = true
    setDot(i); slide(OFFSET + i); resetTimer()
  }

  return (
    <section style={{ background: C.ink, width: "100%", padding: "80px 0 96px" }}>
      <div style={{ width: "100%", padding: "0 clamp(24px,6vw,80px)" }}>

        {/* Header: pill left, heading + arrows right */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 18px",
            flexShrink: 0,
          }}>Testimonials</span>
          <div style={{ textAlign: "right" }}>
            <h2 className="fraunces-heading" style={{
              fontSize: "clamp(24px,2.8vw,42px)", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: "#fff", margin: "0 0 20px",
            }}>
              What some of our{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>student-athletes</em>{" "}
              have to say.
            </h2>
            {/* Prev / Next arrows — right-aligned under heading */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {[{ label: "←", fn: handlePrev }, { label: "→", fn: handleNext }].map(({ label, fn }) => (
                <button key={label} onClick={fn} style={{
                  width: 44, height: 44, borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.2)", background: "transparent",
                  color: "#fff", fontSize: 16, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport */}
        <div ref={wrapRef} style={{ overflow: "hidden", height: CARD_H }}>
          <div ref={trackRef} style={{ display: "flex", gap: GAP, height: CARD_H, willChange: "transform" }}>
            {items.map((t, i) => (
              <div key={i} style={{ width: cardW || cw(), flexShrink: 0 }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => handleDot(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === dot ? 24 : 8, height: 8, borderRadius: 999, border: "none",
              background: i === dot ? C.accent : "rgba(255,255,255,0.2)",
              cursor: "pointer", padding: 0, transition: "all 0.3s",
              minWidth: 24, minHeight: 24, display: "inline-flex", alignItems: "center", justifyContent: "center",
            }} />
          ))}
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
      <section style={{ position: "relative", width: "100%", minHeight: "52vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(14,14,14,0.45) 0%, rgba(14,14,14,0.68) 100%)" }} />
        {/* fallback bg */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#1a1010 0%,#2d1518 100%)" }} />
        <img
          src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Athletic+Page/athletic+hero.jpg"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />

        <div style={{ position: "relative", zIndex: 2, padding: `clamp(100px,14vw,180px) ${px} clamp(48px,6vw,80px)`, width: "100%" }}>
          {/* eyebrow */}
          <span style={{
            display: "inline-block", marginBottom: 20,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "5px 14px",
          }}>Athletic Counseling</span>

          <h1 className="fraunces-display" style={{
            fontSize: "clamp(28px,3.8vw,56px)", lineHeight: 1.06,
            letterSpacing: "-0.025em", color: "#fff", maxWidth: 640, margin: "0 0 16px",
          }}>
            University Admissions Counseling For{" "}
            <em style={{ color: C.accent }}>Student-Athletes</em>
          </h1>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.3vw,17px)", color: "rgba(255,255,255,0.72)", margin: 0, fontWeight: 350, maxWidth: 480 }}>
            We work with student-athletes to build a profile that gets noticed by coaches, scouts, and admissions officers.
          </p>
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

      {/* ══ 3. ATHLETIC & ACADEMIC SUPPORT ══ */}
      <section style={{ background: C.cream, padding: `48px ${px} 72px` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* heading */}
        <h2 className="fraunces-heading" style={{
          textAlign: "center", fontSize: "clamp(26px,3vw,44px)",
          letterSpacing: "-0.02em", color: C.ink, margin: "0 0 48px",
        }}>
          Athletic <em style={{ fontStyle: "italic", color: C.accent }}>and</em> academic support,{" "}
          <em style={{ fontStyle: "italic" }}>together.</em>
        </h2>

        {/* ── Athletic Support ── */}
        {/* pill */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <span style={{
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "10px 28px", borderRadius: 999,
            background: C.inkSoft, color: "#fff",
          }}>Athletic Support</span>
        </div>

        {/* 3-col: left photos | center copy | right photos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, alignItems: "center", marginBottom: 64 }}>
          {/* left photos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["AUz2BLwkpTIHYJiFse3sOCC8Yk","fKILhnpyIz6Ucwp5qZd70qfgF4"].map(img => (
              <div key={img} style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: C.creamWarm }}>
                <img src={`https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Athletic+Page/${img}.jpg`} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => e.currentTarget.style.display = "none"} />
              </div>
            ))}
          </div>

          {/* center copy */}
          <div style={{ textAlign: "center", padding: "0 32px" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.7, color: C.stone, margin: "0 auto 36px", maxWidth: 520, fontWeight: 350 }}>
              Most families don't realise how strategic the recruitment process is. We guide the whole journey: from identifying the right schools and camps to opening coach conversations, managing the application, and securing your offer.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {ATHLETIC_BULLETS.map((b, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 15, color: C.ink, margin: "0 0 5px" }}>{b.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350 }}>{b.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* right photos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["jPODV665keZha2lLPnOaEimvU","wiq7C3s1ppEIBtfdFWpSfhMtto"].map(img => (
              <div key={img} style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: C.creamWarm }}>
                <img src={`https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Athletic+Page/${img}.jpg`} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => e.currentTarget.style.display = "none"} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Academic Support ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <span style={{
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "10px 28px", borderRadius: 999,
            background: C.inkSoft, color: "#fff",
          }}>Academic Support</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {ACADEMIC_CARDS.map((c, i) => (
            <div key={i} style={{
              background: C.creamSoft, border: `1px solid rgba(0,0,0,0.06)`,
              borderRadius: 14, padding: "28px 24px", textAlign: "center",
            }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 15, color: C.accent, margin: "0 0 10px" }}>{c.title}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350 }}>{c.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ══ 4. HOW WE TAKE YOUR CHILD ══ */}
      <section style={{ background: C.ink, width: "100%", padding: `48px ${px}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          {/* Left: photo with rounded corners + padding */}
          <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1a", maxHeight: 340 }}>
            <img
              src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Athletic+Page/student+athlete.jpeg"
              alt=""
              onError={e => e.currentTarget.style.display = "none"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Right: heading + accordion */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 className="fraunces-heading" style={{
              fontSize: "clamp(26px,3vw,44px)", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: "#fff",
              margin: "0 0 36px", textAlign: "right",
            }}>
              How we take your<br />child to{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>admitted<br />student-athlete</em>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 420, marginLeft: "auto" }}>
              {JOURNEY_STEPS.map((step, i) => (
                <AccordionItem
                  key={i}
                  item={step}
                  isOpen={openStep === i}
                  onToggle={() => setOpenStep(openStep === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>
      <section style={{ background: C.cream, padding: `72px ${px}`, textAlign: "center" }}>
        <span style={{
          display: "inline-block", marginBottom: 20,
          fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase", color: C.stone,
          border: `1px solid rgba(0,0,0,0.15)`, borderRadius: 999, padding: "6px 16px",
        }}>Why It Matters</span>

        <h2 className="fraunces-heading" style={{
          fontSize: "clamp(26px,3.5vw,52px)", letterSpacing: "-0.02em",
          color: C.ink, margin: "0 0 20px",
        }}>
          Working with the right counselor<br />
          <em style={{ fontStyle: "italic", color: C.accent }}>changes everything.</em>
        </h2>

        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.7,
          color: C.stone, maxWidth: 600, margin: "0 auto 36px", fontWeight: 350,
        }}>
          Athletic recruitment is one of the most misunderstood paths into a top university, and one of the most powerful. It's how our founders got into Stanford and UC Berkeley. It's why AE exists. And it's what we've specialised in since day one.
        </p>

        <a
          href="#"
          style={{
            display: "inline-block",
            background: C.ink, color: "#fff",
            borderRadius: 999, padding: "14px 36px",
            fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 500,
            textDecoration: "none", transition: "background 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.inkSoft}
          onMouseLeave={e => e.currentTarget.style.background = C.ink}
        >
          Book a free 30-minute call
        </a>
      </section>

      {/* ══ 6. TESTIMONIALS ══ */}
      <TestimonialsCarousel />

      <Footer />
    </div>
  )
}
