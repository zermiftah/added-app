import { useEffect, useRef, useState } from "react"

const LOGO_URL = "https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782570954773_Horizontal___Maroon.webp"

/**
 * LandingHeader — sticky/static header for the 3 webinar themes.
 * variant: "dark" (default) | "light"
 */
export function LandingHeader({ variant = "dark", onCtaClick, ctaLabel = "Reserve seat" }) {
  const isDark = variant === "dark"
  const bg     = isDark ? "rgba(14,14,14,0.85)" : "rgba(251,251,253,0.92)"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const text   = isDark ? "#FFFFFF" : "#0E0E0E"

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        width: "100%",
        background: bg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        padding: "14px clamp(20px, 5vw, 64px)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="https://addededucation.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          <img
            src={LOGO_URL}
            alt="AddedEducation"
            style={{ height: 28, width: "auto", display: "block", filter: isDark ? "brightness(0) invert(1) opacity(0.95)" : "none" }}
            loading="eager"
            decoding="async"
          />
        </a>

        {onCtaClick && (
          <button
            onClick={onCtaClick}
            style={{
              padding: "8px 18px",
              background: "transparent",
              color: text,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"}`,
              borderRadius: 999,
              fontFamily: "'Inter',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#C8354B"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.borderColor = "#C8354B"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = text
              e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"
            }}
          >
            {ctaLabel} →
          </button>
        )}
      </div>
    </header>
  )
}

/**
 * Reveal — wraps children with a fade-in + translateY animation
 * triggered by IntersectionObserver (cheap, no library).
 */
export function Reveal({ children, delay = 0, y = 24, duration = 700, threshold = 0.12, as: Tag = "div", style = {}, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Respect reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: shown ? "auto" : "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Resolve mobile/desktop image — returns srcSet for ResponsiveImg-like behavior
 * but as a plain string. Used by the themes' hero images so they pick _sm
 * automatically without bundling another component.
 */
export function getResponsiveSrc(src) {
  if (!src) return { src: null, srcSet: null }
  if (typeof src !== "string" || !src.toLowerCase().endsWith(".webp")) {
    return { src, srcSet: null }
  }
  const sm = src.replace(/\.webp$/i, "_sm.webp")
  return {
    src,
    srcSet: `${sm} 640w, ${src} 1200w`,
    sizes:  "(max-width: 768px) 100vw, 60vw",
  }
}
