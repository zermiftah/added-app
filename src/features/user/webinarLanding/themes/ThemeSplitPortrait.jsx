import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import {
  LandingHeader, LandingFooter, Reveal, QuoteSection, WhyFamiliesSection,
  getResponsiveSrc, Eyebrow, H2, Sub, ContentBlock, SpeakerCard, formatDateRange, formatWebinarTime, usePageTracking, deriveLP,
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
 * ThemeSplitPortrait — hard-edged, full-height two-column split.
 * Left: fixed portrait image panel with a pinned editorial quote.
 * Right: scrollable content, form sits near the top (no glass/blur — flat card).
 * On mobile the image collapses to a 42vh top banner, content stacks below.
 */
export default function ThemeSplitPortrait({ page }) {
  usePageTracking(page)
  const lp = deriveLP(page?.webinar_place)
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: C.ink, minHeight: "100vh", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; }
        .sp-shell { display: flex; min-height: 100vh; }
        .sp-image-panel {
          position: sticky; top: 0; align-self: flex-start;
          width: 42%; height: 100vh; flex-shrink: 0; overflow: hidden;
        }
        .sp-content-panel { width: 58%; }
        @media (max-width: 900px) {
          .sp-shell { flex-direction: column; }
          .sp-image-panel { position: relative; width: 100%; height: 42vh; }
          .sp-content-panel { width: 100%; }
        }
      `}</style>

      <LandingHeader variant="dark" sections={NAV_SECTIONS} formId="register" lp={lp} />

      <div className="sp-shell">
        {/* ── Left: portrait image panel ── */}
        <div className="sp-image-panel" id="webinar">
          {heroImg.src && (
            <img src={heroImg.src} srcSet={heroImg.srcSet} sizes="(max-width: 900px) 100vw, 42vw" alt=""
              fetchpriority="high" loading="eager" decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,14,14,0.92) 0%, rgba(14,14,14,0.25) 45%, rgba(14,14,14,0.55) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 clamp(24px,3vw,48px) clamp(40px,6vw,64px)" }}>
            <span style={{
              display: "inline-block", fontFamily: mono, fontSize: 10, fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent,
              border: `1px solid ${C.accent}`, borderRadius: 999, padding: "5px 14px", marginBottom: 20,
            }}>Free Webinar</span>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontStyle: "italic", color: "#fff",
              fontSize: "clamp(28px,3.2vw,42px)", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
              {page.webinar_title}
            </h1>
          </div>
        </div>

        {/* ── Right: content ── */}
        <div className="sp-content-panel">
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(120px,12vw,160px) clamp(24px,4vw,56px) 80px" }}>

            {page.webinar_subtitle && (
              <Reveal><p style={{ fontFamily: sans, fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: 28 }}>{page.webinar_subtitle}</p></Reveal>
            )}

            {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
              <Reveal delay={80}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 18, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 36 }}>
                  {[["Date", formatDateRange(page)], ["Time", formatWebinarTime(page.webinar_time)], ["Where", page.webinar_place], ["For", page.grade_years]].filter(([,v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 5 }}>{label}</p>
                      <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: "#fff" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Flat form card — no blur, matches the hard-edged split aesthetic */}
            <Reveal delay={140}>
              <div id="register" ref={formRef} style={{
                background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "30px 26px", marginBottom: 72,
              }}>
                <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, color: "#fff", marginBottom: 6 }}>Save your seat</h3>
                <p style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 22 }}>Limited spots — register now.</p>
                <WebinarForm page={page} variant="dark" />
              </div>
            </Reveal>

            {page.why_data && (
              <div id="why" style={{ marginBottom: 72 }}>
                <Reveal><Eyebrow>Why this matters</Eyebrow><H2>{page.why_data.title || "Why you need this"}</H2></Reveal>
                {page.why_data.subtitle && <Reveal delay={80}><Sub>{page.why_data.subtitle}</Sub></Reveal>}
                <Reveal delay={160}><ContentBlock data={page.why_data} /></Reveal>
              </div>
            )}

            {page.learn_data && (
              <div id="learn" style={{ marginBottom: 72 }}>
                <Reveal><Eyebrow>What you'll learn</Eyebrow><H2>{page.learn_data.title || "What you'll learn"}</H2></Reveal>
                {page.learn_data.subtitle && <Reveal delay={80}><Sub>{page.learn_data.subtitle}</Sub></Reveal>}
                <Reveal delay={160}><ContentBlock data={page.learn_data} /></Reveal>
              </div>
            )}

            {page.speakers?.length > 0 && (
              <div id="speakers" style={{ marginBottom: 72 }}>
                <Reveal><Eyebrow>Your hosts</Eyebrow><H2>Speakers</H2></Reveal>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 30 }}>
                  {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerCard s={s} /></Reveal>)}
                </div>
              </div>
            )}

            {page.about_data && (
              <div id="about" style={{ marginBottom: 8 }}>
                <Reveal><Eyebrow>About</Eyebrow><H2>About AddedEducation</H2></Reveal>
                {page.about_data.description && <Reveal delay={80}><Sub>{page.about_data.description}</Sub></Reveal>}
                {page.about_data.universities?.length > 0 && (
                  <Reveal delay={160}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {page.about_data.universities.map((u, i) => (
                        <span key={i} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(200,53,75,0.1)", fontFamily: sans, fontSize: 13, color: "#fff" }}>{u}</span>
                      ))}
                    </div>
                  </Reveal>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuoteSection quote={page.quote_data} variant="dark" />
      <WhyFamiliesSection data={page.why_families_data} variant="dark" />

      <LandingFooter />
    </div>
  )
}
