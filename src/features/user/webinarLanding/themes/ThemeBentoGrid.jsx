import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import {
  LandingHeader, LandingFooter, Reveal, WhyFamiliesSection,
  getResponsiveSrc, Eyebrow, H2, Sub, SpeakerCard, formatDateRange, formatWebinarTime,
  C, sans, serif, mono,
} from "../themeShared"

const NAV_SECTIONS = [
  { label: "Webinar", id: "webinar" },
  { label: "Why Attend", id: "why" },
  { label: "What You'll Learn", id: "learn" },
  { label: "Speakers", id: "speakers" },
  { label: "About", id: "about" },
]

const cardBase = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 20,
}

/**
 * ThemeBentoGrid — premium two-zone hero: headline + a full-height,
 * never-scrolled registration card side by side. The "bento" identity
 * lives in a supporting mosaic strip below the hero (photo / stat / quote),
 * and again in the Why/Learn sections as numbered card grids.
 */
export default function ThemeBentoGrid({ page }) {
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })

  return (
    <div style={{ background: C.ink, minHeight: "100vh", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes bg-glow { 0%,100% { opacity:.5; transform: translate(0,0) scale(1); } 50% { opacity:.75; transform: translate(14px,-10px) scale(1.06); } }
        .bg-hero-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 40px; align-items: start; }
        .bg-mosaic { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 880px) {
          .bg-hero-grid { grid-template-columns: 1fr; }
          .bg-mosaic { grid-template-columns: 1fr; }
        }
      `}</style>

      <LandingHeader variant="dark" sections={NAV_SECTIONS} formId="register" />

      {/* ── HERO — headline + full-size form, side by side ── */}
      <section id="webinar" style={{ position: "relative", padding: "clamp(120px,13vw,160px) clamp(20px,5vw,56px) 72px", overflow: "hidden" }}>
        <div aria-hidden style={{
          position: "absolute", top: "10%", left: "6%", width: 480, height: 480,
          background: "radial-gradient(circle, rgba(200,53,75,0.26) 0%, transparent 65%)",
          filter: "blur(50px)", animation: "bg-glow 10s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto" }}>
          <div className="bg-hero-grid">
            {/* Left: headline */}
            <div>
              <Reveal>
                <span style={{
                  display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent,
                  border: `1px solid ${C.accent}`, borderRadius: 999, padding: "6px 16px", marginBottom: 26,
                }}>Free Webinar</span>
              </Reveal>
              <Reveal delay={100}>
                <h1 style={{ fontFamily: serif, fontWeight: 400, fontStyle: "italic", color: "#fff",
                  fontSize: "clamp(34px,4.6vw,58px)", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 20 }}>
                  {page.webinar_title}
                </h1>
              </Reveal>
              {page.webinar_subtitle && (
                <Reveal delay={180}><p style={{ fontFamily: sans, fontSize: 16.5, color: "rgba(255,255,255,0.68)", lineHeight: 1.65, maxWidth: 480, marginBottom: 32 }}>{page.webinar_subtitle}</p></Reveal>
              )}

              {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
                <Reveal delay={240}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 32 }}>
                    {[["Date", formatDateRange(page)], ["Time", formatWebinarTime(page.webinar_time)], ["Where", page.webinar_place], ["For", page.grade_years]].filter(([,v]) => v).map(([label, value]) => (
                      <div key={label} style={{ ...cardBase, padding: "14px 16px" }}>
                        <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{label}</p>
                        <p style={{ fontFamily: sans, fontSize: 13.5, fontWeight: 500, color: "#fff" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              <Reveal delay={300}>
                <button onClick={scrollToForm} className="bg-mobile-cta" style={{
                  display: "none",
                  background: C.accent, color: "#fff", border: "none", cursor: "pointer",
                  padding: "14px 30px", borderRadius: 100, fontSize: 14, fontWeight: 600,
                  fontFamily: sans, letterSpacing: "0.02em",
                }}>
                  Reserve your seat →
                </button>
              </Reveal>
              <style>{`@media (max-width: 880px) { .bg-mobile-cta { display: inline-block !important; } }`}</style>
            </div>

            {/* Right: full, never-scrolled registration card */}
            <Reveal delay={160}>
              <div id="register" ref={formRef} style={{
                ...cardBase, padding: "34px 30px", boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
                background: "rgba(255,255,255,0.045)",
              }}>
                <h3 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: "#fff", marginBottom: 6 }}>Save your seat</h3>
                <p style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>Limited spots — register now.</p>
                <WebinarForm page={page} variant="dark" />
              </div>
            </Reveal>
          </div>

          {/* ── Supporting bento mosaic — photo / stat / quote ── */}
          <div className="bg-mosaic" style={{ marginTop: 48 }}>
            {heroImg.src && (
              <Reveal delay={100}>
                <div style={{ ...cardBase, padding: 0, overflow: "hidden", position: "relative", height: 220 }}>
                  <img src={heroImg.src} srcSet={heroImg.srcSet} sizes="(max-width:880px) 100vw, 33vw" alt=""
                    fetchpriority="high" loading="eager" decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,14,14,0.6) 0%, transparent 55%)" }} />
                  <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>On campus</span>
                </div>
              </Reveal>
            )}

            <Reveal delay={160}>
              <div style={{
                ...cardBase, border: "none", height: 220, padding: "26px 24px",
                display: "flex", flexDirection: "column", justifyContent: "center",
                background: `linear-gradient(135deg, ${C.accentDeep} 0%, ${C.accent} 100%)`,
              }}>
                <p style={{ fontFamily: serif, fontSize: 40, fontWeight: 500, color: "#fff", marginBottom: 6, lineHeight: 1 }}>3,200+</p>
                <p style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>Families who've registered for our sessions</p>
              </div>
            </Reveal>

            {page.quote_data?.message && (
              <Reveal delay={220}>
                <div style={{ ...cardBase, height: 220, padding: "26px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <svg width="22" height="16" viewBox="0 0 32 24" style={{ opacity: 0.45, marginBottom: 12 }}>
                    <text x="0" y="20" fill="#fff" fontSize="40" fontFamily="Georgia,serif" fontWeight="700">"</text>
                  </svg>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 15, color: "#fff", lineHeight: 1.5, marginBottom: 10 }}>
                    {page.quote_data.message.length > 100 ? page.quote_data.message.slice(0, 100) + "…" : page.quote_data.message}
                  </p>
                  {page.quote_data.author && (
                    <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{page.quote_data.author}</p>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Why — numbered card grid ── */}
      {page.why_data && (
        <section id="why" style={{ padding: "88px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <Reveal><Eyebrow>Why this matters</Eyebrow><H2>{page.why_data.title || "Why you need this"}</H2></Reveal>
            {page.why_data.subtitle && <Reveal delay={80}><Sub>{page.why_data.subtitle}</Sub></Reveal>}
            {Array.isArray(page.why_data.body) ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 12 }}>
                {page.why_data.body.map((item, i) => (
                  <Reveal key={i} delay={100 + i * 60}>
                    <div style={{ ...cardBase, height: "100%", padding: "26px 24px" }}>
                      <p style={{ fontFamily: mono, fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>{String(i + 1).padStart(2, "0")}</p>
                      {item.title && <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 8 }}>{item.title}</h3>}
                      {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: "rgba(255,255,255,.62)", lineHeight: 1.65 }}>{item.description}</p>}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal delay={120}><p style={{ fontFamily: sans, fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.75, maxWidth: 760 }}>{page.why_data.body}</p></Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── Learn — numbered card grid ── */}
      {page.learn_data && (
        <section id="learn" style={{ padding: "88px clamp(20px,5vw,56px)", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <Reveal><Eyebrow>What you'll learn</Eyebrow><H2>{page.learn_data.title || "What you'll learn"}</H2></Reveal>
            {page.learn_data.subtitle && <Reveal delay={80}><Sub>{page.learn_data.subtitle}</Sub></Reveal>}
            {Array.isArray(page.learn_data.body) ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 12 }}>
                {page.learn_data.body.map((item, i) => (
                  <Reveal key={i} delay={100 + i * 60}>
                    <div style={{ ...cardBase, height: "100%", padding: "26px 24px", background: "rgba(255,255,255,0.045)" }}>
                      <p style={{ fontFamily: mono, fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>{String(i + 1).padStart(2, "0")}</p>
                      {item.title && <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 8 }}>{item.title}</h3>}
                      {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: "rgba(255,255,255,.62)", lineHeight: 1.65 }}>{item.description}</p>}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal delay={120}><p style={{ fontFamily: sans, fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.75, maxWidth: 760 }}>{page.learn_data.body}</p></Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section id="speakers" style={{ padding: "88px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <Reveal><Eyebrow>Your hosts</Eyebrow><H2>Speakers</H2></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginTop: 30 }}>
              {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerCard s={s} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* ── About ── */}
      {page.about_data && (
        <section id="about" style={{ padding: "88px clamp(20px,5vw,56px)", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <Reveal><Eyebrow>About</Eyebrow><H2 center>About AddedEducation</H2></Reveal>
            {page.about_data.description && <Reveal delay={80}><Sub center>{page.about_data.description}</Sub></Reveal>}
            {page.about_data.universities?.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(200,53,75,0.1)", fontFamily: sans, fontSize: 13, color: "#fff" }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <WhyFamiliesSection data={page.why_families_data} variant="dark" />

      <LandingFooter />
    </div>
  )
}
