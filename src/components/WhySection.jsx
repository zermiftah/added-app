import { useState, useEffect } from "react"

const FEATURES = [
  {
    id: 0,
    title: "Your own crew of experts",
    image: "https://addededucation-assets.s3.us-east-1.amazonaws.com/images/your+own.jpg",
    cardTitle: "YOUR CREW OF EXPERTS",
    cardBody: "One lead counselor stays with your child the whole way, backed by essay specialists and subject experts.",
  },
  {
    id: 1,
    title: "Flexible scheduling",
    image: "https://addededucation-assets.s3.us-east-1.amazonaws.com/images/flexible.png",
    cardTitle: "FLEXIBLITY 'ROUND THE CLOCK",
    cardBody: "Google Meet, WhatsApp, phone call: reach us any time. We move at your pace.",
  },
  {
    id: 2,
    title: "Counselors your child will actually talk to",
    image: "https://addededucation-assets.s3.us-east-1.amazonaws.com/images/counselor.jpg",
    cardTitle: "IT DOESN'T MATTER IF YOU LIKE THEM",
    cardBody: "It matters if your child does. We match based on personality and interests. Not a fit? We have 70+ to choose from.",
  },
  {
    id: 3,
    title: "Access local & global opportunities",
    image: "https://addededucation-assets.s3.us-east-1.amazonaws.com/images/access.jpeg",
    cardTitle: "EXCLUSIVE OPPORTUNITIES",
    cardBody: "Former admissions officers, research programs, and community service: these are real opportunities you won't find on Google.",
  },
]

export default function WhySection() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  // Auto-advance every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActive(prev => (prev + 1) % FEATURES.length)
        setAnimating(false)
      }, 250)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleSelect = (id) => {
    if (id === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(id)
      setAnimating(false)
    }, 200)
  }

  const current = FEATURES[active]

  return (
    <section style={{ background: "#0E0E0E", width: "100%", padding: "80px 0 96px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div>
            {/* Eyebrow */}
            <div style={{ marginBottom: 32 }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999,
                padding: "8px 18px",
              }}>
                'Good enough' isn't good enough anymore
              </span>
            </div>

            {/* Headline */}
            <h2 className="fraunces-heading" style={{
              fontSize: "clamp(32px, 3.5vw, 48px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#fff",
              marginBottom: 24,
            }}>
              Here's why families{" "}
              <em style={{ fontStyle: "italic", color: "#C8354B" }}>work with us.</em>
            </h2>

            {/* Body */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 48,
              maxWidth: 520,
            }}>
              Families across Singapore, India, Dubai, and London have trusted us with their child's future because{" "}
              <em style={{ fontStyle: "italic" }}>we've been where you are</em>, and we know exactly what it takes to 'get in' from where your child is starting.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((feat) => {
                const isActive = active === feat.id
                return (
                  <button
                    key={feat.id}
                    onClick={() => handleSelect(feat.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "18px 22px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)",
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 400,
                      color: "#fff",
                      letterSpacing: isActive ? "-0.01em" : "normal",
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = "transparent"
                    }}
                  >
                    {feat.title}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT — animated image ── */}
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "4/5" }}>
            {/* Image crossfade */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${current.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Dark overlay bottom */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)",
              pointerEvents: "none",
            }} />

            {/* Floating maroon card */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                width: 260,
                background: "#9E2538",
                borderRadius: 12,
                padding: "20px 22px 22px",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#fff",
                marginBottom: 10,
                lineHeight: 1.4,
              }}>
                {current.cardTitle}
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 350,
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.55,
                marginBottom: 14,
              }}>
                {current.cardBody}
              </p>
              {/* Accent line */}
              <div style={{ width: 32, height: 1.5, background: "#E8B4BD", borderRadius: 999 }} />
            </div>

            {/* Progress dots */}
            <div style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              display: "flex",
              gap: 6,
            }}>
              {FEATURES.map((_, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    width: i === active ? 20 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: i === active ? "#C8354B" : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
