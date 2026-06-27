import { useRef } from "react"

function HeroRollButton({ label, href = "#contact" }) {
  const btnRef = useRef(null)

  const handleEnter = () => {
    const el = btnRef.current; if (!el) return
    el.style.background = "transparent"
    el.style.borderColor = "#fff"
    el.querySelector(".hrt").style.transform = "translateY(-100%)"
    el.querySelector(".hrb").style.transform = "translateY(0%)"
  }
  const handleLeave = () => {
    const el = btnRef.current; if (!el) return
    el.style.background = "#fff"
    el.style.borderColor = "#fff"
    el.querySelector(".hrt").style.transform = "translateY(0%)"
    el.querySelector(".hrb").style.transform = "translateY(100%)"
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
        height: 50,
        borderRadius: 999,
        border: "1.5px solid #fff",
        background: "#fff",
        padding: "0 34px",
        textDecoration: "none",
        overflow: "hidden",
        cursor: "pointer",
        transition: "background 0.38s cubic-bezier(0.76,0,0.24,1), border-color 0.38s ease",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", visibility: "hidden" }}>
        {label}
      </span>
      {/* top — black text on white */}
      <span className="hrt" style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: "#0E0E0E",
        whiteSpace: "nowrap", transition: "transform 0.38s cubic-bezier(0.76,0,0.24,1)",
        padding: "0 34px", boxSizing: "border-box", transform: "translateY(0%)",
      }}>{label}</span>
      {/* bottom — white text on transparent */}
      <span className="hrb" style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: "#fff",
        whiteSpace: "nowrap", transition: "transform 0.38s cubic-bezier(0.76,0,0.24,1)",
        padding: "0 34px", boxSizing: "border-box", transform: "translateY(100%)",
      }}>{label}</span>
    </a>
  )
}

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ background: "#0E0E0E" }}
    >
      <img
        src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567334679_vRwqcjkjJJvZusEeq6lojyQAW3s.webp"
        alt=""
        fetchpriority="high"
        decoding="async"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(14,14,14,0.45) 0%, rgba(14,14,14,0.60) 40%, rgba(14,14,14,0.88) 100%)",
        }}
      />

      <div className="relative z-10 w-full pb-20 lg:pb-28 pt-32" style={{ paddingLeft: "clamp(24px, 8vw, 120px)", paddingRight: "clamp(24px, 6vw, 80px)" }}>
        <div className="mb-6">
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 6,
            padding: "6px 14px",
          }}>
            Premium University Admission Services
          </span>
        </div>

        <h1
          className="fraunces-display text-white mb-6"
          style={{ fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 600 }}
        >
          Your Child Has One Shot
          <br />
          At This Application.
          <br />
          <em className="text-accent" style={{ fontStyle: "italic" }}>Don't Wing It.</em>
        </h1>

        <p
          className="text-white/70 mb-10"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 350, lineHeight: 1.7, maxWidth: 420 }}
        >
          We partner with families to build powerful applications,
          placing 93% of our students in a top-3 target school.
        </p>

        <HeroRollButton label="Book a free 30-minute call" href="/contact" />
      </div>
    </section>
  )
}
