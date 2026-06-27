import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"

const PROGRAMS = [
  { label: "AddedEducation", href: "/programs/admissions" },
  { label: "AddedSport", href: "/programs/athletic" },
  { label: "AddedArt", href: "/programs/arts" },
  { label: "AddedTutoring", href: "/programs/tutoring" },
  { label: "AddedNova Research Program", href: "/programs/research" },
]

const NAV_LINKS = [
  { label: "Our Programs", href: "/programs", hasDropdown: true },
  { label: "Events", href: "/events" },
  { label: "Careers", href: "/careers" },
  { label: "Resources", href: "/resources" },
  { label: "About Us", href: "/about" },
  { label: "Your Team", href: "/team" },
]

/* ── Roll button ── */
function NavRollButton({ label, href = "/contact" }) {
  const btnRef = useRef(null)
  const handleEnter = () => {
    const el = btnRef.current; if (!el) return
    el.style.background = "transparent"
    el.style.borderColor = "#fff"
    el.querySelector(".nrt").style.transform = "translateY(-100%)"
    el.querySelector(".nrb").style.transform = "translateY(0%)"
  }
  const handleLeave = () => {
    const el = btnRef.current; if (!el) return
    el.style.background = "#fff"
    el.style.borderColor = "#fff"
    el.querySelector(".nrt").style.transform = "translateY(0%)"
    el.querySelector(".nrb").style.transform = "translateY(100%)"
  }
  const spanBase = {
    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
    transition: "transform 0.38s cubic-bezier(0.76,0,0.24,1)", padding: "0 20px", boxSizing: "border-box",
  }
  return (
    <Link ref={btnRef} to={href} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", height: 38, borderRadius: 999, border: "1.5px solid #fff", background: "#fff", padding: "0 20px", textDecoration: "none", overflow: "hidden", cursor: "pointer", transition: "background 0.38s cubic-bezier(0.76,0,0.24,1), border-color 0.38s ease", boxSizing: "border-box" }}
    >
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", visibility: "hidden", padding: "0 2px" }}>{label}</span>
      <span className="nrt" style={{ ...spanBase, color: "#0E0E0E", transform: "translateY(0%)" }}>{label}</span>
      <span className="nrb" style={{ ...spanBase, color: "#fff", transform: "translateY(100%)" }}>{label}</span>
    </Link>
  )
}

/* ── Single nav link with underline ── */
function NavLink({ link, isActive }) {
  const [hov, setHov] = useState(false)
  const underlineVisible = isActive || hov
  return (
    <Link
      to={link.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 5,
        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
        color: "#fff", textDecoration: "none", paddingBottom: 4,
      }}
    >
      {link.label}
      <span style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5,
        background: "#fff", borderRadius: 2,
        transform: underlineVisible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: isActive ? "center" : hov ? "left" : "right",
        transition: "transform 0.28s cubic-bezier(0.76,0,0.24,1)",
      }} />
    </Link>
  )
}

/* ── Our Programs — hover to open ── */
function ProgramsDropdown({ isActive }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timerRef = useRef(null)

  const handleEnter = () => {
    clearTimeout(timerRef.current)
    setOpen(true)
  }
  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const underlineVisible = isActive || open

  return (
    <div ref={ref} style={{ position: "relative" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <div style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 5,
        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
        color: "#fff", cursor: "default", paddingBottom: 4, userSelect: "none",
      }}>
        Our Programs
        {/* Arrow flips when open */}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Underline */}
        <span style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5,
          background: "#fff", borderRadius: 2,
          transform: underlineVisible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: isActive ? "center" : open ? "left" : "right",
          transition: "transform 0.28s cubic-bezier(0.76,0,0.24,1)",
        }} />
      </div>

      {/* Dropdown panel */}
      <div style={{
        position: "absolute", top: "calc(100% + 14px)", left: "50%",
        transform: open ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-6px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.76,0,0.24,1)",
        background: "#fff", borderRadius: 14,
        boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.08)",
        padding: "10px 0", zIndex: 100,
        minWidth: "max-content",
      }}>
        {PROGRAMS.map((p, i) => (
          <DropdownItem key={i} p={p} />
        ))}
      </div>
    </div>
  )
}

function DropdownItem({ p }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      to={p.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block", padding: "11px 24px",
        fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
        color: hov ? "#C8354B" : "#1A1A1A", textDecoration: "none",
        background: hov ? "rgba(200,53,75,0.05)" : "transparent",
        transition: "color 0.18s ease, background 0.18s ease",
        whiteSpace: "nowrap",
      }}
    >
      {p.label}
    </Link>
  )
}

/* ══ MAIN ══ */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileProgOpen, setMobileProgOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + "/")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(14,14,14,0.96)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none" }}
    >
      <nav className="w-full px-6 lg:px-20 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Horizontal+-+Maroon.png" alt="AddedEducation" width={180} height={36} className="h-9 object-contain" style={scrolled ? {} : { filter: "brightness(0) invert(1)" }} />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.hasDropdown
                ? <ProgramsDropdown isActive={isActive(link.href)} />
                : <NavLink link={link} isActive={isActive(link.href)} />
              }
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center">
          <NavRollButton label="Get in touch" href="/contact" />
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "" }} />
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-ink border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {/* Our Programs accordion on mobile */}
          <div>
            <button onClick={() => setMobileProgOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Our Programs
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                style={{ transition: "transform 0.25s ease", transform: mobileProgOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileProgOpen && (
              <div style={{ marginTop: 10, paddingLeft: 12, borderLeft: "2px solid rgba(200,53,75,0.4)", display: "flex", flexDirection: "column", gap: 8 }}>
                {PROGRAMS.map((p, i) => (
                  <Link key={i} to={p.href} style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.filter(l => !l.hasDropdown).map((link) => (
            <Link key={link.label} to={link.href} style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
          <Link to="/contact" style={{ marginTop: 8, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, padding: "12px 20px", borderRadius: 999, background: "#fff", color: "#0E0E0E", textAlign: "center", textDecoration: "none" }}>
            Get in touch
          </Link>
        </div>
      )}
    </header>
  )
}
