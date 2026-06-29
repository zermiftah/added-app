import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import { LandingHeader, LandingFooter, Reveal, getResponsiveSrc, C, sans, serif, mono } from "../themeShared"

const NAV_SECTIONS = [
  { label: "Webinar", id: "webinar" },
  { label: "Why Attend", id: "why" },
  { label: "What You'll Learn", id: "learn" },
  { label: "Speakers", id: "speakers" },
  { label: "About", id: "about" },
]


// Format date range: "12 – 14 Jul 2025" or just "12 Jul 2025"
function formatDateRange(page) {
  const label = page.webinar_date
  const start = page.date_start
  const end   = page.date_end
  if (label) return label
  if (!start) return null
  const opts = { day: "numeric", month: "short", year: "numeric" }
  const s = new Date(start).toLocaleDateString("en-GB", opts)
  if (!end || end === start) return s
  return `${s} – ${new Date(end).toLocaleDateString("en-GB", opts)}`
}

export default function ThemeHeroFormSide({ page }) {
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: C.ink, minHeight: "100vh", color: "#fff" }}>
      <style>{`
        @keyframes hf-glow {
          0%,100% { transform: translate(0,0) scale(1); opacity:.55; }
          50%      { transform: translate(18px,-12px) scale(1.08); opacity:.8; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <LandingHeader variant="dark" sections={NAV_SECTIONS} formId="register" />

      {/* ── HERO ── */}
      <section id="webinar" style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {heroImg.src && (
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src={heroImg.src} srcSet={heroImg.srcSet} sizes="100vw" alt=""
              fetchpriority="high" decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(14,14,14,0.96) 0%, rgba(14,14,14,0.82) 55%, rgba(14,14,14,0.6) 100%)" }} />
          </div>
        )}
        <div aria-hidden style={{
          position: "absolute", top: "15%", left: "2%", width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,53,75,0.32) 0%, transparent 65%)",
          filter: "blur(45px)", animation: "hf-glow 9s ease-in-out infinite", pointerEvents: "none", zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "120px clamp(20px,5vw,56px) 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 56, alignItems: "center" }}>

            {/* Left: text */}
            <div>
              <Reveal>
                <span style={{
                  display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent,
                  border: `1px solid ${C.accent}`, borderRadius: 999, padding: "6px 16px", marginBottom: 28,
                }}>Free Webinar</span>
              </Reveal>
              <Reveal delay={100}>
                <h1 style={{ fontFamily: serif, fontWeight: 400, fontStyle: "italic", color: "#fff",
                  fontSize: "clamp(36px,5vw,62px)", lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 20 }}>
                  {page.webinar_title}
                </h1>
              </Reveal>
              {page.webinar_subtitle && (
                <Reveal delay={200}>
                  <p style={{ fontFamily: sans, fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, maxWidth: 500, marginBottom: 32 }}>
                    {page.webinar_subtitle}
                  </p>
                </Reveal>
              )}
              {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
                <Reveal delay={300}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 20, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    {[["Date", formatDateRange(page)], ["Time", page.webinar_time], ["Where", page.webinar_place], ["For", page.grade_years]].filter(([,v]) => v).map(([label, value]) => (
                      <div key={label}>
                        <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 5 }}>{label}</p>
                        <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: "#fff" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right: form */}
            <Reveal delay={180} y={32}>
              <div id="register" ref={formRef} style={{
                background: "rgba(22,22,22,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "32px 28px",
                boxShadow: "0 28px 70px rgba(0,0,0,0.45)",
              }}>
                <h3 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: "#fff", marginBottom: 6 }}>Save your seat</h3>
                <p style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>Limited spots — register now.</p>
                <WebinarForm page={page} variant="dark" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      {page.why_data && (
        <section id="why" style={{ padding: "96px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <Eyebrow>Why this matters</Eyebrow>
              <H2>{page.why_data.title || "Why you need this"}</H2>
            </Reveal>
            {page.why_data.subtitle && <Reveal delay={80}><Sub>{page.why_data.subtitle}</Sub></Reveal>}
            <Reveal delay={160}><ContentDark data={page.why_data} /></Reveal>
          </div>
        </section>
      )}

      {/* ── Learn ── */}
      {page.learn_data && (
        <section id="learn" style={{ padding: "96px clamp(20px,5vw,56px)", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <Eyebrow>What you'll learn</Eyebrow>
              <H2>{page.learn_data.title || "What you'll learn"}</H2>
            </Reveal>
            {page.learn_data.subtitle && <Reveal delay={80}><Sub>{page.learn_data.subtitle}</Sub></Reveal>}
            <Reveal delay={160}><ContentDark data={page.learn_data} /></Reveal>
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section id="speakers" style={{ padding: "96px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal><Eyebrow>Your hosts</Eyebrow><H2>Speakers</H2></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginTop: 36 }}>
              {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerCard s={s} dark /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* ── About — centered ── */}
      {page.about_data && (
        <section id="about" style={{ padding: "96px clamp(20px,5vw,56px)", background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <Reveal><Eyebrow>About</Eyebrow><H2 center>About AddedEducation</H2></Reveal>
            {page.about_data.description && <Reveal delay={80}><Sub center>{page.about_data.description}</Sub></Reveal>}
            {page.about_data.universities?.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 28 }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(200,53,75,0.1)", fontFamily: sans, fontSize: 13, color: "#fff" }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <LandingFooter />
    </div>
  )
}

// ── shared primitives ──
function Eyebrow({ children }) {
  return <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "6px 14px", marginBottom: 20 }}>{children}</span>
}
function H2({ children, center }) {
  return <h2 style={{ fontFamily: serif, fontWeight: 400, color: "#fff", fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 18, textAlign: center ? "center" : "left" }}>{children}</h2>
}
function Sub({ children, center }) {
  return <p style={{ fontFamily: sans, fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 720, marginBottom: 32, textAlign: center ? "center" : "left", margin: center ? "0 auto 32px" : "0 0 32px" }}>{children}</p>
}

function ContentDark({ data }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 24px", transition: "border-color .25s, transform .25s" }}
               onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,53,75,.45)"; e.currentTarget.style.transform = "translateY(-2px)" }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.transform = "translateY(0)" }}>
            {item.title && <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 8 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: "rgba(255,255,255,.62)", lineHeight: 1.65 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontFamily: sans, fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.75, maxWidth: 760 }}>{data.body}</p>
}

function SpeakerCard({ s }) {
  const { src, srcSet } = getResponsiveSrc(s.photo)
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 24, transition: "transform .25s, border-color .25s" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(200,53,75,.4)" }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)" }}>
      {src && <div style={{ width: 72, height: 72, borderRadius: 999, overflow: "hidden", marginBottom: 16, background: "#222" }}>
        <img src={src} srcSet={srcSet} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
      {s.name && <h4 style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: sans, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: sans, fontSize: 13.5, color: "rgba(255,255,255,.62)", lineHeight: 1.65 }}>{s.description}</p>}
      {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: sans, fontSize: 12, color: C.accent, textDecoration: "none", borderBottom: `1px solid ${C.accent}` }}>LinkedIn ↗</a>}
    </div>
  )
}
