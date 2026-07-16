import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import {
  LandingHeader, LandingFooter, Reveal, QuoteSection, WhyFamiliesSection,
  getResponsiveSrc, Eyebrow, H2, Sub, ContentBlock, SpeakerCard, formatDateRange, formatWebinarTime, usePageTracking,
  C, sans, serif, mono,
} from "../themeShared"

const NAV_SECTIONS = [
  { label: "Webinar", id: "webinar" },
  { label: "Why Attend", id: "why" },
  { label: "What You'll Learn", id: "learn" },
  { label: "Speakers", id: "speakers" },
  { label: "About", id: "about" },
]

/**
 * ThemeCenteredMinimal — no hero image, typography-led, single centered
 * column throughout (Linear/Vercel-style). A thin ribbon crop of the hero
 * photo appears once, below the fold, as a quiet visual break rather than
 * a background. Best for founders/speakers who want a "quiet luxury" feel.
 */
export default function ThemeCenteredMinimal({ page }) {
  usePageTracking(page)
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <div style={{ background: C.ink, minHeight: "100vh", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes cm-glow { 0%,100% { opacity: .5; transform: translate(-50%,-50%) scale(1); } 50% { opacity: .75; transform: translate(-50%,-50%) scale(1.1); } }
      `}</style>

      <LandingHeader variant="dark" sections={NAV_SECTIONS} formId="register" />

      {/* ── HERO — pure typography, centered ── */}
      <section id="webinar" style={{ position: "relative", padding: "clamp(150px,18vw,210px) clamp(20px,5vw,56px) 90px", overflow: "hidden" }}>
        <div aria-hidden style={{
          position: "absolute", top: "8%", left: "50%", width: 640, height: 640,
          background: "radial-gradient(circle, rgba(200,53,75,0.24) 0%, transparent 65%)",
          filter: "blur(50px)", animation: "cm-glow 10s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{
              display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500,
              letterSpacing: "0.24em", textTransform: "uppercase", color: C.accent,
              border: `1px solid ${C.accent}`, borderRadius: 999, padding: "7px 18px", marginBottom: 32,
            }}>Free Webinar</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontStyle: "italic", color: "#fff",
              fontSize: "clamp(34px,5.4vw,64px)", lineHeight: 1.08, letterSpacing: "-0.025em", marginBottom: 24 }}>
              {page.webinar_title}
            </h1>
          </Reveal>
          {page.webinar_subtitle && (
            <Reveal delay={180}>
              <p style={{ fontFamily: sans, fontSize: 17, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
                {page.webinar_subtitle}
              </p>
            </Reveal>
          )}
          {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
            <Reveal delay={240}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 28px", marginBottom: 40 }}>
                {[["Date", formatDateRange(page)], ["Time", formatWebinarTime(page.webinar_time)], ["Where", page.webinar_place], ["For", page.grade_years]].filter(([,v]) => v).map(([label, value]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginRight: 6 }}>{label}</span>
                    <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: "#fff" }}>{value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
          <Reveal delay={300}>
            <button
              onClick={scrollToForm}
              style={{
                background: C.accent, color: "#fff", border: "none", cursor: "pointer",
                padding: "15px 34px", borderRadius: 100, fontSize: 14, fontWeight: 600,
                fontFamily: sans, letterSpacing: "0.02em", transition: "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentDeep}
              onMouseLeave={e => e.currentTarget.style.background = C.accent}
            >
              Reserve your seat →
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── quiet visual break — thin image ribbon ── */}
      {heroImg.src && (
        <div style={{ width: "100%", height: 180, overflow: "hidden", position: "relative", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <img src={heroImg.src} srcSet={heroImg.srcSet} sizes="100vw" alt="" loading="lazy" decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(35%)", opacity: 0.55 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,14,14,0.5) 0%, rgba(14,14,14,0.75) 100%)" }} />
        </div>
      )}

      {/* ── Why / Learn — single centered column, no cards grid ── */}
      {page.why_data && (
        <section id="why" style={{ padding: "96px clamp(20px,5vw,56px)", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <Reveal><Eyebrow>Why this matters</Eyebrow><H2 center>{page.why_data.title || "Why you need this"}</H2></Reveal>
            {page.why_data.subtitle && <Reveal delay={80}><Sub center>{page.why_data.subtitle}</Sub></Reveal>}
            <div style={{ textAlign: "left" }}>
              <Reveal delay={160}><ContentBlock data={page.why_data} /></Reveal>
            </div>
          </div>
        </section>
      )}

      {page.learn_data && (
        <section id="learn" style={{ padding: "96px clamp(20px,5vw,56px)", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <Reveal><Eyebrow>What you'll learn</Eyebrow><H2 center>{page.learn_data.title || "What you'll learn"}</H2></Reveal>
            {page.learn_data.subtitle && <Reveal delay={80}><Sub center>{page.learn_data.subtitle}</Sub></Reveal>}
            <div style={{ textAlign: "left" }}>
              <Reveal delay={160}><ContentBlock data={page.learn_data} /></Reveal>
            </div>
          </div>
        </section>
      )}

      {page.speakers?.length > 0 && (
        <section id="speakers" style={{ padding: "96px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <Reveal><Eyebrow>Your hosts</Eyebrow><H2 center>Speakers</H2></Reveal>
          </div>
          <div style={{ maxWidth: 780, margin: "36px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerCard s={s} /></Reveal>)}
          </div>
        </section>
      )}

      {/* ── About ── */}
      {page.about_data && (
        <section id="about" style={{ padding: "96px clamp(20px,5vw,56px)", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <Reveal><Eyebrow>About</Eyebrow><H2 center>About AddedEducation</H2></Reveal>
            {page.about_data.description && <Reveal delay={80}><Sub center>{page.about_data.description}</Sub></Reveal>}
            {page.about_data.universities?.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(200,53,75,0.1)", fontFamily: sans, fontSize: 13, color: "#fff" }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <QuoteSection quote={page.quote_data} variant="dark" />
      <WhyFamiliesSection data={page.why_families_data} variant="dark" />

      {/* ── Registration — its own centered section, not a floating card ── */}
      <section id="register" ref={formRef} style={{ padding: "96px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
          <Reveal><Eyebrow>Last step</Eyebrow><H2 center>Save your seat</H2></Reveal>
          <Reveal delay={80}><Sub center>Limited spots — register now to join us.</Sub></Reveal>
        </div>
        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "left" }}>
          <Reveal delay={140}><WebinarForm page={page} variant="dark" /></Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
