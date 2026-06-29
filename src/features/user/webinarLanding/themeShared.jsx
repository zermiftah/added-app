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

export { C, sans, serif, mono }
