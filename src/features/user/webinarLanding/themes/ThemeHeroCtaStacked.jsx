import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import { LandingHeader, Reveal, getResponsiveSrc } from "../themeShared"

const T = {
  bg: "#FBFBFD", surface: "#FFFFFF", surfaceMuted: "#F5F5F7",
  text: "#0E0E0E", textMuted: "#6B6863",
  accent: "#C8354B", accentDeep: "#9E2538",
  border: "rgba(0,0,0,0.08)",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
}

export default function ThemeHeroCtaStacked({ page }) {
  const formRef = useRef(null)
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @keyframes hcs-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        @keyframes hcs-shimmer {
          0%   { background-position: -200% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      <LandingHeader variant="dark" onCtaClick={scrollToForm} />

      {/* ── HERO — full dark with CTA + optional image bg ── */}
      <section style={{ position: "relative", width: "100%", background: T.ink, color: "#fff", padding: "120px clamp(20px, 5vw, 64px)", overflow: "hidden", minHeight: heroImg.src ? "80vh" : "auto" }}>
        {heroImg.src && (
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img
              src={heroImg.src}
              srcSet={heroImg.srcSet || undefined}
              sizes={heroImg.sizes || undefined}
              alt=""
              fetchpriority="high"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,14,14,0.5) 0%, rgba(14,14,14,0.7) 60%, rgba(14,14,14,0.92) 100%)" }} />
          </div>
        )}

        <div aria-hidden style={{
          position: "absolute", top: "20%", right: "10%", width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,53,75,0.35) 0%, transparent 65%)",
          filter: "blur(50px)", animation: "hcs-pulse 6s ease-in-out infinite", pointerEvents: "none", zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{
              display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent,
              border: `1px solid ${T.accent}`, borderRadius: 999, padding: "6px 14px", marginBottom: 28,
            }}>Free webinar</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1.02, letterSpacing: "-0.025em", marginBottom: 22 }}>
              {page.webinar_title}
            </h1>
          </Reveal>
          {page.webinar_subtitle && (
            <Reveal delay={220}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, maxWidth: 720, margin: "0 auto 36px" }}>
                {page.webinar_subtitle}
              </p>
            </Reveal>
          )}

          <Reveal delay={340}>
            <button
              onClick={scrollToForm}
              style={{
                position: "relative", padding: "16px 38px", background: T.accent, color: "#fff",
                border: "none", borderRadius: 999, fontFamily: "'Inter',sans-serif",
                fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                boxShadow: "0 8px 24px rgba(200,53,75,0.35)", overflow: "hidden",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.accentDeep; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,53,75,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,53,75,0.35)" }}
            >
              Reserve my spot →
            </button>
          </Reveal>

          {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
            <Reveal delay={440}>
              <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.12)", maxWidth: 760, margin: "56px auto 0" }}>
                {page.webinar_date  && <DarkMeta label="Date"   value={page.webinar_date} />}
                {page.webinar_time  && <DarkMeta label="Time"   value={page.webinar_time} />}
                {page.webinar_place && <DarkMeta label="Where"  value={page.webinar_place} />}
                {page.grade_years   && <DarkMeta label="For"    value={page.grade_years} />}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Why ── */}
      {page.why_data && (
        <section style={{ width: "100%", padding: "96px clamp(20px, 5vw, 64px)", background: T.bg }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal><Eyebrow>Why this matters</Eyebrow><h2 style={titleStyle}>{page.why_data.title || "Why you need this"}</h2></Reveal>
            {page.why_data.subtitle && <Reveal delay={80}><p style={subtitleStyle}>{page.why_data.subtitle}</p></Reveal>}
            <Reveal delay={160}><RenderContent data={page.why_data} /></Reveal>
          </div>
        </section>
      )}

      {/* ── What you'll learn — numbered list ── */}
      {page.learn_data && (
        <section style={{ width: "100%", padding: "96px clamp(20px, 5vw, 64px)", background: T.surfaceMuted, borderTop: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal><Eyebrow>What you'll learn</Eyebrow><h2 style={titleStyle}>{page.learn_data.title || "What you'll learn"}</h2></Reveal>
            {page.learn_data.subtitle && <Reveal delay={80}><p style={subtitleStyle}>{page.learn_data.subtitle}</p></Reveal>}
            <Reveal delay={160}><RenderContent data={page.learn_data} variant="numbered" /></Reveal>
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section style={{ width: "100%", padding: "96px clamp(20px, 5vw, 64px)", background: T.bg, borderTop: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal><Eyebrow>Your hosts</Eyebrow><h2 style={titleStyle}>Meet your speakers</h2></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, marginTop: 40 }}>
              {page.speakers.map((s, i) => (
                <Reveal key={i} delay={80 + i * 80}><LightSpeakerCard s={s} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FORM section ── */}
      <section ref={formRef} style={{ width: "100%", padding: "96px clamp(20px, 5vw, 64px)", background: T.ink, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,53,75,0.25), transparent 65%)", filter: "blur(50px)" }} />
        <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 40px)", lineHeight: 1.1, marginBottom: 12 }}>
                Save your seat
              </h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                Limited spots available. Reserve yours below.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80} y={20}>
            <div style={{ background: T.inkSoft, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
              <WebinarForm page={page} variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About — CENTERED ── */}
      {page.about_data && (
        <section style={{ width: "100%", padding: "96px clamp(20px, 5vw, 64px)", background: T.bg, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
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
                      display: "inline-block", padding: "8px 16px", borderRadius: 999,
                      border: `1px solid ${T.border}`, background: T.surface, color: T.text,
                      fontFamily: "'Inter',sans-serif", fontSize: 13,
                    }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "32px clamp(20px, 5vw, 64px)", textAlign: "center", color: T.textMuted, fontFamily: "'Inter',sans-serif", fontSize: 12, background: T.bg }}>
        © {new Date().getFullYear()} AddedEducation. All rights reserved.
      </footer>
    </div>
  )
}

const titleStyle = {
  fontFamily: "'Fraunces',serif", fontWeight: 400, color: T.text,
  fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 18,
}
const subtitleStyle = {
  fontFamily: "'Inter',sans-serif", fontSize: 16, color: T.textMuted, lineHeight: 1.7, maxWidth: 720,
}

function Eyebrow({ children }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
      letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted,
      border: `1px solid ${T.border}`, borderRadius: 999, padding: "6px 14px", marginBottom: 18,
    }}>{children}</span>
  )
}

function DarkMeta({ label, value }) {
  return (
    <div>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: "#fff" }}>{value}</p>
    </div>
  )
}

function RenderContent({ data, variant = "card" }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    if (variant === "numbered") {
      return (
        <ol style={{ listStyle: "none", padding: 0, margin: "32px 0 0", display: "grid", gap: 16 }}>
          {data.body.map((item, i) => (
            <li key={i} style={{
              display: "flex", gap: 18, alignItems: "flex-start", padding: "22px 24px",
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.borderColor = "rgba(200,53,75,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = T.border }}>
              <span style={{
                width: 36, height: 36, flexShrink: 0, borderRadius: 999, background: T.accent, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13,
              }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                {item.title && <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 16, color: T.text, marginBottom: 6 }}>{item.title}</h3>}
                {item.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>{item.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      )
    }
    return (
      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, transition: "transform 0.2s ease, border-color 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(200,53,75,0.4)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = T.border }}>
            {item.title && <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 16, color: T.text, marginBottom: 8 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  return (
    <p style={{ marginTop: 24, fontFamily: "'Inter',sans-serif", fontSize: 16, color: T.textMuted, lineHeight: 1.75, maxWidth: 760 }}>
      {data.body}
    </p>
  )
}

function LightSpeakerCard({ s }) {
  const photo = getResponsiveSrc(s.photo)
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: "center",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.08)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
      {photo.src && (
        <div style={{ width: 96, height: 96, borderRadius: 999, overflow: "hidden", background: T.surfaceMuted, margin: "0 auto 16px" }}>
          <img src={photo.src} srcSet={photo.srcSet || undefined} alt={s.name} loading="lazy" decoding="async"
               style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      {s.name && <h4 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 500, color: T.text, marginBottom: 6 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.accent, fontWeight: 600, marginBottom: 4 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.textMuted, marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: T.textMuted, lineHeight: 1.65, textAlign: "left" }}>{s.description}</p>}
      {s.linkedin && (
        <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.accent, textDecoration: "none", borderBottom: `1px solid ${T.accent}` }}>
          LinkedIn ↗
        </a>
      )}
    </div>
  )
}
