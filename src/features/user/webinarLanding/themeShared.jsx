import { useEffect, useRef, useState } from "react"

const LOGO_URL = "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782570954773_Horizontal___Maroon.webp"
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
            />
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
          />
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
export function Reveal({ children, delay = 0, y = 24, duration = 700, threshold = 0.12, style = {} }) {
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
    <div ref={ref} style={{
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

export { C, sans, serif, mono }
