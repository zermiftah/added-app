import { useEffect, useRef, useState } from "react"
import { initPageTracking, deriveLP } from "lib/tracking"

// GA4 + Meta Pixel tracking — call once per theme's top-level component,
// e.g. `usePageTracking(page)` right inside the function body. LP is
// derived from the page's own Place field, so every page (existing and
// new) is tracked correctly with zero manual setup per page.
export function usePageTracking(page) {
  useEffect(() => {
    const lp = deriveLP(page?.webinar_place)
    return initPageTracking(lp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.webinar_place])
}

const LOGO_URL = "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782570954773_Horizontal___Maroon.webp"
const LOGO_WHITE_FILTER = "brightness(0) invert(1)"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  accent: "#C8354B", accentDeep: "#9E2538",
}

const sans  = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
const serif = "'Fraunces', serif"
const mono  = "'JetBrains Mono', monospace"

// ─────────────────────────────────────────────────────────────
// LandingHeader
// variant: "dark" (transparent → blur dark on scroll)
//          "light" (transparent → blur light on scroll)
// sections: [{ label, id }] — clicked → scrollIntoView
// ─────────────────────────────────────────────────────────────
export function LandingHeader({ variant = "light", sections = [], formId = "register" }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = variant === "dark"

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn, { passive: true })
    fn()
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  // Colors based on variant + scroll state
  const navLinks = sections.length ? sections : [
    { label: "Why", id: "why" },
    { label: "What You'll Learn", id: "learn" },
    { label: "Speakers", id: "speakers" },
    { label: "About", id: "about" },
  ]

  const bgColor = scrolled
    ? (isDark ? "rgba(14,14,14,0.93)" : "rgba(251,251,253,0.95)")
    : "transparent"
  const borderColor = scrolled
    ? (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)")
    : "transparent"
  const linkColor = isDark
    ? (scrolled ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.85)")
    : C.stone
  const logoFilter = isDark && !scrolled ? LOGO_WHITE_FILTER : "none"

  return (
    <>
      <style>{`
        .lh-nav-link {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 500;
          font-family: ${sans}; letter-spacing: 0.02em;
          transition: color 0.15s ease;
          padding: 4px 0;
        }
        .lh-nav-link:hover { color: ${C.accent} !important; }
        .lh-mobile-nav { display: none !important; }
        .lh-hamburger { display: none !important; }
        @media (max-width: 820px) {
          .lh-desktop-nav { display: none !important; }
          .lh-hamburger { display: flex !important; }
        }
        @media (max-width: 820px) {
          .lh-mobile-nav { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: bgColor,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: `1px solid ${borderColor}`,
        transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
        padding: "0 clamp(20px, 4vw, 48px)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          {/* Logo */}
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
               style={{ cursor: "pointer", flexShrink: 0 }}>
            <img
              src={LOGO_URL}
              alt="AddedEducation"
              style={{ height: 28, width: "auto", display: "block", filter: logoFilter, transition: "filter 0.3s ease" }}
             loading="lazy" decoding="async"/>
          </div>

          {/* Desktop nav */}
          <div className="lh-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {navLinks.map(({ label, id }) => (
              <button key={id} onClick={() => go(id)} className="lh-nav-link" style={{ color: linkColor }}>
                {label}
              </button>
            ))}
            <button
              onClick={() => go(formId)}
              style={{
                background: C.accent, color: "#fff", border: "none",
                cursor: "pointer", padding: "9px 20px", borderRadius: 100,
                fontSize: 13, fontWeight: 600, fontFamily: sans, letterSpacing: "0.02em",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentDeep}
              onMouseLeave={e => e.currentTarget.style.background = C.accent}
            >
              Reserve your seat →
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="lh-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}
          >
            {[22, 22, 14].map((w, i) => (
              <div key={i} style={{ width: w, height: 2, borderRadius: 2,
                background: isDark && !scrolled ? "#fff" : C.ink,
                transition: "background 0.3s ease",
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lh-mobile-nav" style={{
            background: isDark ? C.inkSoft : C.cream,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : C.creamWarm}`,
            padding: "20px clamp(20px, 4vw, 48px) 24px",
            flexDirection: "column", gap: 4,
          }}>
            {navLinks.map(({ label, id }) => (
              <button key={id} onClick={() => go(id)} className="lh-nav-link" style={{
                color: isDark ? "rgba(255,255,255,0.8)" : C.ink, textAlign: "left", padding: "10px 0",
                width: "100%", fontSize: 15,
              }}>
                {label}
              </button>
            ))}
            <button onClick={() => go(formId)} style={{
              background: C.accent, color: "#fff", border: "none", cursor: "pointer",
              padding: "13px 24px", borderRadius: 100, fontSize: 14,
              fontWeight: 600, fontFamily: sans, marginTop: 12, textAlign: "center", width: "100%",
            }}>
              Reserve your seat →
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// LandingFooter
// ─────────────────────────────────────────────────────────────
export function LandingFooter() {
  return (
    <footer style={{ background: C.ink, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px clamp(20px, 4vw, 48px)" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", flexWrap: "wrap",
        justifyContent: "space-between", alignItems: "center", gap: 24,
      }}>
        {/* Left: logo + tagline */}
        <div>
          <img
            src={LOGO_URL}
            alt="AddedEducation"
            style={{ height: 30, width: "auto", display: "block", filter: LOGO_WHITE_FILTER, marginBottom: 10 }}
           loading="lazy" decoding="async"/>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.stone, margin: 0 }}>
            Premium University Admissions Services
          </p>
        </div>

        {/* Right: links + copyright */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
          <a href="https://www.addededucation.com" target="_blank" rel="noopener noreferrer"
             style={{ fontFamily: sans, fontSize: 13, color: C.stoneLight, textDecoration: "none", transition: "color 0.15s" }}
             onMouseEnter={e => e.currentTarget.style.color = "#fff"}
             onMouseLeave={e => e.currentTarget.style.color = C.stoneLight}>
            www.addededucation.com ↗
          </a>
          <p style={{ fontFamily: sans, fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            © {new Date().getFullYear()} AddedEducation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// Reveal — scroll-triggered fade-in
// ─────────────────────────────────────────────────────────────
export function Reveal({ children, delay = 0, y = 24, duration = 700, threshold = 0.12, style = {}, className }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setShown(true); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      willChange: shown ? "auto" : "opacity, transform",
    }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// getResponsiveSrc — auto-derive _sm.webp srcSet
// ─────────────────────────────────────────────────────────────
export function getResponsiveSrc(src) {
  if (!src) return { src: null, srcSet: null, sizes: null }
  const sm = src.replace(/\.webp$/i, "_sm.webp")
  return {
    src,
    srcSet: `${sm} 640w, ${src} 1200w`,
    sizes: "(max-width: 768px) 100vw, 60vw",
  }
}


// ─────────────────────────────────────────────────────────────
// QuoteSection — accent-colored quote block with author attribution
// variant: "dark" | "light"
// ─────────────────────────────────────────────────────────────
export function QuoteSection({ quote, variant = "dark" }) {
  if (!quote?.message?.trim()) return null
  const isDark = variant === "dark"
  const bg = isDark ? C.accentDeep : C.accentDeep
  return (
    <section id="quote" style={{ background: bg, padding: "96px clamp(20px,5vw,56px)", color: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <svg width="32" height="24" viewBox="0 0 32 24" style={{ margin: "0 auto 32px", display: "block", opacity: 0.5 }}>
            <text x="0" y="20" fill="#fff" fontSize="40" fontFamily="Georgia,serif" fontWeight="700">"</text>
          </svg>
        </Reveal>
        <Reveal delay={80}>
          <p style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(22px,3vw,32px)", lineHeight: 1.4,
            color: "#fff", marginBottom: 40,
          }}>
            {quote.message}
          </p>
        </Reveal>
        {(quote.author || quote.author_position) && (
          <Reveal delay={160}>
            <p style={{
              fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.85)",
            }}>
              {[quote.author, quote.author_position].filter(Boolean).join(" · ")}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// WhyFamiliesSection — 6-card grid with "Your own team" accent card at end
// variant: "dark" | "light"
// ─────────────────────────────────────────────────────────────
export function WhyFamiliesSection({ data, variant = "light" }) {
  if (!data?.title && !data?.body?.length && !data?.description) return null
  const isDark = variant === "dark"
  const bg     = isDark ? "rgba(0,0,0,0.35)" : C.creamSoft
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#fff"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"
  const textCol   = isDark ? "#fff" : C.ink
  const subCol    = isDark ? "rgba(255,255,255,0.65)" : C.stone
  const numCol    = isDark ? "rgba(255,255,255,0.35)" : C.stoneLight

  const items = data.type === "list" && Array.isArray(data.body) ? data.body : []

  return (
    <section id="why-families" style={{ background: bg, padding: "96px clamp(20px,5vw,56px)", borderTop: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <span style={{
            display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent,
            borderBottom: `2px solid ${C.accent}`, paddingBottom: 4, marginBottom: 24,
          }}>Why families work with us</span>
        </Reveal>
        {data.title && (
          <Reveal delay={80}>
            <h2 style={{
              fontFamily: serif, fontWeight: 400, color: textCol,
              fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.05, letterSpacing: "-0.025em",
              marginBottom: 20, maxWidth: 640,
            }}>
              {data.title}
            </h2>
          </Reveal>
        )}
        {data.description && (
          <Reveal delay={140}>
            <p style={{
              fontFamily: sans, fontSize: 16, color: subCol, lineHeight: 1.7,
              maxWidth: 720, marginBottom: 56,
            }}>
              {data.description}
            </p>
          </Reveal>
        )}
        {items.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
          }}>
            {items.map((item, i) => (
              <Reveal key={i} delay={100 + i * 80}>
                <div style={{
                  background: cardBg,
                  borderLeft: `3px solid ${C.accent}`,
                  padding: "26px 24px 28px",
                  height: "100%",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = isDark ? "0 12px 32px rgba(0,0,0,0.35)" : "0 14px 40px rgba(0,0,0,0.08)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
                >
                  <p style={{
                    fontFamily: mono, fontSize: 11, fontWeight: 500, color: numCol,
                    letterSpacing: "0.14em", marginBottom: 12,
                  }}>{String(i + 1).padStart(2, "0")}</p>
                  {item.title && (
                    <h3 style={{
                      fontFamily: serif, fontWeight: 500, fontSize: 20, color: textCol,
                      marginBottom: 10, lineHeight: 1.25,
                    }}>
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p style={{
                      fontFamily: sans, fontSize: 14, color: subCol, lineHeight: 1.65,
                    }}>{item.description}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
        {data.type === "paragraph" && data.body && (
          <Reveal delay={200}>
            <p style={{ fontFamily: sans, fontSize: 16, color: subCol, lineHeight: 1.75, maxWidth: 760 }}>
              {data.body}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Shared section primitives — used by the newer theme layouts
// (SplitPortrait, CenteredMinimal, BentoGrid) to avoid re-defining
// the same title/body/speaker markup in every theme file.
// variant: "dark" | "light"
// ─────────────────────────────────────────────────────────────
export function Eyebrow({ children, variant = "dark" }) {
  const isDark = variant === "dark"
  return (
    <span style={{
      display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500,
      letterSpacing: "0.22em", textTransform: "uppercase",
      color: isDark ? "rgba(255,255,255,0.45)" : C.stone,
      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(14,14,14,0.12)"}`,
      borderRadius: 999, padding: "6px 14px", marginBottom: 20,
    }}>{children}</span>
  )
}

export function H2({ children, center, variant = "dark" }) {
  const isDark = variant === "dark"
  return (
    <h2 style={{
      fontFamily: serif, fontWeight: 400, color: isDark ? "#fff" : C.ink,
      fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em",
      marginBottom: 18, textAlign: center ? "center" : "left",
    }}>{children}</h2>
  )
}

export function Sub({ children, center, variant = "dark" }) {
  const isDark = variant === "dark"
  return (
    <p style={{
      fontFamily: sans, fontSize: 16, color: isDark ? "rgba(255,255,255,0.65)" : C.stone,
      lineHeight: 1.7, maxWidth: 720, marginBottom: 32,
      textAlign: center ? "center" : "left", margin: center ? "0 auto 32px" : "0 0 32px",
    }}>{children}</p>
  )
}

export function ContentBlock({ data, variant = "dark" }) {
  if (!data) return null
  const isDark = variant === "dark"
  const cardBg     = isDark ? "rgba(255,255,255,0.04)" : "#fff"
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(14,14,14,0.08)"
  const textCol    = isDark ? "#fff" : C.ink
  const subCol     = isDark ? "rgba(255,255,255,.62)" : C.stone

  if (data.type === "list" && Array.isArray(data.body)) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{
            background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14,
            padding: "22px 24px", transition: "border-color .25s, transform .25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,53,75,.45)"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.transform = "translateY(0)" }}>
            {item.title && <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, color: textCol, marginBottom: 8 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: subCol, lineHeight: 1.65 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontFamily: sans, fontSize: 15, color: subCol, lineHeight: 1.75, maxWidth: 760 }}>{data.body}</p>
}

export function SpeakerCard({ s, variant = "dark" }) {
  const isDark = variant === "dark"
  const { src, srcSet } = getResponsiveSrc(s.photo)
  const cardBg     = isDark ? "rgba(255,255,255,.04)" : "#fff"
  const cardBorder = isDark ? "rgba(255,255,255,.08)" : "rgba(14,14,14,.08)"
  const textCol    = isDark ? "#fff" : C.ink
  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, transition: "transform .25s, border-color .25s" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(200,53,75,.4)" }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = cardBorder }}>
      {src && <div style={{ width: 72, height: 72, borderRadius: 999, overflow: "hidden", marginBottom: 16, background: "#222" }}>
        <img src={src} srcSet={srcSet} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
      {s.name && <h4 style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: textCol, marginBottom: 4 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: sans, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: sans, fontSize: 13, color: isDark ? "rgba(255,255,255,.5)" : C.stone, marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: sans, fontSize: 13.5, color: isDark ? "rgba(255,255,255,.62)" : C.stone, lineHeight: 1.65 }}>{s.description}</p>}
      {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: sans, fontSize: 12, color: C.accent, textDecoration: "none", borderBottom: `1px solid ${C.accent}` }}>LinkedIn ↗</a>}
    </div>
  )
}

// Shared date-range formatter (kept identical across every theme)
export function formatDateRange(page) {
  const label = page.webinar_date
  const start = page.date_start
  const end   = page.date_end
  if (label) return label
  if (!start) return null
  const opts = { day: "numeric", month: "short", year: "numeric" }
  const s = new Date(start).toLocaleDateString("en-GB", opts)
  if (!end || end === start) return s
  return `${s} – ${new Date(end).toLocaleDateString("en-GB", opts)}`
}

// Format a stored 24h "HH:mm" webinar_time into a friendly 12h display
// string, e.g. "07:00" -> "7:00 AM". Leaves legacy free-text values
// (from before the time picker existed) untouched so old pages don't break.
export function formatWebinarTime(time) {
  if (!time) return null
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim())
  if (!m) return time // legacy free-text value — show as-is
  let h = parseInt(m[1], 10)
  const min = m[2]
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${min} ${ampm}`
}

export { C, sans, serif, mono }
