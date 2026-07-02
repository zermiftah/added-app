import { Reveal } from "../hooks/useReveal"
import { useState, useEffect, useRef, useCallback } from "react"

// ─── Edit testimonials + photo URL di sini ─────────────────────────────────
const TESTIMONIALS = [
  { name: "Linda",  school: "Harvard '29",    quote: "I could always count on them to respond within 24 hours. They made me feel so secure through the whole process.",                                                                                              photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linda&backgroundColor=b6e3f4" },
  { name: "Yosie",  school: "Yale '28",        quote: "I had a lot of interests but no common thread. AE hand-held me throughout, ensuring my application reflected who I really was.",                                                                               photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yosie&backgroundColor=ffd5dc" },
  { name: "Anna",   school: "UC Berkeley '29", quote: "They helped me transform my love for film and media into a powerful application narrative. The strategy and essay guidance were key to my acceptance.",                                                         photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna&backgroundColor=d1f0d1" },
  { name: "Lyla",   school: "Columbia '28",    quote: "AddedEducation was my rock. What stood out was their ability to connect the dots across all my projects, links I wouldn't have noticed myself.",                                                               photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lyla&backgroundColor=ffecd2" },
  { name: "Aryan",  school: "Cornell '29",     quote: "With everything going on, AddedEducation helped me figure out my activities and align my major, making sure I got into the right programs that fit my needs and dreams.",                                       photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan&backgroundColor=c0d4f5" },
  { name: "Ethan",  school: "Stanford '28",    quote: "With my counselor's guidance, I took my engineering projects, environmental leadership, and artistic portfolio and turned them into one standout application.",                                                 photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=d5f0f0" },
  { name: "Saina",  school: "MIT '27",         quote: "Getting into top universities isn't just about grades. I'm glad I started planning early. AddedEducation really helped me make my profile shine.",                                                            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saina&backgroundColor=ffe4e4" },
  { name: "Eren",   school: "Tufts '27",       quote: "They gave me benchmarks for my grades, helped me plan my tournament schedule, and guided me through reaching out to coaches and the CommonApp. They helped me find the balance with everything.",               photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eren&backgroundColor=e0d5f5" },
  { name: "Anjan",  school: "CMU '28",         quote: "AddedEducation connected me with coaches and helped me understand what they were looking for, and what in my profile could set me apart.",                                                                     photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjan&backgroundColor=f5f0d5" },
  { name: "Sondre", school: "RISD '28",        quote: "I've always had a passion for animation and art. With AddedEducation's guidance, I built a strong foundation and navigated the application process seamlessly.",                                               photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sondre&backgroundColor=d5e8f5" },
]
// ───────────────────────────────────────────────────────────────────────────

const GAP = 20
const CARD_HEIGHT = 280

function getVisible(w) {
  if (w < 640) return 1
  if (w < 1024) return 2
  return 3
}

function TestimonialCard({ t }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div style={{
      height: CARD_HEIGHT, background: "#1A1A1A",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
      padding: "24px 24px 28px", display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{t.name}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#A6A39E" }}>{t.school}</p>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#2a2a2a", marginLeft: 12 }}>
          {imgOk
            ? <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setImgOk(false)} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: "rgba(255,255,255,0.3)" }}>{t.name[0]}</span>
              </div>
          }
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 18, flexShrink: 0 }} />
      <p style={{
        fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: "#fff",
        lineHeight: 1.6, margin: 0, overflow: "hidden",
        display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical",
      }}>{t.quote}</p>
    </div>
  )
}

export default function TestimonialsSection() {
  const N = TESTIMONIALS.length

  // Reactive visible count based on viewport width
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? getVisible(window.innerWidth) : 3
  )

  useEffect(() => {
    const onResize = () => setVisible(getVisible(window.innerWidth))
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Rebuild cloned items when visible changes
  const items = [
    ...TESTIMONIALS.slice(N - visible),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, visible),
  ]
  const OFFSET_START = visible

  const wrapRef  = useRef(null)
  const trackRef = useRef(null)
  const indexRef = useRef(OFFSET_START)
  const timerRef = useRef(null)
  const busyRef  = useRef(false)
  const cardWRef = useRef(
    typeof window !== "undefined"
      ? Math.floor((Math.min(window.innerWidth - 48, 1280) - GAP * (visible - 1)) / visible)
      : 300
  )
  const [cardW, setCardW] = useState(cardWRef.current)

  // Update card width from ResizeObserver — zero DOM read
  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) {
          cardWRef.current = (w - GAP * (visible - 1)) / visible
          setCardW(cardWRef.current)
        }
      }
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [visible])

  const getCardWidth = useCallback(() => cardWRef.current || (wrapRef.current ? (wrapRef.current.offsetWidth - GAP * (visible - 1)) / visible : 300), [visible])

  const jumpTo = useCallback((idx) => {
    if (!trackRef.current) return
    const cw = getCardWidth()
    trackRef.current.style.transition = "none"
    trackRef.current.style.transform = `translateX(-${idx * (cw + GAP)}px)`
    indexRef.current = idx
  }, [getCardWidth])

  const slideTo = useCallback((idx) => {
    if (!trackRef.current) return
    const cw = getCardWidth()
    trackRef.current.style.transition = "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)"
    trackRef.current.style.transform = `translateX(-${idx * (cw + GAP)}px)`
    indexRef.current = idx
    setTimeout(() => {
      if (idx >= OFFSET_START + N) jumpTo(idx - N)
      if (idx < OFFSET_START)      jumpTo(idx + N)
      busyRef.current = false
    }, 720)
  }, [getCardWidth, N, OFFSET_START, jumpTo])

  const move = useCallback((dir) => {
    if (busyRef.current) return
    busyRef.current = true
    slideTo(indexRef.current + dir)
  }, [slideTo])

  const next = useCallback(() => move(1), [move])
  const prev = useCallback(() => move(-1), [move])

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 3000)
  }, [next])

  // Re-init when visible changes — recalculate card width first
  useEffect(() => {
    indexRef.current = OFFSET_START
    if (wrapRef.current) {
      const w = wrapRef.current.getBoundingClientRect().width
      if (w > 0) {
        cardWRef.current = (w - GAP * (visible - 1)) / visible
        setCardW(cardWRef.current)
      }
    }
    requestAnimationFrame(() => {
      jumpTo(OFFSET_START)
      resetTimer()
    })
    return () => clearInterval(timerRef.current)
  }, [visible, OFFSET_START, jumpTo, resetTimer])

  const handlePrev = () => { prev(); resetTimer() }
  const handleNext = () => { next(); resetTimer() }

  return (
    <section style={{ background: "#0E0E0E", width: "100%", padding: "80px 0 96px" }}>
      <div style={{ width: "100%", padding: "0 clamp(24px,6vw,80px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 18px",
          }}>Testimonials</span>
          <div style={{ textAlign: "right" }}>
            <h2 className="fraunces-heading" style={{ fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", marginBottom: 24 }}>
              Hear it from<br />students <em style={{ fontStyle: "italic", color: "#C8354B" }}>who made it.</em>
            </h2>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {[{ label: "←", fn: handlePrev, aria: "Previous testimonial" }, { label: "→", fn: handleNext, aria: "Next testimonial" }].map(({ label, fn, aria }) => (
                <button key={label} onClick={fn} aria-label={aria} style={{
                  width: 44, height: 44, borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.2)", background: "transparent",
                  color: "#fff", fontSize: 16, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport */}
        <div ref={wrapRef} style={{ overflow: "hidden", height: CARD_HEIGHT }}>
          <div ref={trackRef} style={{ display: "flex", gap: GAP, height: CARD_HEIGHT, willChange: "transform" }}>
            {items.map((t, i) => (
              <div key={i} style={{ width: cardW || 300, flexShrink: 0 }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
