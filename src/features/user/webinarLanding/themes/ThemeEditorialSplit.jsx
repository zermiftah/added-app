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

export default function ThemeEditorialSplit({ page }) {
  const formRef = useRef(null)
  const heroImg = getResponsiveSrc(page.hero_image)

  return (
    <div style={{ background: C.cream, minHeight: "100vh", color: C.ink }}>
      <style>{`
        @keyframes es-pan { 0%,100%{transform:scale(1.06) translate(0,0);} 50%{transform:scale(1.06) translate(-1%,-1%);} }
        * { box-sizing:border-box; }
        .es-hero-grid { display:grid; grid-template-columns: 2.4fr 1fr; gap:48px; align-items:stretch; }
        .es-split { display:grid; grid-template-columns: 1fr 2fr; gap:48px; }
        .es-form-grid { display:grid; grid-template-columns: 1fr 1.2fr; gap:48px; align-items:start; }
        .es-speakers-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap:28px; }
        @media(max-width:900px){
          .es-hero-grid,.es-split,.es-form-grid{ grid-template-columns:1fr !important; gap:32px !important; }
          .es-meta-bar{ border-left:none !important; padding-left:0 !important; padding-top:24px; border-top:1px solid rgba(0,0,0,.1); }
        }
      `}</style>

      <LandingHeader variant="light" sections={NAV_SECTIONS} formId="register" />

      {/* ── HERO ── */}
      <section id="webinar" style={{ position: "relative", padding: "100px clamp(20px,5vw,56px) 64px", borderBottom: `1px solid rgba(0,0,0,.09)`, overflow: "hidden" }}>
        {heroImg.src && (
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.16 }}>
            <img src={heroImg.src} srcSet={heroImg.srcSet} sizes="100vw" alt="" fetchpriority="high" decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", animation: "es-pan 18s ease-in-out infinite", filter: "grayscale(30%)" }} />
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }} className="es-hero-grid">
          {/* Left */}
          <div>
            <Reveal>
              <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, borderBottom: `2px solid ${C.accent}`, paddingBottom: 4, marginBottom: 32 }}>Free Webinar</span>
            </Reveal>
            <Reveal delay={100}>
              <h1 style={{ fontFamily: serif, fontWeight: 400, color: C.ink, fontSize: "clamp(44px,7.5vw,100px)", lineHeight: 0.97, letterSpacing: "-0.038em", marginBottom: 28 }}>
                {page.webinar_title}
              </h1>
            </Reveal>
            {page.webinar_subtitle && (
              <Reveal delay={200}>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px,2vw,23px)", color: C.stone, lineHeight: 1.55, maxWidth: 600, marginBottom: 32 }}>
                  {page.webinar_subtitle}
                </p>
              </Reveal>
            )}
            <Reveal delay={300}>
              <button onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })} style={{
                padding: "14px 30px", background: C.ink, color: "#fff", border: "none",
                fontFamily: mono, fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                cursor: "pointer", transition: "background .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.accent}
                onMouseLeave={e => e.currentTarget.style.background = C.ink}>
                Reserve seat →
              </button>
            </Reveal>
          </div>

          {/* Right: meta bar */}
          <aside className="es-meta-bar" style={{ borderLeft: `1px solid rgba(0,0,0,.1)`, paddingLeft: 36, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 28 }}>
            {[["Date", formatDateRange(page)], ["Time", page.webinar_time], ["Where", page.webinar_place], ["For", page.grade_years]].filter(([,v]) => v).map(([label, value], i) => (
              <Reveal key={label} delay={180 + i * 60}>
                <div>
                  <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.stoneLight, marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, color: C.ink, lineHeight: 1.2 }}>{value}</p>
                </div>
              </Reveal>
            ))}
          </aside>
        </div>
      </section>

      {/* ── Why — editorial split ── */}
      {page.why_data && (
        <section id="why" style={{ padding: "96px clamp(20px,5vw,56px)", borderBottom: `1px solid rgba(0,0,0,.08)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }} className="es-split">
            <Reveal>
              <div>
                <EyebrowEd>Why this matters</EyebrowEd>
                <H2E>{page.why_data.title || "Why you need this"}</H2E>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                {page.why_data.subtitle && <p style={{ fontFamily: sans, fontSize: 16, color: C.stone, lineHeight: 1.7, marginBottom: 28 }}>{page.why_data.subtitle}</p>}
                <ContentEd data={page.why_data} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Learn ── */}
      {page.learn_data && (
        <section id="learn" style={{ padding: "96px clamp(20px,5vw,56px)", background: C.cream, borderBottom: `1px solid rgba(0,0,0,.08)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: 48 }}>
                <EyebrowEd>What you'll learn</EyebrowEd>
                <H2E style={{ maxWidth: 800 }}>{page.learn_data.title || "What you'll learn"}</H2E>
                {page.learn_data.subtitle && <p style={{ fontFamily: sans, fontSize: 16, color: C.stone, lineHeight: 1.7, maxWidth: 720 }}>{page.learn_data.subtitle}</p>}
              </div>
            </Reveal>
            <Reveal delay={120}><ContentEd data={page.learn_data} grid /></Reveal>
          </div>
        </section>
      )}

      {/* ── Speakers ── */}
      {page.speakers?.length > 0 && (
        <section id="speakers" style={{ padding: "96px clamp(20px,5vw,56px)", borderBottom: `1px solid rgba(0,0,0,.08)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Reveal><EyebrowEd>Your hosts</EyebrowEd><H2E style={{ marginBottom: 48 }}>Speakers</H2E></Reveal>
            <div className="es-speakers-grid">
              {page.speakers.map((s, i) => <Reveal key={i} delay={80 + i * 80}><SpeakerEd s={s} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* ── About — centered ── */}
      {page.about_data && (
        <section id="about" style={{ padding: "96px clamp(20px,5vw,56px)", background: C.cream, borderBottom: `1px solid rgba(0,0,0,.08)`, textAlign: "center" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <Reveal><EyebrowEd>About</EyebrowEd><H2E center>About AddedEducation</H2E></Reveal>
            {page.about_data.description && <Reveal delay={80}><p style={{ fontFamily: sans, fontSize: 16, color: C.stone, lineHeight: 1.7, maxWidth: 720, margin: "0 auto 28px", textAlign: "center" }}>{page.about_data.description}</p></Reveal>}
            {page.about_data.universities?.length > 0 && (
              <Reveal delay={160}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
                  {page.about_data.universities.map((u, i) => (
                    <span key={i} style={{ padding: "8px 14px", border: `1px solid ${C.ink}`, fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: C.ink }}>{u}</span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── Form ── */}
      <section id="register" ref={formRef} style={{ padding: "96px clamp(20px,5vw,56px)", background: C.ink, color: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }} className="es-form-grid">
          <Reveal>
            <div>
              <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, borderBottom: `2px solid ${C.accent}`, paddingBottom: 4, marginBottom: 24 }}>Reserve</span>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(32px,4.5vw,56px)", lineHeight: 1.04, letterSpacing: "-0.028em", color: "#fff", marginBottom: 18 }}>
                Save your<br /><em style={{ color: C.accent }}>seat.</em>
              </h2>
              <p style={{ fontFamily: sans, fontSize: 15, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>Limited spots available. Reserve yours below.</p>
            </div>
          </Reveal>
          <Reveal delay={120} y={24}>
            <div style={{ background: C.inkSoft, border: "1px solid rgba(255,255,255,.09)", padding: "30px 26px", boxShadow: "0 24px 64px rgba(0,0,0,.5)" }}>
              <WebinarForm page={page} variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}

// primitives editorial
function EyebrowEd({ children }) {
  return <span style={{ display: "inline-block", fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, borderBottom: `2px solid ${C.accent}`, paddingBottom: 4, marginBottom: 22 }}>{children}</span>
}
function H2E({ children, center, style = {} }) {
  return <h2 style={{ fontFamily: serif, fontWeight: 400, color: C.ink, fontSize: "clamp(32px,4.5vw,56px)", lineHeight: 1.05, letterSpacing: "-0.028em", marginBottom: 18, textAlign: center ? "center" : "left", ...style }}>{children}</h2>
}

function ContentEd({ data, grid }) {
  if (!data) return null
  if (data.type === "list" && Array.isArray(data.body)) {
    const gridStyle = grid ? { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 24 } : { display: "grid", gap: 24 }
    return (
      <div style={gridStyle}>
        {data.body.map((item, i) => (
          <div key={i} style={{ borderTop: `2px solid ${C.ink}`, paddingTop: 18, transition: "padding-left .25s" }}
               onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
               onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
            {grid && <span style={{ display: "block", fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: "0.18em", marginBottom: 10 }}>{String(i + 1).padStart(2, "0")}</span>}
            {item.title && <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: 22, color: C.ink, marginBottom: 8, lineHeight: 1.2 }}>{item.title}</h3>}
            {item.description && <p style={{ fontFamily: sans, fontSize: 14, color: C.stone, lineHeight: 1.7 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontFamily: sans, fontSize: 16, color: C.stone, lineHeight: 1.75, maxWidth: 720 }}>{data.body}</p>
}

function SpeakerEd({ s }) {
  const { src, srcSet } = getResponsiveSrc(s.photo)
  return (
    <div style={{ background: C.cream, border: `1px solid rgba(0,0,0,.08)`, padding: 26, transition: "transform .3s, box-shadow .3s" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 54px rgba(0,0,0,.09)" }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
      {src && <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", background: C.creamSoft, marginBottom: 18 }}>
        <img src={src} srcSet={srcSet} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
      {s.name && <h4 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.ink, marginBottom: 4, lineHeight: 1.2 }}>{s.name}</h4>}
      {s.title && <p style={{ fontFamily: mono, fontSize: 11, color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>{s.title}</p>}
      {s.position && <p style={{ fontFamily: sans, fontSize: 13, color: C.stone, marginBottom: 12 }}>{s.position}</p>}
      {s.description && <p style={{ fontFamily: sans, fontSize: 13.5, color: C.stone, lineHeight: 1.65 }}>{s.description}</p>}
      {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 14, fontFamily: mono, fontSize: 11, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderBottom: `1px solid ${C.accent}` }}>LinkedIn →</a>}
    </div>
  )
}
