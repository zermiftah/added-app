import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  accent: "#C8354B", accentDeep: "#9E2538",
}

/* ── Stats ── */
const STATS = [
  { value: "3170+", label: "students guided across 12 countries" },
  { value: "20%",   label: "Ivy acceptance rate, 5× the global average of 4%" },
  { value: "812+",  label: "Offers from top-20 universities" },
  { value: "3:1",   label: "Each student admitted to at least 3 of their top choices" },
]

/* ── Consultation bullets ── */
const CONSULT_ITEMS = [
  {
    title: "Where your child stands right now",
    body: "An honest assessment of their profile and how they compare to successful applicants at their target schools.",
  },
  {
    title: "What it would actually take to get in",
    body: "A clear-eyed look at strengths, gaps, and the specific things that would move the needle on their application.",
  },
  {
    title: "How AE works – and what we'd build for your child",
    body: "We'll walk you through our approach and the personalised roadmap we'd build for your child.",
  },
  {
    title: "A plan with options",
    body: "You'll leave with 2–3 concrete paths forward, each matched to your child's goals, timeline, and your family's needs.",
  },
]

/* ── What we do accordion ── */
const SERVICES = [
  {
    title: "Profile Evaluation",
    body: "An assessment of where your child stands and how they compare to successful applicants at their target schools.",
  },
  {
    title: "Profile building",
    body: "Every course, activity, and summer decision that's right for your child.",
  },
  {
    title: "Essay Development",
    body: "Help with every draft, from blank page to the final version.",
  },
  {
    title: "Application Management",
    body: "Every deadline, portal, and recommendation is managed. Nothing falls through the cracks.",
  },
  {
    title: "Academic Planning",
    body: "Subject selection and rigor aligned with target school requirements.",
  },
  {
    title: "Finish line",
    body: "We help you run the last mile for everything you need.",
  },
]

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    name: "Linda",
    school: "Harvard'28",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linda&backgroundColor=b6e3f4",
    quote: "With everything going on, AddedEducation helped me figure out my activities and align my major, making sure I got into the right programs that fit my needs and dreams.",
  },
  {
    name: "Yosie",
    school: "Yale'28",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yosie&backgroundColor=ffd5dc",
    quote: "I had a lot of interests but no common thread. AE hand-held me throughout — ensuring my application reflected who I really was.",
  },
  {
    name: "Ethan",
    school: "Stanford'29",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=d5f0f0",
    quote: "With my counselor's guidance, I took my engineering projects, environmental leadership, and artistic portfolio and turned them into one standout application. I felt supported throughout the whole process.",
  },
  {
    name: "Lyla",
    school: "Columbia'29",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lyla&backgroundColor=ffecd2",
    quote: "Added Education was my rock. What stood out was their ability to connect the dots across all my projects — links I wouldn't have noticed myself.",
  },
  {
    name: "Aryan",
    school: "Cornell'29",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan&backgroundColor=c0d4f5",
    quote: "With everything going on, AddedEducation helped me figure out my activities and align my major — making sure I got into the right programs that fit my needs and dreams.",
  },
  {
    name: "Sondre",
    school: "RISD'29",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sondre&backgroundColor=d5e8f5",
    quote: "I've always had a passion for animation and art. With AddedEducation's guidance, I built a strong foundation and navigated the application process seamlessly.",
  },
]

/* ─────────────────────────────────────────
   ACCORDION ITEM
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
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px", background: "none", border: "none",
        cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ color: C.accent, fontSize: 16, fontWeight: 500, flexShrink: 0, lineHeight: 1 }}>
          {isOpen ? "−" : "+"}
        </span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>
          {item.title}
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? height + 20 : 0, opacity: isOpen ? 1 : 0,
        overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s ease",
      }}>
        <div ref={contentRef} style={{
          fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.stone,
          lineHeight: 1.65, padding: "0 16px 13px 44px",
        }}>{item.body}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   TESTIMONIALS CAROUSEL — 4 visible
───────────────────────────────────────── */
const GAP    = 16
function getVisibleCount(w) {
  if (w < 640) return 1
  if (w < 1024) return 2
  return 3
}
const CARD_H  = 230

function TestimonialCard({ t }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div style={{
      height: CARD_H, background: "#1A1A1A",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
      padding: "20px", display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>{t.name}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#A6A39E", margin: 0 }}>{t.school}</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#2a2a2a", marginLeft: 10 }}>
          {imgOk
            ? <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setImgOk(false)}  loading="lazy" decoding="async"/>
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

function TestimonialsCarousel() {
  const N = TESTIMONIALS.length
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? getVisibleCount(window.innerWidth) : 3
  )
  useEffect(() => {
    const onResize = () => setVisible(getVisibleCount(window.innerWidth))
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])
  const items = [
    ...TESTIMONIALS.slice(N - visible),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, visible),
  ]
  const OFFSET = visible

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
      const w = wrapRef.current.getBoundingClientRect().width || wrapRef.current.offsetWidth
      if (w > 0) {
        cardWRef.current = (w - GAP * (visible - 1)) / visible
        setCardW(cardWRef.current)
      }
      jump(OFFSET)
    }
    const ro = new ResizeObserver(update)
    if (wrapRef.current) ro.observe(wrapRef.current)
    requestAnimationFrame(() => { update(); resetTimer() })
    return () => { ro.disconnect(); clearInterval(timerRef.current) }
  }, [visible])

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

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 18px",
          }}>Testimonials</span>
          <div style={{ textAlign: "right" }}>
            <h2 className="fraunces-heading" style={{
              fontSize: "clamp(24px,2.8vw,42px)", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: "#fff", margin: "0 0 20px",
            }}>
              Hear it from<br />students <em style={{ fontStyle: "italic", color: C.accent }}>who made it.</em>
            </h2>
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

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function FullServicePage() {
  const px = "clamp(24px,6vw,80px)"
  const [openService, setOpenService] = useState(null)

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section style={{ position: "relative", width: "100%", minHeight: "48vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(14,14,14,0.35) 0%, rgba(14,14,14,0.70) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)" }} />
        <img
          src="https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567182758_admission_hero.webp"
          alt=""
          onError={e => e.currentTarget.style.display = "none"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
         fetchpriority="high" loading="eager" decoding="async"/>
        <div style={{ position: "relative", zIndex: 2, padding: `clamp(100px,14vw,180px) ${px} clamp(48px,6vw,80px)`, width: "100%" }}>
          <span style={{
            display: "inline-block", marginBottom: 16,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "5px 14px",
          }}>Academic Counseling</span>

          <h1 className="fraunces-display" style={{
            fontSize: "clamp(28px,3.8vw,56px)", lineHeight: 1.06,
            letterSpacing: "-0.025em", color: "#fff", maxWidth: 640, margin: "0 0 12px",
          }}>
            Full-Service <em style={{ color: C.accent }}>University Guidance</em>
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "0 0 8px", fontStyle: "italic" }}>
            From first draft to acceptance letter.
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, maxWidth: 400, lineHeight: 1.65, fontWeight: 350 }}>
            We handle everything: application strategy, essays, interviews, and every deadline in between.
          </p>
        </div>
      </section>

      {/* ══ 2. STATS ══ */}
      <section style={{ background: C.cream, padding: `56px ${px}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 400, color: C.accent, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.stone, margin: 0, lineHeight: 1.55 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 3. ONE COUNSELOR ══ */}
      <section style={{ background: C.ink, padding: `64px ${px}` }}>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,2.2vw,30px)", fontWeight: 400, color: "#fff", textAlign: "center", margin: "0 0 48px", letterSpacing: "-0.01em" }}>
          Your child works with one counselor,{" "}
          <em style={{ fontStyle: "italic", color: C.accent }}>start to finish.</em>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 56, maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
          {/* left image */}
          <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: "#2a2a2a" }}>
            <img
              src="https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567182686_start_to_finish.webp"
              alt=""
              onError={e => e.currentTarget.style.display = "none"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
             loading="lazy" decoding="async"/>
          </div>
          {/* right copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", margin: 0, fontWeight: 350 }}>
              Your university application is <strong style={{ color: "#fff" }}>your story</strong>, and it takes someone who <strong style={{ color: "#fff" }}>genuinely knows your child to tell it well.</strong>
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", margin: 0, fontWeight: 350 }}>
              We match your child with one counselor based on personality, because the counselor they <span style={{ color: C.accent, fontWeight: 600 }}>connect with</span> is the one they'll do their best work with.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 4. WHAT TO EXPECT ══ */}
      <section style={{ background: C.cream, padding: `72px ${px}` }}>
        <h2 className="fraunces-heading" style={{
          textAlign: "center", fontSize: "clamp(22px,2.8vw,40px)",
          letterSpacing: "-0.02em", color: C.ink, margin: "0 0 56px",
        }}>
          What to expect when you book a{" "}
          <em style={{ fontStyle: "italic", color: C.accent }}>consultation</em>?
        </h2>

        <style>{`
          .fs-expect-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; max-width: 1100px; margin: 0 auto; align-items: center; }
          .fs-expect-center { padding: 0 32px; }
          @media (max-width: 768px) {
            .fs-expect-grid { grid-template-columns: 1fr; gap: 32px; }
            .fs-expect-center { padding: 0; order: -1; }
            .fs-expect-photos { flex-direction: row !important; }
            .fs-expect-photos > div { flex: 1; }
          }
        `}</style>
        <div className="fs-expect-grid">
          {/* left photos */}
          <div className="fs-expect-photos" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["asset_1782567182705_8GcnRiF6LGYAU0IkaeGqyUADA5I", "asset_1782567178181_KdJz5db0hdxbuIYLtIg8ZRngU"].map(img => (
              <div key={img} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "4/3", background: C.creamWarm }}>
                <img src={`https://addededucation.com/addedapi/uploads/addededucation-assets/${img}.webp`} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => e.currentTarget.style.display = "none"}  loading="lazy" decoding="async"/>
              </div>
            ))}
          </div>

          {/* center bullets */}
          <div className="fs-expect-center" style={{ display: "flex", flexDirection: "column", gap: 28, textAlign: "center" }}>
            {CONSULT_ITEMS.map((item, i) => (
              <div key={i}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 15, color: C.ink, margin: "0 0 5px" }}>{item.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: C.stone, margin: 0, fontWeight: 350 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* right photos */}
          <div className="fs-expect-photos" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567178765_o9I3FbRMuRHkRnxplajjITeTi9M.webp", "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567179090_XE8FD73R78mEBCOY1PqW438OSQ.webp"].map(img => (
              <div key={img} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "4/3", background: C.creamWarm }}>
                <img src={`${img}`} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => e.currentTarget.style.display = "none"}  loading="lazy" decoding="async"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. WHAT WE DO — dark card with accordion + image ══ */}
      <style>{`
        .fs-whatwedo-section { background: ${C.cream}; padding: 0 ${px} 72px; }
        .fs-whatwedo-card { background: ${C.ink}; border-radius: 20px; overflow: hidden; padding: 56px; }
        .fs-whatwedo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        @media (max-width: 768px) {
          .fs-whatwedo-section { padding: 0 0 56px; }
          .fs-whatwedo-card { border-radius: 0; padding: 48px 24px; }
          .fs-whatwedo-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
      <section className="fs-whatwedo-section">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fs-whatwedo-card">
            <div className="fs-whatwedo-grid">

              {/* Left: heading + accordion */}
              <div>
                <h2 className="fraunces-heading" style={{
                  fontSize: "clamp(24px,2.8vw,40px)", lineHeight: 1.1,
                  letterSpacing: "-0.02em", color: "#fff", margin: "0 0 12px",
                }}>
                  What we do for <em style={{ fontStyle: "italic", color: C.accent }}>your<br />child.</em>
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.6)", margin: "0 0 28px", fontWeight: 350 }}>
                  From building the right profile to submitting the final application – we cover every part of the process, including:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {SERVICES.map((s, i) => (
                    <AccordionItem
                      key={i}
                      item={s}
                      isOpen={openService === i}
                      onToggle={() => setOpenService(openService === i ? null : i)}
                    />
                  ))}
                </div>
              </div>

              {/* Right: image */}
              <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "3/4", background: "#2a2a2a" }}>
                <img
                  src="https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567177114_your_child.webp"
                  alt=""
                  onError={e => e.currentTarget.style.display = "none"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                 loading="lazy" decoding="async"/>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. WHY IT MATTERS ══ */}
      <section style={{ background: C.cream, padding: `0 ${px} 80px` }}>
        <span style={{
          display: "inline-block", marginBottom: 20,
          fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          border: `1px solid rgba(0,0,0,0.18)`, borderRadius: 999,
          padding: "7px 18px", color: C.stone,
        }}>Why It Matters</span>

        <h2 className="fraunces-heading" style={{
          fontSize: "clamp(26px,3.5vw,50px)", letterSpacing: "-0.02em",
          color: C.ink, margin: "0 0 16px", maxWidth: 560,
        }}>
          Working with the right counselor <em style={{ fontStyle: "italic", color: C.accent }}>changes everything.</em>
        </h2>

        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.7, color: C.stone, maxWidth: 520, margin: "0 0 32px", fontWeight: 350 }}>
          Your journey is unique. The right counselors tells your story, find out how to use your spike to stand out in a sea of applicants.
        </p>

        <a href="#"
          style={{
            display: "inline-block", background: C.ink, color: "#fff",
            borderRadius: 999, padding: "13px 32px",
            fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500,
            textDecoration: "none", transition: "background 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.inkSoft}
          onMouseLeave={e => e.currentTarget.style.background = C.ink}
        >
          Book a free 30-minute call
        </a>
      </section>

      {/* ══ 7. TESTIMONIALS ══ */}
      <TestimonialsCarousel />

      <Footer />
    </div>
  )
}
