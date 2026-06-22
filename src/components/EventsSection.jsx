import { useRef, useEffect, useState } from "react"

const WEBINARS = [
  {
    id: "uk",
    region: "United Kingdom",
    title: "The founder of AddedEducation",
    subtitle: "is coming to London.",
    date: "20 – 27 June 2026",
    time: "In Person · London",
    audience: "Years 9 – 13",
    link: "/uk-meet-the-founder",
    isSpecial: true,
  },
  {
    id: "india",
    region: "India",
    title: "Does your curriculum open the right doors,",
    subtitle: "or quietly close them?",
    date: "June 27, 2026",
    time: "4:00 PM IST",
    audience: "Classes 8 – 11",
    link: "/india-does-your-curriculum-open-doors",
  },
  {
    id: "hongkong",
    region: "Hong Kong",
    title: "Your child's school is shaping their University results",
    subtitle: "right now.",
    date: "June 28, 2026",
    time: "7:00 PM HKT",
    audience: "Years 9 – 12 & parents",
    link: "/hong-kong-school-university-admissions",
  },
  {
    id: "singapore",
    region: "Singapore",
    title: "How to stand out to top universities",
    subtitle: "as a Singaporean in 2026.",
    date: "June 24, 2026",
    time: "7:00 PM SGT",
    audience: "Grades 9 – 11",
    link: "/singapore-legacy-admissions",
  },
]

const PLACEHOLDER_GRADIENTS = {
  uk: "linear-gradient(150deg, #1c2e4a 0%, #2d1a1a 100%)",
  india: "linear-gradient(150deg, #7E2424 0%, #1A1A1A 100%)",
  hongkong: "linear-gradient(150deg, #1a2e1a 0%, #1A1A1A 100%)",
  singapore: "linear-gradient(150deg, #1a2442 0%, #2d1a2d 100%)",
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          io.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function EventsSection() {
  return (
    <section id="events" className="w-full bg-cream py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <FadeIn>
          <div className="mb-12">
            <div className="inline-flex items-center font-mono text-[10px] font-500 uppercase tracking-[0.22em] border border-black/12 rounded px-3 py-2 text-ink mb-5">
              Upcoming Events
            </div>
            <h2
              className="font-fraunces font-300 leading-[1.12] tracking-[-0.02em] text-ink"
              style={{ fontSize: "clamp(34px, 4vw, 52px)" }}
            >
              Free webinars.{" "}
              <em className="italic font-400 text-maroon">Real answers.</em>
            </h2>
          </div>
        </FadeIn>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-6">
          {WEBINARS.map((w, i) => (
            <FadeIn key={w.id} delay={80 + i * 80}>
              <a
                href={w.link}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 no-underline"
                style={{
                  borderColor: w.isSpecial ? "#6B1818" : "rgba(0,0,0,0.06)",
                  borderTopWidth: w.isSpecial ? 2 : 1,
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 16px 48px rgba(107,24,24,0.07)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                {/* Image area */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: PLACEHOLDER_GRADIENTS[w.id] }}
                  >
                    <span className="font-fraunces text-white/15" style={{ fontSize: 18 }}>{w.region}</span>
                  </div>

                  {/* Free badge */}
                  <div className="absolute top-3 right-3 bg-accent text-white rounded font-mono text-[9px] font-700 uppercase tracking-[1.2px] px-2.5 py-1">
                    Free
                  </div>

                  {/* Date overlay */}
                  <div
                    className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg px-3 py-1.5"
                    style={{ background: "rgba(14,14,14,0.7)", backdropFilter: "blur(8px)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="font-mono text-white" style={{ fontSize: 11 }}>
                      {w.date} · {w.time}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="font-mono text-accent uppercase mb-3" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px" }}>
                    {w.region} · {w.audience}
                  </div>
                  <div className="font-fraunces text-ink leading-snug flex-1" style={{ fontSize: 18, fontWeight: 500 }}>
                    {w.title}
                    <em className="italic font-400 text-maroon block">{w.subtitle}</em>
                  </div>
                  <div
                    className="font-dm text-accent mt-4 flex items-center gap-1.5 transition-all duration-300 group-hover:gap-3"
                    style={{ fontSize: 13, fontWeight: 600 }}
                  >
                    Register Free <span>→</span>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Bottom banner */}
        <FadeIn delay={400}>
          <div
            className="relative rounded-2xl p-7 lg:p-9 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden"
            style={{ background: "#0E0E0E" }}
          >
            {/* Glow */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(107,24,24,0.12) 0%, transparent 70%)" }}
            />

            <div className="relative z-10">
              <p className="font-fraunces text-white font-400" style={{ fontSize: 17, lineHeight: 1.4 }}>
                All sessions are free to attend.
              </p>
              <p className="font-inter mt-1" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Live online · Former admissions officers from Cornell, UChicago and more.
              </p>
            </div>
            <a
              href="/events"
              className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 font-dm text-ink bg-white rounded-xl px-6 py-3 transition-all duration-200 hover:bg-accent-rose no-underline"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Browse all events
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
