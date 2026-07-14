import { useRef, useEffect, useState } from "react"
import { formatWebinarTime } from "features/user/webinarLanding/themeShared"

const API_BASE = "https://addededucation.com/addedapi"

function formatDateRange(w) {
  if (w.webinar_date) return w.webinar_date
  if (!w.date_start) return null
  const opts = { day: "numeric", month: "short", year: "numeric" }
  const s = new Date(w.date_start + "T00:00:00").toLocaleDateString("en-GB", opts)
  if (!w.date_end || w.date_end === w.date_start) return s
  return `${s} – ${new Date(w.date_end + "T00:00:00").toLocaleDateString("en-GB", opts)}`
}

function getHeroSrc(w) {
  if (!w.hero_image) return null
  const base = API_BASE.replace(/\/addedapi$/, "")
  const full = w.hero_image.startsWith("http") ? w.hero_image : `${base}${w.hero_image}`
  const sm = full.replace(/\.webp$/i, "_sm.webp")
  return { full, sm }
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); io.unobserve(el) } },
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      pointerEvents: "auto",
    }}>{children}</div>
  )
}

function WebinarCard({ w, i }) {
  const hero = getHeroSrc(w)
  const dateStr = formatDateRange(w)
  const timeStr = [dateStr, formatWebinarTime(w.webinar_time)].filter(Boolean).join(" · ")

  return (
    <FadeIn delay={80 + i * 80}>
      <a
        href={`/${w.slug}`}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 no-underline"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 16px 48px rgba(107,24,24,0.07)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
      >
        {/* Image area */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {hero ? (
            <img
              src={hero.full}
              srcSet={`${hero.sm} 480w, ${hero.full} 800w`}
              sizes="(max-width:640px) 100vw, 400px"
              alt={w.webinar_title}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(150deg,#1c2e4a 0%,#2d1a1a 100%)" }}>
              <span className="font-fraunces text-white/15" style={{ fontSize: 18 }}>{w.webinar_place || "Webinar"}</span>
            </div>
          )}

          {/* Free badge */}
          <div className="absolute top-3 right-3 bg-accent text-white rounded font-mono text-[9px] font-700 uppercase tracking-[1.2px] px-2.5 py-1">
            Free
          </div>

          {/* Date overlay */}
          {timeStr && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: "rgba(14,14,14,0.72)", backdropFilter: "blur(8px)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="font-mono text-white truncate" style={{ fontSize: 11, maxWidth: 200 }}>{timeStr}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {(w.webinar_place || w.grade_years) && (
            <div className="font-mono text-accent uppercase mb-3" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px" }}>
              {[w.webinar_place, w.grade_years].filter(Boolean).join(" · ")}
            </div>
          )}
          <div className="font-fraunces text-ink leading-snug flex-1" style={{ fontSize: 18, fontWeight: 500 }}>
            {w.webinar_title}
          </div>
          <div className="font-dm text-accent mt-4 flex items-center gap-1.5 transition-all duration-300 group-hover:gap-3" style={{ fontSize: 13, fontWeight: 600 }}>
            Register Free <span>→</span>
          </div>
        </div>
      </a>
    </FadeIn>
  )
}

export default function EventsSection() {
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    // Check prefetch cache first
    const cached = window.__addedPrefetch?.get("webinars:upcoming")
    if (cached) {
      setWebinars(cached.webinars || [])
      setLoading(false)
    }
    fetch(`${API_BASE}/webinar-pages/public/upcoming`)
      .then(r => r.json())
      .then(d => {
        const list = d.webinars || []
        setWebinars(list)
        window.__addedPrefetch?.set("webinars:upcoming", d)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Show max 4 cards on homepage
  const visible = webinars.slice(0, 4)

  return (
    <section id="events" className="w-full bg-cream py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <FadeIn>
          <div className="mb-12">
            <div className="inline-flex items-center font-mono text-[10px] font-500 uppercase tracking-[0.22em] border border-black/12 rounded px-3 py-2 text-ink mb-5">
              Upcoming Events
            </div>
            <h2 className="font-fraunces font-300 leading-[1.12] tracking-[-0.02em] text-ink" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>
              Free webinars.{" "}
              <em className="italic font-400 text-maroon">Real answers.</em>
            </h2>
          </div>
        </FadeIn>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-6">
            {[0,1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-black/5 animate-pulse">
                <div className="bg-gray-100" style={{ aspectRatio: "4/3" }} />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-5 bg-gray-100 rounded" />
                  <div className="h-5 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 text-stone font-inter text-[14px]">
            No upcoming events at the moment. Check back soon.
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${visible.length >= 3 ? "lg:grid-cols-4" : visible.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-sm"} gap-7 mb-6`}>
            {visible.map((w, i) => <WebinarCard key={w.id} w={w} i={i} />)}
          </div>
        )}

        {/* Bottom banner */}
        <FadeIn delay={400}>
          <div className="relative rounded-2xl p-7 lg:p-9 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden" style={{ background: "#0E0E0E" }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(107,24,24,0.12) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <p className="font-fraunces text-white font-400" style={{ fontSize: 17, lineHeight: 1.4 }}>All sessions are free to attend.</p>
              <p className="font-inter mt-1" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Live online · Former admissions officers from Cornell, UChicago and more.</p>
            </div>
            <a href="/events" className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 font-dm text-ink bg-white rounded-xl px-6 py-3 transition-all duration-200 hover:bg-accent-rose no-underline" style={{ fontSize: 13, fontWeight: 600 }}>
              Browse all events
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
