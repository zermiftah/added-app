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

export default function ThemeHeroCtaStacked({ page }) {
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <div style={{ background: C.cream, minHeight: "100vh", color: C.ink }}>
      <style>{`
        @keyframes hcs-pulse { 0%,100%{transform:scale(1);opacity:.65;} 50%{transform:scale(1.1);opacity:.9;} }
        * { box-sizing: border-box; }
      `}</style>

      <LandingHeader variant="light" sections={NAV_SECTIONS} formId="register" />

      {/* ── HERO — full dark section ── */}
      <section id="webinar" style={{ position: "relative", background: C.ink, color: "#fff", padding: "130px clamp(20px,5vw,56px) 100px", overflow: "hidden", minHeight: heroImg.src ? "80vh" : "auto", display: "flex", alignItems: "center" }}>
        {heroImg.src && (
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src={heroImg.src} srcSet={heroImg.srcSet} sizes="100vw" alt="" fetchpriority="high" decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,14,14,.55) 0%, rgba(14,14,14,.72) 60%, rgba(14,14,14,.96) 100%)" }} />
          </div>
        )}
        <div aria-hidden style={{ position: "absolute", top: "15%", right: "8%", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,53,75,.28) 0%, transparent 65%)",
          filter: "blur(50px)", animation: "hcs-pulse 7s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1080, margin: "0 auto", width: "100%", textAlign: "center" }}>
          <Reveal>
            <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, border: `1px solid ${C.accent}`, borderRadius: 999, padding: "6px 16px", marginBottom: 28 }}>Free Webinar</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontStyle: "italic", fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 1.02, letterSpacing: "-0.028em", marginBottom: 22 }}>
              {page.webinar_title}
            </h1>
          </Reveal>
          {page.webinar_subtitle && (
            <Reveal delay={200}>
              <p style={{ fontFamily: sans, fontSize: 18, color: "rgba(255,255,255,.75)", lineHeight: 1.65, maxWidth: 720, margin: "0 auto 36px" }}>
                {page.webinar_subtitle}
              </p>
            </Reveal>
          )}
          <Reveal delay={300}>
            <button onClick={() => go("register")} style={{
              background: C.accent, color: "#fff", border: "none", cursor: "pointer",
              padding: "15px 36px", borderRadius: 100, fontFamily: sans, fontSize: 15, fontWeight: 600,
              letterSpacing: "0.02em", transition: "all .2s ease", boxShadow: "0 8px 28px rgba(200,53,75,.38)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.accentDeep; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(200,53,75,.5)" }}
              onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,53,75,.38)" }}>
              Reserve my spot →
            </button>
          </Reveal>

          {/* Meta strip */}
          {(page.webinar_date || page.webinar_time || page.webinar_place || page.grade_years) && (
            <Reveal delay={400}>
              <div style={{ marginTop: 56, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px 40px", paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.12)" }}>
                {[["Date", formatDateRange(page)], ["Time", page.webinar_time], ["Where", page.webinar_place], ["For", page.grade_years]].filter(([,v]) => v).map(([label, value]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 4 }}>{label}</p>
                    <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: "#fff" }}>{value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Why ── */}
      {page.why_data && (
        <section id="why" style={{ padding: "96px clamp(20px,5vw,56px)", background: C.cream }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal><EyebrowLight>Why this matters</EyebrowLight><H2L>{page.why_data.title || "Why you need this"}</H2L></Reveal>
            {page.why_data.subtitle && <Reveal delay={80}><SubL>{page.why_data.subtitle}</SubL></Reveal>}
            <Reveal delay={160}><ContentLight data={page.why_data} /></Reveal>
          </div>
        </section>
      )}

      {/* ── Learn ── */}
      {page.learn_data && (
        <section id="learn" style={{ padding: "96px clamp(20px,5vw,56px)", background: C.creamSoft, borderTop: `1px solid rgba(0,0,0,.06)` }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal><EyebrowLight>What you'll learn</EyebrowLight><H2L>{page.learn_data.title || "What you'll learn"}</H2L></Reveal>
            {page.learn_data.subtitle && <Reveal delay={80}><SubL>{page.learn_data.subtitle}</SubL></Reveal>}
            <Reveal delay={160}><ContentLight data={page.learn_data} numbered /></Reveal>
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section id="speakers" style={{ padding: "96px clamp(20px,5vw,56px)", background: C.cream, borderTop: `1px solid rgba(0,0,0,.06)` }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal><EyebrowLight>Your hosts</EyebrowLight><H2L>Meet your speakers</H2L></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, marginTop: 36 }}>
              {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerCardLight s={s} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* ── Form ── */}
      <section id="register" ref={formRef} style={{ padding: "96px clamp(20px,5vw,56px)", background: C.ink, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,53,75,.22), transparent 65%)", filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(28px,3.5vw,42px)", lineHeight: 1.1, marginBottom: 12 }}>Save your seat</h2>
              <p style={{ fontFamily: sans, fontSize: 15, color: "rgba(255,255,255,.62)", lineHeight: 1.6 }}>Limited spots available. Reserve yours below.</p>
            </div>
          </Reveal>
          <Reveal delay={80} y={20}>
            <div style={{ background: C.inkSoft, border: "1px solid rgba(255,255,255,.09)", borderRadius: 20, padding: "32px 28px", boxShadow: "0 24px 64px rgba(0,0,0,.55)" }}>
              <WebinarForm page={page} variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About — centered ── */}
      {page.about_data && (
        <section id="about" style={{ padding: "96px clamp(20px,5vw,56px)", background: C.cream, borderTop: `1px solid rgba(0,0,0,.06)`, textAlign: "center" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <Reveal><EyebrowLight>About</EyebrowLight><H2L center>About AddedEducation</H2L></Reveal>
            {page.about_data.description && <Reveal delay={80}><SubL center>{page.about_data.description}</SubL></Reveal>}
            {page.about_data.universities?.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 24 }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{ padding: "8px 18px", borderRadius: 999, border: `1px solid rgba(0,0,0,.1)`, background: "#fff", fontFamily: sans, fontSize: 13, color: C.ink }}>{u}</span>
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

// primitives light theme
function EyebrowLight({ children }) {
  return <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.stone, border: `1px solid rgba(0,0,0,.1)`, borderRadius: 999, padding: "6px 14px", marginBottom: 20 }}>{children}</span>
}
function H2L({ children, center }) {
  return <h2 style={{ fontFamily: serif, fontWeight: 400, color: C.ink, fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 18, textAlign: center ? "center" : "left" }}>{children}</h2>
}
function SubL({ children, center }) {
  return <p style={{ fontFamily: sans, fontSize: 16, color: C.stone, lineHeight: 1.7, maxWidth: 720, marginBottom: 32, textAlign: center ? "center" : "left", margin: center ? "0 auto 32px" : "0 0 32px" }}>{children}</p>
}

function ContentLight({ data, numbered }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    return (
      <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
        {data.body.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "20px 22px", background: "#fff", border: `1px solid rgba(0,0,0,.07)`, borderRadius: 14, transition: "transform .2s, border-color .2s" }}
               onMouseEnter={e => { e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.borderColor = `rgba(200,53,75,.35)` }}
               onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = `rgba(0,0,0,.07)` }}>
            {numbered && <span style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 999, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 700, fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>}
            <div>
              {item.title && <h3 style={{ fontFamily: sans, fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 6 }}>{item.title}</h3>}
              {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: C.stone, lineHeight: 1.65 }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontFamily: sans, fontSize: 16, color: C.stone, lineHeight: 1.75, maxWidth: 760, marginTop: 8 }}>{data.body}</p>
}

function SpeakerCardLight({ s }) {
  const { src, srcSet } = getResponsiveSrc(s.photo)
  return (
    <div style={{ background: "#fff", border: `1px solid rgba(0,0,0,.07)`, borderRadius: 16, padding: 24, textAlign: "center", transition: "transform .25s, box-shadow .25s" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(0,0,0,.09)" }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
      {src && <div style={{ width: 88, height: 88, borderRadius: 999, overflow: "hidden", margin: "0 auto 16px", background: C.creamSoft }}>
        <img src={src} srcSet={srcSet} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
      {s.name && <h4 style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, color: C.ink, marginBottom: 5 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: sans, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: sans, fontSize: 13, color: C.stone, marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: sans, fontSize: 13.5, color: C.stone, lineHeight: 1.65, textAlign: "left" }}>{s.description}</p>}
      {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: sans, fontSize: 12, color: C.accent, textDecoration: "none", borderBottom: `1px solid ${C.accent}` }}>LinkedIn ↗</a>}
    </div>
  )
}
