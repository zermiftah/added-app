import { useRef } from "react"
import WebinarForm from "../WebinarForm"
import { LandingHeader, LandingFooter, Reveal, QuoteSection, WhyFamiliesSection, getResponsiveSrc, usePageTracking, deriveLP, C, sans, serif, mono } from "../themeShared"

const NAV_SECTIONS = [
  { label: "Session", id: "webinar" },
  { label: "Why Attend", id: "why" },
  { label: "What You'll Learn", id: "learn" },
  { label: "Speakers", id: "speakers" },
  { label: "About", id: "about" },
]

const cream = "#FBFBFD", creamWarm = "#F0EFEA", ink = "#0E0E0E", stone = "#6B6863"

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

// "19:00" -> "7:00 PM" — in-person invites read better in 12h time
function formatTime12h(t) {
  if (!t) return null
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(t).trim())
  if (!m) return t
  let h = parseInt(m[1], 10)
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${m[2]} ${ampm}`
}

export default function ThemeInPersonSession({ page }) {
  usePageTracking(page)
  const lp = deriveLP(page?.webinar_place)
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: cream, minHeight: "100vh", color: ink }}>
      <style>{`
        @keyframes ips-fade-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        * { box-sizing: border-box; }
      `}</style>

      <LandingHeader variant="light" sections={NAV_SECTIONS} formId="register" lp={lp} />

      {/* ── HERO — editorial, venue-forward, no online/webinar language ── */}
      <section id="webinar" style={{ position: "relative", width: "100%", minHeight: "94vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 96 }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: `linear-gradient(160deg, ${creamWarm} 0%, ${cream} 55%)` }} />
        <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-8%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,53,75,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1240, margin: "0 auto", padding: "40px clamp(20px,5vw,56px) 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 64, alignItems: "start" }}>

            {/* Left: editorial copy */}
            <div>
              <Reveal>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.maroon, border: `1px solid ${C.maroon}`, borderRadius: 999, padding: "7px 16px", marginBottom: 30 }}>
                  ● In-Person Session
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h1 style={{ fontFamily: serif, fontWeight: 400, fontStyle: "italic", color: ink, fontSize: "clamp(38px,5.2vw,66px)", lineHeight: 1.06, letterSpacing: "-0.025em", marginBottom: 24 }}>
                  {page.webinar_title}
                </h1>
              </Reveal>
              {page.webinar_subtitle && (
                <Reveal delay={200}>
                  <p style={{ fontFamily: sans, fontSize: 18, color: stone, lineHeight: 1.65, maxWidth: 520, marginBottom: 40, fontWeight: 350 }}>
                    {page.webinar_subtitle}
                  </p>
                </Reveal>
              )}

              {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
                <Reveal delay={300}>
                  <div style={{ background: "#fff", border: "1px solid rgba(14,14,14,0.08)", borderRadius: 16, padding: "26px 28px", boxShadow: "0 20px 50px -20px rgba(14,14,14,0.12)", maxWidth: 460 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 22 }}>
                      {[["Date", formatDateRange(page)], ["Time", formatTime12h(page.webinar_time)], ["Venue", page.webinar_place], ["For", page.grade_years]].filter(([, v]) => v).map(([label, value]) => (
                        <div key={label}>
                          <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.stoneLight || "#A6A39E", marginBottom: 6 }}>{label}</p>
                          <p style={{ fontFamily: sans, fontSize: 14.5, fontWeight: 600, color: ink }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right: form card */}
            <Reveal delay={180} y={32}>
              <div id="register" ref={formRef} style={{
                background: ink, borderRadius: 22, padding: "36px 32px",
                boxShadow: "0 32px 80px -20px rgba(14,14,14,0.35)",
              }}>
                <span style={{ display: "inline-block", fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accentRose || "#E8B4BD", marginBottom: 12 }}>
                  Seats are limited
                </span>
                <h3 style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Reserve your seat</h3>
                <p style={{ fontFamily: sans, fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 26 }}>In-person attendance only — please arrive 10 minutes early.</p>
                <WebinarForm page={page} variant="dark" sessionLabel="session" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why Attend ── */}
      {page.why_data && (
        <section id="why" style={{ padding: "100px clamp(20px,5vw,56px)", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <Eyebrow>Why attend in person</Eyebrow>
              <H2>{page.why_data.title || "Why this session matters"}</H2>
            </Reveal>
            {page.why_data.subtitle && <Reveal delay={80}><Sub>{page.why_data.subtitle}</Sub></Reveal>}
            <Reveal delay={160}><ContentLight data={page.why_data} /></Reveal>
          </div>
        </section>
      )}

      {/* ── Learn ── */}
      {page.learn_data && (
        <section id="learn" style={{ padding: "100px clamp(20px,5vw,56px)", background: creamWarm }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <Eyebrow>What you'll learn</Eyebrow>
              <H2>{page.learn_data.title || "What you'll walk away with"}</H2>
            </Reveal>
            {page.learn_data.subtitle && <Reveal delay={80}><Sub>{page.learn_data.subtitle}</Sub></Reveal>}
            <Reveal delay={160}><ContentLight data={page.learn_data} /></Reveal>
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section id="speakers" style={{ padding: "100px clamp(20px,5vw,56px)", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal><Eyebrow>Meet in person</Eyebrow><H2>Who's hosting</H2></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginTop: 36 }}>
              {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerCard s={s} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* ── About — centered ── */}
      {page.about_data && (
        <section id="about" style={{ padding: "100px clamp(20px,5vw,56px)", background: creamWarm, textAlign: "center" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <Reveal><Eyebrow>About</Eyebrow><H2 center>About AddedEducation</H2></Reveal>
            {page.about_data.description && <Reveal delay={80}><Sub center>{page.about_data.description}</Sub></Reveal>}
            {page.about_data.universities?.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 28 }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(14,14,14,0.1)", background: "#fff", fontFamily: sans, fontSize: 13, color: ink }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <QuoteSection quote={page.quote_data} variant="light" />
      <WhyFamiliesSection data={page.why_families_data} variant="light" />

      <LandingFooter />
    </div>
  )
}

// ── shared primitives (light theme) ──
function Eyebrow({ children }) {
  return <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: C.maroon, border: `1px solid rgba(107,24,24,0.3)`, borderRadius: 999, padding: "6px 14px", marginBottom: 20 }}>{children}</span>
}
function H2({ children, center }) {
  return <h2 style={{ fontFamily: serif, fontWeight: 400, color: ink, fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 18, textAlign: center ? "center" : "left" }}>{children}</h2>
}
function Sub({ children, center }) {
  return <p style={{ fontFamily: sans, fontSize: 16, color: stone, lineHeight: 1.7, maxWidth: 720, marginBottom: 32, fontWeight: 350, textAlign: center ? "center" : "left", margin: center ? "0 auto 32px" : "0 0 32px" }}>{children}</p>
}

function ContentLight({ data }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid rgba(14,14,14,0.07)", borderRadius: 14, padding: "22px 24px", transition: "border-color .25s, transform .25s" }}
               onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,53,75,.4)"; e.currentTarget.style.transform = "translateY(-2px)" }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(14,14,14,.07)"; e.currentTarget.style.transform = "translateY(0)" }}>
            {item.title && <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, color: ink, marginBottom: 8 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: stone, lineHeight: 1.65, fontWeight: 350 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontFamily: sans, fontSize: 15, color: stone, lineHeight: 1.75, maxWidth: 760, fontWeight: 350 }}>{data.body}</p>
}

function SpeakerCard({ s }) {
  const { src, srcSet } = getResponsiveSrc(s.photo)
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(14,14,14,.07)", borderRadius: 16, padding: 24, transition: "transform .25s, border-color .25s" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(200,53,75,.35)" }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(14,14,14,.07)" }}>
      {src && <div style={{ width: 72, height: 72, borderRadius: 999, overflow: "hidden", marginBottom: 16, background: creamWarm }}>
        <img src={src} srcSet={srcSet} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
      {s.name && <h4 style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: ink, marginBottom: 4 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: sans, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: sans, fontSize: 13, color: stone, marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: sans, fontSize: 13.5, color: stone, lineHeight: 1.65, fontWeight: 350 }}>{s.description}</p>}
      {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: sans, fontSize: 12, color: C.accent, textDecoration: "none", borderBottom: `1px solid ${C.accent}` }}>LinkedIn ↗</a>}
    </div>
  )
}
