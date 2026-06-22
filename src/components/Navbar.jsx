import { useState, useEffect, useRef } from "react"

const NAV_LINKS = [
  { label: "Our Programs", href: "#programs", hasDropdown: true },
  { label: "Events", href: "/events" },
  { label: "Careers", href: "#careers" },
  { label: "Resources", href: "#resources" },
  { label: "About Us", href: "#about" },
  { label: "Your Team", href: "#team" },
]

/* Reusable roll button for navbar — bg white default, hover transparent */
function NavRollButton({ label, href = "#contact" }) {
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
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition: "transform 0.38s cubic-bezier(0.76,0,0.24,1)",
    padding: "0 20px",
    boxSizing: "border-box",
  }

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 38,
        borderRadius: 999,
        border: "1.5px solid #fff",
        background: "#fff",
        padding: "0 20px",
        textDecoration: "none",
        overflow: "hidden",
        cursor: "pointer",
        transition: "background 0.38s cubic-bezier(0.76,0,0.24,1), border-color 0.38s ease",
        boxSizing: "border-box",
      }}
    >
      {/* invisible sizer */}
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", visibility: "hidden", padding: "0 2px" }}>
        {label}
      </span>
      {/* top layer — white bg, dark text */}
      <span className="nrt" style={{ ...spanBase, color: "#0E0E0E", transform: "translateY(0%)" }}>{label}</span>
      {/* bottom layer — transparent bg, white text */}
      <span className="nrb" style={{ ...spanBase, color: "#fff", transform: "translateY(100%)" }}>{label}</span>
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(14,14,14,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img
            src="https://addededucation-assets.s3.us-east-1.amazonaws.com/images/Horizontal+-+Maroon.png"
            alt="AddedEducation"
            className="h-9 object-contain"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-inter text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {link.label}
                {link.hasDropdown && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — roll button */}
        <div className="hidden lg:flex items-center">
          <NavRollButton label="Get in touch" href="#contact" />
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "" }} />
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-ink border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="font-inter text-sm font-medium text-white/80 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="mt-2 font-inter text-sm font-semibold px-5 py-3 rounded-full bg-white text-ink text-center" onClick={() => setMenuOpen(false)}>
            Get in touch
          </a>
        </div>
      )}
    </header>
  )
}
