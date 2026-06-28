import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import { LandingHeader, Reveal, getResponsiveSrc } from "../themeShared"

const T = {
  bg: "#F0EFEA", cream: "#FBFBFD",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  text: "#0E0E0E", textMuted: "#6B6863", textOnDark: "#FFFFFF",
  accent: "#C8354B", accentDeep: "#6B1818",
  border: "rgba(0,0,0,0.10)", borderDark: "rgba(255,255,255,0.08)",
}

export default function ThemeEditorialSplit({ page }) {
  const formRef = useRef(null)
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @keyframes es-pan {
          0%, 100% { transform: scale(1.05) translate(0, 0); }
          50%      { transform: scale(1.05) translate(-1%, -1%); }
        }
        @keyframes es-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .es-hero-grid { display: grid; grid-template-columns: minmax(0, 2.4fr) minmax(0, 1fr); gap: 56px; align-items: stretch; }
        .es-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 56px; }
        .es-split-form { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 56px; align-items: start; }
        @media (max-width: 900px) {
          .es-hero-grid, .es-split, .es-split-form { grid-template-columns: 1fr !important; gap: 36px !important; }
          .es-hero-meta { border-left: none !important; padding-left: 0 !important; padding-top: 28px !important; border-top: 1px solid ${T.border} !important; }
        }
      `}</style>

      <LandingHeader variant="light" onCtaClick={scrollToForm} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", padding: "80px clamp(20px, 5vw, 64px) 64px", borderBottom: `1px solid ${T.border}`, overflow: "hidden" }}>
        {heroImg.src && (
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.18 }}>
            <img
              src={heroImg.src}
              srcSet={heroImg.srcSet || undefined}
              sizes={heroImg.sizes || undefined}
              alt=""
              fetchpriority="high"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", animation: "es-pan 16s ease-in-out infinite", filter: "grayscale(35%)" }}
            />
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }} className="es-hero-grid">
          <div>
            <Reveal>
              <span style={{
                display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent,
                borderBottom: `2px solid ${T.accent}`, paddingBottom: 4, marginBottom: 32,
              }}>Free webinar</span>
            </Reveal>
            <Reveal delay={120}>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, color: T.text, fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 0.98, letterSpacing: "-0.035em", marginBottom: 28 }}>
                {page.webinar_title}
              </h1>
            </Reveal>
            {page.webinar_subtitle && (
              <Reveal delay={220}>
                <p style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px, 2vw, 24px)", color: T.textMuted, lineHeight: 1.5, maxWidth: 620, marginBottom: 32 }}>
                  {page.webinar_subtitle}
                </p>
              </Reveal>
            )}
            <Reveal delay={320}>
              <button
                onClick={scrollToForm}
                style={{
                  padding: "14px 30px", background: T.ink, color: "#fff", border: "none", borderRadius: 0,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 500,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.25s ease",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "translateX(4px)" }}
                onMouseLeave={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.transform = "translateX(0)" }}
              >
                Reserve seat →
              </button>
            </Reveal>
          </div>

          <aside className="es-hero-meta" style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: 32, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 28 }}>
            {page.webinar_date  && <Reveal delay={180}><SideMeta label="Date"   value={page.webinar_date} /></Reveal>}
            {page.webinar_time  && <Reveal delay={260}><SideMeta label="Time"   value={page.webinar_time} /></Reveal>}
            {page.webinar_place && <Reveal delay={340}><SideMeta label="Where"  value={page.webinar_place} /></Reveal>}
            {page.grade_years   && <Reveal delay={420}><SideMeta label="For"    value={page.grade_years} /></Reveal>}
          </aside>
        </div>
      </section>

      {/* ── Why — split title left / content right ── */}
      {page.why_data && (
        <section style={{ padding: "96px clamp(20px, 5vw, 64px)", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }} className="es-split">
            <Reveal>
              <div>
                <Eyebrow>Why this matters</Eyebrow>
                <h2 style={titleStyle}>{page.why_data.title || "Why you need this"}</h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                {page.why_data.subtitle && <p style={{ ...subtitleStyle, marginBottom: 24 }}>{page.why_data.subtitle}</p>}
                <RenderContent data={page.why_data} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── What you'll learn — numbered grid ── */}
      {page.learn_data && (
        <section style={{ padding: "96px clamp(20px, 5vw, 64px)", background: T.cream, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: 48 }}>
                <Eyebrow>What you'll learn</Eyebrow>
                <h2 style={{ ...titleStyle, maxWidth: 800 }}>{page.learn_data.title || "What you'll learn"}</h2>
                {page.learn_data.subtitle && <p style={subtitleStyle}>{page.learn_data.subtitle}</p>}
              </div>
            </Reveal>
            <Reveal delay={120}><RenderContent data={page.learn_data} variant="grid" /></Reveal>
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section style={{ padding: "96px clamp(20px, 5vw, 64px)", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal>
              <Eyebrow>Your hosts</Eyebrow>
              <h2 style={{ ...titleStyle, marginBottom: 48 }}>Speakers</h2>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
              {page.speakers.map((s, i) => (
                <Reveal key={i} delay={80 + i * 80}><EditorialSpeakerCard s={s} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About — CENTERED ── */}
      {page.about_data && (
        <section style={{ padding: "96px clamp(20px, 5vw, 64px)", background: T.cream, borderBottom: `1px solid ${T.border}`, textAlign: "center" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <Reveal>
              <Eyebrow>About</Eyebrow>
              <h2 style={{ ...titleStyle, textAlign: "center" }}>About AddedEducation</h2>
            </Reveal>
            {page.about_data.description && (
              <Reveal delay={80}>
                <p style={{ ...subtitleStyle, margin: "0 auto", textAlign: "center" }}>{page.about_data.description}</p>
              </Reveal>
            )}
            {Array.isArray(page.about_data.universities) && page.about_data.universities.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28, justifyContent: "center" }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{
                      display: "inline-block", padding: "8px 14px", borderRadius: 0,
                      border: `1px solid ${T.ink}`, background: "transparent",
                      color: T.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── Form ── */}
      <section ref={formRef} style={{ padding: "96px clamp(20px, 5vw, 64px)", background: T.ink, color: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }} className="es-split-form">
          <Reveal>
            <div>
              <span style={{
                display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent,
                borderBottom: `2px solid ${T.accent}`, paddingBottom: 4, marginBottom: 24,
              }}>Reserve</span>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: "#fff", marginBottom: 18 }}>
                Save your<br /><em style={{ color: T.accent }}>seat.</em>
              </h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                Limited spots available. Reserve yours below.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} y={24}>
            <div style={{ background: T.inkSoft, border: `1px solid ${T.borderDark}`, padding: "28px 24px" }}>
              <WebinarForm page={page} variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ padding: "32px clamp(20px, 5vw, 64px)", textAlign: "center", color: T.textMuted, fontFamily: "'Inter',sans-serif", fontSize: 12, background: T.bg }}>
        © {new Date().getFullYear()} AddedEducation. All rights reserved.
      </footer>
    </div>
  )
}

const titleStyle = {
  fontFamily: "'Fraunces',serif", fontWeight: 400, color: T.text,
  fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 18,
}
const subtitleStyle = {
  fontFamily: "'Inter',sans-serif", fontSize: 16, color: T.textMuted, lineHeight: 1.7, maxWidth: 720,
}

function Eyebrow({ children }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
      letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent,
      borderBottom: `2px solid ${T.accent}`, paddingBottom: 4, marginBottom: 24,
    }}>{children}</span>
  )
}

function SideMeta({ label, value }) {
  return (
    <div>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 500, color: T.text, lineHeight: 1.2 }}>{value}</p>
    </div>
  )
}

function RenderContent({ data, variant = "list" }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    if (variant === "grid") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {data.body.map((item, i) => (
            <div key={i} style={{ borderTop: `2px solid ${T.ink}`, paddingTop: 18, transition: "transform 0.25s ease" }}
                 onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                 onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <span style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.accent, letterSpacing: "0.18em", marginBottom: 10 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.title && <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 500, fontSize: 22, color: T.text, marginBottom: 10, lineHeight: 1.2 }}>{item.title}</h3>}
              {item.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>{item.description}</p>}
            </div>
          ))}
        </div>
      )
    }
    return (
      <div style={{ display: "grid", gap: 24 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{ borderTop: `1px solid ${T.border}`, paddingTop: 18, transition: "padding-left 0.25s ease" }}
               onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
               onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
            {item.title && <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 500, fontSize: 22, color: T.text, marginBottom: 8, lineHeight: 1.2 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: T.textMuted, lineHeight: 1.7 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  return (
    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: T.textMuted, lineHeight: 1.75, maxWidth: 720 }}>
      {data.body}
    </p>
  )
}

function EditorialSpeakerCard({ s }) {
  const photo = getResponsiveSrc(s.photo)
  return (
    <div style={{ background: T.cream, border: `1px solid ${T.border}`, padding: 26, transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 18px 50px rgba(0,0,0,0.08)" }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
      {photo.src && (
        <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", background: T.bg, marginBottom: 18 }}>
          <img src={photo.src} srcSet={photo.srcSet || undefined} alt={s.name} loading="lazy" decoding="async"
               style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
        </div>
      )}
      {s.name && <h4 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500, color: T.text, marginBottom: 4, lineHeight: 1.2 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.textMuted, marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: T.textMuted, lineHeight: 1.65 }}>{s.description}</p>}
      {s.linkedin && (
        <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", borderBottom: `1px solid ${T.accent}` }}>
          LinkedIn →
        </a>
      )}
    </div>
  )
}
