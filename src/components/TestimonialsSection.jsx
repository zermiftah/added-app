import { Reveal } from "../hooks/useReveal"
import { useState, useEffect, useRef, useCallback } from "react"

// ─── Edit testimonials + photo URL di sini ─────────────────────────────────
const TESTIMONIALS = [
  { name: "Linda",  school: "Harvard '29",    quote: "I could always count on them to respond within 24 hours. They made me feel so secure through the whole process.",                                                                                              photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/linda.jpg" },
  { name: "Yosie",  school: "Yale '28",        quote: "I had a lot of interests but no common thread. AE hand-held me throughout, ensuring my application reflected who I really was.",                                                                               photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/yosie.jpg" },
  { name: "Anna",   school: "UC Berkeley '29", quote: "They helped me transform my love for film and media into a powerful application narrative. The strategy and essay guidance were key to my acceptance.",                                                         photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/anna.jpg" },
  { name: "Lyla",   school: "Columbia '28",    quote: "AddedEducation was my rock. What stood out was their ability to connect the dots across all my projects, links I wouldn't have noticed myself.",                                                               photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/lyla.jpg" },
  { name: "Aryan",  school: "Cornell '29",     quote: "With everything going on, AddedEducation helped me figure out my activities and align my major, making sure I got into the right programs that fit my needs and dreams.",                                       photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/aryan.jpg" },
  { name: "Ethan",  school: "Stanford '28",    quote: "With my counselor's guidance, I took my engineering projects, environmental leadership, and artistic portfolio and turned them into one standout application.",                                                 photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/ethan.jpg" },
  { name: "Saina",  school: "MIT '27",         quote: "Getting into top universities isn't just about grades. I'm glad I started planning early. AddedEducation really helped me make my profile shine.",                                                            photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/saina.jpg" },
  { name: "Eren",   school: "Tufts '27",       quote: "They gave me benchmarks for my grades, helped me plan my tournament schedule, and guided me through reaching out to coaches and the CommonApp. They helped me find the balance with everything.",               photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/eren.jpg" },
  { name: "Anjan",  school: "CMU '28",         quote: "AddedEducation connected me with coaches and helped me understand what they were looking for, and what in my profile could set me apart.",                                                                     photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/anjan.jpg" },
  { name: "Sondre", school: "RISD '28",        quote: "I've always had a passion for animation and art. With AddedEducation's guidance, I built a strong foundation and navigated the application process seamlessly.",                                               photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/testimonials/sondre.jpg" },
]
// ───────────────────────────────────────────────────────────────────────────

const GAP = 20
const VISIBLE = 3
const CARD_HEIGHT = 280

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
  // Infinite clone: [clone_tail, ...original, clone_head]
  // clone_tail = last VISIBLE items, clone_head = first VISIBLE items
  const items = [
    ...TESTIMONIALS.slice(N - VISIBLE),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, VISIBLE),
  ]
  // real items start at index VISIBLE in items array
  const OFFSET_START = VISIBLE

  const wrapRef    = useRef(null)
  const trackRef   = useRef(null)
  const indexRef   = useRef(OFFSET_START) // actual position in items[]
  const timerRef   = useRef(null)
  const busyRef    = useRef(false)

  const [dotActive, setDotActive] = useState(0)

  // Cache card width via ResizeObserver to avoid forced reflow
  const cardWRef = useRef(0)

  // Card width computed from cached ref
  const getCardWidth = useCallback(() => cardWRef.current, [])

  useEffect(() => {
    if (!wrapRef.current) return
    const update = () => {
      if (!wrapRef.current) return
      cardWRef.current = (wrapRef.current.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  // Jump to index instantly (no transition) — for infinite reset
  const jumpTo = useCallback((idx) => {
    if (!trackRef.current) return
    const cw = getCardWidth()
    trackRef.current.style.transition = "none"
    trackRef.current.style.transform = `translateX(-${idx * (cw + GAP)}px)`
    indexRef.current = idx
  }, [getCardWidth])

  // Slide to index with animation
  const slideTo = useCallback((idx, onDone) => {
    if (!trackRef.current) return
    const cw = getCardWidth()
    trackRef.current.style.transition = "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)"
    trackRef.current.style.transform = `translateX(-${idx * (cw + GAP)}px)`
    indexRef.current = idx
    setTimeout(() => {
      // infinite loop reset
      if (idx >= OFFSET_START + N) jumpTo(idx - N)
      if (idx < OFFSET_START)      jumpTo(idx + N)
      busyRef.current = false
      if (onDone) onDone()
    }, 720)
  }, [getCardWidth, N, OFFSET_START, jumpTo])

  const move = useCallback((dir) => {
    if (busyRef.current) return
    busyRef.current = true
    const next = indexRef.current + dir
    const realIdx = (next - OFFSET_START + N) % N
    setDotActive(realIdx)
    slideTo(next)
  }, [slideTo, OFFSET_START, N])

  const next = useCallback(() => move(1), [move])
  const prev = useCallback(() => move(-1), [move])

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 3000)
  }, [next])

  // Init position
  useEffect(() => {
    jumpTo(OFFSET_START)
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const handlePrev = () => { prev(); resetTimer() }
  const handleNext = () => { next(); resetTimer() }
  const handleDot  = (i) => {
    if (busyRef.current) return
    busyRef.current = true
    const target = OFFSET_START + i
    setDotActive(i)
    slideTo(target)
    resetTimer()
  }

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
              {[{ label: "←", fn: handlePrev }, { label: "→", fn: handleNext }].map(({ label, fn }) => (
                <button key={label} onClick={fn} style={{
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
          {/* Track — full width of all cloned items */}
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: GAP,
              height: CARD_HEIGHT,
              willChange: "transform",
            }}
          >
            {items.map((t, i) => {
              const cw = wrapRef.current
                ? (wrapRef.current.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE
                : 380
              return (
                <div key={i} style={{ width: cw, flexShrink: 0 }}>
                  <TestimonialCard t={t} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => handleDot(i)} style={{
              width: i === dotActive ? 24 : 8, height: 8, borderRadius: 999, border: "none",
              background: i === dotActive ? "#C8354B" : "rgba(255,255,255,0.2)",
              cursor: "pointer", padding: 0, transition: "all 0.3s ease",
            }} />
          ))}
        </div>

      </div>
    </section>
  )
}
