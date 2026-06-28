import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import { LandingHeader, Reveal, getResponsiveSrc } from "../themeShared"

const T = {
  bg: "#0E0E0E", inkSoft: "#1A1A1A", inkDeep: "#080808",
  text: "#FFFFFF", textMuted: "rgba(255,255,255,0.65)",
  accent: "#C8354B", accentSoft: "rgba(200,53,75,0.12)",
  border: "rgba(255,255,255,0.08)",
}

export default function ThemeHeroFormSide({ page }) {
  const formRef = useRef(null)
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @keyframes hf-float-glow {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50%      { transform: translate(20px, -10px); opacity: 0.85; }
        }
      `}</style>

      <LandingHeader variant="dark" onCtaClick={scrollToForm} />

      {/* ── HERO with side form ── */}
      <section style={{ position: "relative", width: "100%", padding: "80px clamp(20px, 5vw, 64px) 80px", overflow: "hidden" }}>
        {heroImg.src && (
          <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
            <img
              src={heroImg.src}
              srcSet={heroImg.srcSet || undefined}
              sizes={heroImg.sizes || undefined}
              alt=""
              fetchpriority="high"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(14,14,14,0.92) 0%, rgba(14,14,14,0.78) 50%, rgba(14,14,14,0.55) 100%)" }} />
          </div>
        )}

        <div aria-hidden style={{
          position: "absolute", top: "10%", left: "5%", width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,53,75,0.35) 0%, transparent 60%)",
          filter: "blur(40px)", animation: "hf-float-glow 9s ease-in-out infinite", pointerEvents: "none", zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56, alignItems: "center" }}>
          <div>
            <Reveal>
              <span style={{
                display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.22em", textTransform: "uppercase", color: T.accent,
                border: `1px solid ${T.accent}`, borderRadius: 999, padding: "6px 14px", marginBottom: 24,
              }}>Free webinar</span>
            </Reveal>
            <Reveal delay={120}>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontStyle: "italic", color: T.text, fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 18 }}>
                {page.webinar_title}
              </h1>
            </Reveal>
            {page.webinar_subtitle && (
              <Reveal delay={220}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, color: T.textMuted, lineHeight: 1.6, maxWidth: 540, marginBottom: 28 }}>
                  {page.webinar_subtitle}
                </p>
              </Reveal>
            )}

            <Reveal delay={320}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
                {page.webinar_date && <Meta label="Date"   value={page.webinar_date} />}
                {page.webinar_time && <Meta label="Time"   value={page.webinar_time} />}
                {page.webinar_place && <Meta label="Where" value={page.webinar_place} />}
                {page.grade_years   && <Meta label="For"   value={page.grade_years} />}
              </div>
            </Reveal>
          </div>

          <Reveal delay={160} y={32}>
            <div ref={formRef} style={{
              background: "rgba(26,26,26,0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${T.border}`,
              borderRadius: 20, padding: "32px 28px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }}>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500, color: T.text, marginBottom: 6 }}>Save your seat</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.textMuted, marginBottom: 20 }}>Limited spots — register now.</p>
              <WebinarForm page={page} variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      {page.why_data && (
        <Section borderTop>
          <Reveal><Eyebrow>Why this matters</Eyebrow><SectionTitle>{page.why_data.title || "Why you need this"}</SectionTitle></Reveal>
          {page.why_data.subtitle && <Reveal delay={80}><p style={subtitleStyle}>{page.why_data.subtitle}</p></Reveal>}
          <Reveal delay={160}><RenderContent data={page.why_data} /></Reveal>
        </Section>
      )}

      {page.learn_data && (
        <Section borderTop background={T.inkDeep}>
          <Reveal><Eyebrow>What you'll learn</Eyebrow><SectionTitle>{page.learn_data.title || "What you'll learn"}</SectionTitle></Reveal>
          {page.learn_data.subtitle && <Reveal delay={80}><p style={subtitleStyle}>{page.learn_data.subtitle}</p></Reveal>}
          <Reveal delay={160}><RenderContent data={page.learn_data} /></Reveal>
        </Section>
      )}

      {page.speakers?.length > 0 && (
        <Section borderTop>
          <Reveal><Eyebrow>Your hosts</Eyebrow><SectionTitle>Speakers</SectionTitle></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginTop: 32 }}>
            {page.speakers.map((s, i) => (
              <Reveal key={i} delay={80 + i * 80}><SpeakerCard s={s} /></Reveal>
            ))}
          </div>
        </Section>
      )}

      {page.about_data && (
        <Section borderTop background={T.inkDeep} centered>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Eyebrow>About</Eyebrow>
              <SectionTitle align="center">About AddedEducation</SectionTitle>
            </div>
          </Reveal>
          {page.about_data.description && (
            <Reveal delay={80}>
              <p style={{ ...subtitleStyle, margin: "0 auto", textAlign: "center" }}>
                {page.about_data.description}
              </p>
            </Reveal>
          )}
          {Array.isArray(page.about_data.universities) && page.about_data.universities.length > 0 && (
            <Reveal delay={160}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 28 }}>
                {page.about_data.universities.map((u, i) => (
                  <span key={i} style={{
                    display: "inline-block", padding: "8px 16px", borderRadius: 999,
                    border: `1px solid ${T.border}`, background: T.accentSoft,
                    color: T.text, fontFamily: "'Inter',sans-serif", fontSize: 13,
                  }}>{u}</span>
                ))}
              </div>
            </Reveal>
          )}
        </Section>
      )}

      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "32px clamp(20px, 5vw, 64px)", textAlign: "center", color: T.textMuted, fontFamily: "'Inter',sans-serif", fontSize: 12 }}>
        © {new Date().getFullYear()} AddedEducation. All rights reserved.
      </footer>
    </div>
  )
}

function Section({ children, borderTop, background, centered }) {
  return (
    <section style={{
      width: "100%", padding: "96px clamp(20px, 5vw, 64px)",
      borderTop: borderTop ? `1px solid ${T.border}` : "none",
      background: background || "transparent",
      textAlign: centered ? "center" : "left",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
    </section>
  )
}

const subtitleStyle = {
  fontFamily: "'Inter',sans-serif", fontSize: 16, color: T.textMuted, lineHeight: 1.7, maxWidth: 760, marginBottom: 32,
}

function Eyebrow({ children }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
      letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
      border: `1px solid ${T.border}`, borderRadius: 999, padding: "6px 14px", marginBottom: 20,
    }}>{children}</span>
  )
}

function SectionTitle({ children, align = "left" }) {
  return (
    <h2 style={{
      fontFamily: "'Fraunces',serif", fontWeight: 400, color: T.text,
      fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em",
      marginBottom: 18, textAlign: align,
    }}>{children}</h2>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: T.text }}>{value}</p>
    </div>
  )
}

function RenderContent({ data }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    return (
      <div style={{ display: "grid", gap: 18 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{ background: T.inkSoft, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, transition: "border-color 0.25s ease, transform 0.25s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,53,75,0.4)"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)" }}>
            {item.title && <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 16, color: T.text, marginBottom: 8 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  if (data.body) {
    return <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: T.textMuted, lineHeight: 1.75, maxWidth: 760 }}>{data.body}</p>
  }
  return null
}

function SpeakerCard({ s }) {
  const photo = getResponsiveSrc(s.photo)
  return (
    <div style={{
      background: T.inkSoft, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24,
      display: "flex", flexDirection: "column", gap: 14, transition: "transform 0.25s ease, border-color 0.25s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(200,53,75,0.4)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = T.border }}>
      {photo.src && (
        <div style={{ width: 80, height: 80, borderRadius: 999, overflow: "hidden", background: "#222" }}>
          <img src={photo.src} srcSet={photo.srcSet || undefined} alt={s.name} loading="lazy" decoding="async"
               style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div>
        {s.name && <h4 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 500, color: T.text, marginBottom: 4 }}>{s.name}</h4>}
        {s.title && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.accent, fontWeight: 600, marginBottom: 2 }}>{s.title}</p>}
        {s.position && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.textMuted, marginBottom: 10 }}>{s.position}</p>}
        {s.description && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: T.textMuted, lineHeight: 1.65 }}>{s.description}</p>}
        {s.linkedin && (
          <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.accent, textDecoration: "none", borderBottom: `1px solid ${T.accent}` }}>
            LinkedIn ↗
          </a>
        )}
      </div>
    </div>
  )
}
