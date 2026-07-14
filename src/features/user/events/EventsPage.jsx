import { useState, useEffect, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { formatWebinarTime } from "../webinarLanding/themeShared"

const API_BASE = "https://addededucation.com/addedapi"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  maroon: "#6B1818", maroonSoft: "#7E2424", accentDeep: "#9E2538",
  accent: "#C8354B", accentRose: "#E8B4BD",
  border: "rgba(0,0,0,0.06)", borderLight: "rgba(255,255,255,0.08)",
}



function formatDateRange(w) {
  if (w.webinar_date) return w.webinar_date
  if (!w.date_start) return null
  const opts = { day: "numeric", month: "short", year: "numeric" }
  const s = new Date(w.date_start + "T00:00:00").toLocaleDateString("en-GB", opts)
  if (!w.date_end || w.date_end === w.date_start) return s
  return `${s} – ${new Date(w.date_end + "T00:00:00").toLocaleDateString("en-GB", opts)}`
}

function getHeroSrc(w) {
  if (!w.hero_image) return null
  const base = API_BASE.replace(/\/addedapi$/, "")
  const full = w.hero_image.startsWith("http") ? w.hero_image : `${base}${w.hero_image}`
  return { full, sm: full.replace(/\.webp$/i, "_sm.webp") }
}


/* ── Reveal ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.unobserve(el) }
    }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  )
}

function Label({ children, light = false }) {
  return (
    <div style={{
      display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
      fontWeight: 600, color: light ? C.accentRose : C.ink, textTransform: "uppercase",
      letterSpacing: 2.5, background: light ? "rgba(255,255,255,0.08)" : C.creamWarm,
      border: `1px solid ${light ? "rgba(255,255,255,0.12)" : C.border}`,
      borderRadius: 6, padding: "6px 14px", marginBottom: 20,
    }}>{children}</div>
  )
}

/* ── Webinar Card ── */
function WebinarCard({ w }) {
  const [hov, setHov] = useState(false)
  const hero    = getHeroSrc(w)
  const dateStr = formatDateRange(w)
  const timeStr = [dateStr, formatWebinarTime(w.webinar_time)].filter(Boolean).join(" · ")
  return (
    <a href={`/${w.slug}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "block", textDecoration: "none", borderRadius: 14, overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 20px 48px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
        {hero ? (
          <img src={hero.full} srcSet={`${hero.sm} 480w, ${hero.full} 800w`} sizes="(max-width:640px) 100vw, 500px"
            alt={w.webinar_title} loading="lazy" decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(150deg, #1c2e4a 0%, #2d1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{w.webinar_place || "Webinar"}</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 10, right: 10, background: C.accent, color: "#fff", borderRadius: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, padding: "4px 8px" }}>Free</div>
        {timeStr && (
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(14,14,14,0.72)", backdropFilter: "blur(10px)", borderRadius: 7, padding: "5px 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: "#fff", maxWidth: "calc(100% - 20px)" }}>
            {timeStr}
          </div>
        )}
      </div>
      <div style={{ padding: "18px 20px 22px" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          {[w.webinar_place, w.grade_years].filter(Boolean).join(" · ")}{" · Free"}
        </div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>{w.webinar_title}</div>
        <div style={{ marginTop: 16, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: hov ? 10 : 6, transition: "gap 0.3s" }}>
          Register Free <span>→</span>
        </div>
      </div>
    </a>
  )
}

/* ── Host Card ── */
function HostCard({ h }) {
  const [hov, setHov] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  // h is a speaker object from landing page: { name, title, position, description, photo, linkedin }
  // photo may be relative /addedapi/... or absolute
  const photoSrc = h.photo
    ? h.photo.startsWith("http") ? h.photo : `${API_BASE.replace(/\/addedapi$/, "")}${h.photo}`
    : null
  const initials = (h.name || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ transition: "transform 0.5s cubic-bezier(.16,1,.3,1)", transform: hov ? "translateY(-4px)" : "translateY(0)" }}
    >
      <div style={{ width: "100%", aspectRatio: "4/5", borderRadius: 12, overflow: "hidden", marginBottom: 16, position: "relative", background: `linear-gradient(145deg, ${C.maroon} 0%, ${C.accentDeep} 50%, ${C.maroonSoft} 100%)`, boxShadow: hov ? "0 12px 32px rgba(107,24,24,0.18)" : "0 4px 14px rgba(107,24,24,0.08)", transition: "box-shadow 0.5s cubic-bezier(.16,1,.3,1)" }}>
        {photoSrc && imgOk
          ? <img src={photoSrc} alt={h.name} onError={() => setImgOk(false)} loading="lazy" decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)", transform: hov ? "scale(1.03)" : "scale(1)" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 44, color: "rgba(255,255,255,0.15)" }}>{initials}</span>
            </div>
        }
        {h.webinar_title && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(12px)", borderRadius: 7, padding: "4px 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 0.8 }}>
            {h.webinar_title}
          </div>
        )}
      </div>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 500, color: C.ink, marginBottom: 4 }}>{h.name}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: C.accent, marginBottom: 2 }}>{h.title || h.position}</div>
      {h.linkedin && (
        <a href={h.linkedin} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.stoneLight, marginBottom: 8, textDecoration: "none" }}>
          LinkedIn ↗
        </a>
      )}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.stone, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{h.description}</p>
    </div>
  )
}

/* ── Nav Btn ── */
function NavBtn({ onClick, disabled, dir }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${disabled ? C.stoneLight : C.ink}`, background: disabled ? "transparent" : hov ? C.ink : "transparent", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: disabled ? C.stoneLight : hov ? "#fff" : C.ink, transition: "all 0.25s ease", opacity: disabled ? 0.35 : 1 }}>
      {dir === "prev" ? "←" : "→"}
    </button>
  )
}

/* ── Host Section ── */
function HostSection({ hosts }) {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(3)
  // All hooks MUST be called before any early return (Rules of Hooks)
  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 520 ? 1 : window.innerWidth < 900 ? 2 : 3)
    update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update)
  }, [])
  const safeHosts = hosts || []
  const total = Math.ceil(safeHosts.length / perPage) || 1
  useEffect(() => { if (page >= total) setPage(Math.max(0, total - 1)) }, [perPage, total, page])
  if (!safeHosts.length) return null
  const visible = safeHosts.slice(page * perPage, page * perPage + perPage)

  return (
    <section style={{ padding: "88px 0 80px", background: C.creamSoft }}>
      <div className="ev-wrap">
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Label>Your Hosts</Label>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.8vw,40px)", fontWeight: 400, color: C.ink, lineHeight: 1.15 }}>
                People who've been <em style={{ fontStyle: "italic", color: C.maroon }}>in the room.</em>
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.stoneLight }}>
                {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <NavBtn onClick={() => setPage(p => p - 1)} disabled={page === 0} dir="prev" />
                <NavBtn onClick={() => setPage(p => p + 1)} disabled={page === total - 1} dir="next" />
              </div>
            </div>
          </div>
        </Reveal>
        <div style={{ width: "100%", height: 2, background: "rgba(0,0,0,0.06)", borderRadius: 1, marginBottom: 36 }}>
          <div style={{ height: "100%", borderRadius: 1, background: C.accent, width: `${((page + 1) / total) * 100}%`, transition: "width 0.5s cubic-bezier(.16,1,.3,1)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${perPage}, 1fr)`, gap: 32 }}>
          {visible.map((h, i) => <HostCard key={`${page}-${i}`} h={h} />)}
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 36 }}>
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} aria-label={`Go to page ${i + 1}`} style={{ width: i === page ? 24 : 8, height: 8, borderRadius: 4, background: i === page ? C.accent : "rgba(0,0,0,0.1)", cursor: "pointer", transition: "all 0.35s cubic-bezier(.16,1,.3,1)", border: "none", minWidth: 24, minHeight: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══ MAIN ══ */
export default function EventsPage() {
  const [learnIdx, setLearnIdx] = useState(0)
  const [webinars, setWebinars] = useState([])

  useEffect(() => {
    const cached = window.__addedPrefetch?.get("webinars:upcoming")
    if (cached) setWebinars(cached.webinars || [])
    fetch(`${API_BASE}/webinar-pages/public/upcoming`)
      .then(r => r.json())
      .then(d => { setWebinars(d.webinars || []); window.__addedPrefetch?.set("webinars:upcoming", d) })
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: C.cream, overflowX: "hidden" }}>
      <style>{CSS}</style>
      <Navbar />

      {/* ══ 1. HERO — full-bleed image, text only ══ */}
      <section className="ev-hero">
        <div className="ev-hero-bg" />
        <div className="ev-hero-overlay" />
        <div className="ev-hero-grid" />

        <div className="ev-wrap ev-hero-inner">
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(200,53,75,0.12)", border: "1px solid rgba(200,53,75,0.25)", borderRadius: 6, padding: "6px 14px", marginBottom: 28, display: "inline-block" }}>
              Upcoming Events
            </div>
          </Reveal>
          <Reveal delay={50}>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,4.5vw,58px)", fontWeight: 400, color: "#fff", lineHeight: 1.05, maxWidth: 720, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Free webinars.{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>Real answers.</em>
            </h1>
          </Reveal>
          <Reveal delay={90}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 480, marginBottom: 0 }}>
              Live sessions with former admissions officers from Cornell, UChicago and more — for families across Asia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Webinar Cards Section ══ */}
      <section style={{ background: C.ink, padding: "64px 0 80px" }}>
        <div className="ev-wrap">
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, color: C.accentRose, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 32 }}>
              Choose your session
            </div>
          </Reveal>
          <div className="ev-cards-grid">
            {webinars.length === 0
              ? <p style={{ color: C.stoneLight, fontFamily: "'DM Sans',sans-serif", fontSize: 14, gridColumn: "1/-1" }}>No upcoming events at the moment. Check back soon.</p>
              : webinars.map((w, i) => (
              <Reveal key={w.id} delay={i * 70}>
                <WebinarCard w={w} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Banner ══ */}
      <section style={{ background: C.creamWarm, borderBottom: `1px solid ${C.border}` }}>
        <div className="ev-wrap" style={{ padding: "18px clamp(24px,6vw,80px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>All sessions are free to attend.</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.stone }}>Live online · Former admissions officers from Cornell, UChicago and more.</span>
          </div>
        </div>
      </section>

      {/* ══ 2. WHAT YOU'LL LEARN ══ */}
      {webinars.length > 0 && (
      <section style={{ padding: "88px 0 80px", background: C.cream }}>
        <div className="ev-wrap">
          <Reveal>
            <Label>What You'll Learn</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.8vw,40px)", fontWeight: 400, color: C.ink, lineHeight: 1.15, marginBottom: 44 }}>
              One hour. Real <em style={{ fontStyle: "italic", color: C.maroon }}>answers.</em>
            </h2>
          </Reveal>
          <Reveal delay={50}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 56, alignItems: "start" }}>
              {/* Tabs */}
              <div style={{ borderRight: `1px solid ${C.border}` }}>
                {webinars.map((w, i) => {
                  const active = i === learnIdx
                  const dateStr = formatDateRange(w)
                  return (
                    <div key={w.id} onClick={() => setLearnIdx(i)} style={{ padding: "18px 24px", borderLeft: `3px solid ${active ? C.accent : "transparent"}`, background: active ? `${C.accent}08` : "transparent", cursor: "pointer", transition: "all 0.3s ease", marginBottom: 2, borderRadius: "0 10px 10px 0" }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: active ? C.ink : C.stone, marginBottom: 3 }}>{w.webinar_place || w.webinar_title}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.stoneLight }}>{[dateStr, formatWebinarTime(w.webinar_time)].filter(Boolean).join(" · ")}</div>
                    </div>
                  )
                })}
              </div>
              {/* Content */}
              {(() => {
                const w = webinars[learnIdx] || webinars[0]
                if (!w) return null
                const learn = typeof w.learn_data === "string" ? JSON.parse(w.learn_data || "null") : w.learn_data
                return (
                  <div>
                    {learn?.title && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 16 }}>{learn.title}</p>}
                    {learn?.subtitle && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.stone, lineHeight: 1.6, marginBottom: 20 }}>{learn.subtitle}</p>}
                    {learn?.type === "list" && Array.isArray(learn.body) ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {learn.body.map((item, j) => (
                          <div key={j} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}`, ...(j === 0 ? { borderTop: `1px solid ${C.border}` } : {}) }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: C.accent, flexShrink: 0, paddingTop: 2 }}>{String(j + 1).padStart(2, "0")}</span>
                            <div>
                              {item.title && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{item.title}</div>}
                              {item.description && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.stone, lineHeight: 1.6 }}>{item.description}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : learn?.body ? (
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: C.stone, lineHeight: 1.7 }}>{learn.body}</p>
                    ) : null}
                    <a href={`/${w.slug}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", background: C.accent, textDecoration: "none", marginTop: 28, padding: "12px 28px", borderRadius: 10, transition: "all 0.3s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.accentDeep; e.currentTarget.style.transform = "translateY(-1px)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
                    >Register for this webinar <span>→</span></a>
                  </div>
                )
              })()}
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* ══ 3. HOSTS ══ */}
      <HostSection hosts={webinars.flatMap(w => { const spk = typeof w.speakers === "string" ? JSON.parse(w.speakers || "[]") : (w.speakers || []); return spk.map(s => ({ ...s, webinar_title: w.webinar_place || w.webinar_title })) })} />

      {/* ══ 4. BOTTOM CTA ══ */}
      <section style={{ background: C.ink, padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.maroon}18 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div className="ev-wrap" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "center" }}>
          <Reveal>
            <Label light>About AddedEducation</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 400, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
              Premium admissions consultancy across <em style={{ fontStyle: "italic", color: C.accentRose }}>Asia and beyond.</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              Our team has helped students across Indonesia, India, Hong Kong, Singapore, Dubai and the UK gain admission to Harvard, Oxford, Cornell, LSE, Stanford and the world's most competitive universities.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {webinars.map(w => (
                <a key={w.id} href={`/${w.slug}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderLight}`, textDecoration: "none", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.borderColor = C.accent }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = C.borderLight }}
                >
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>{w.webinar_place || w.webinar_title}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{formatDateRange(w)}</div>
                  </div>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#fff" }}>Register →</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* ── SHARED WRAPPER ── */
.ev-wrap {
  width: 100%;
  padding: 0 clamp(24px, 6vw, 80px);
}

/* ── HERO ── */
.ev-hero {
  position: relative;
  overflow: hidden;
  background: #0E0E0E;
  padding-bottom: 96px;
}
.ev-hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782567334679_vRwqcjkjJJvZusEeq6lojyQAW3s.webp');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}
.ev-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(14,14,14,0.5) 0%,
    rgba(14,14,14,0.65) 40%,
    rgba(14,14,14,0.92) 75%,
    rgba(14,14,14,1) 100%
  );
}
.ev-hero-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
}
.ev-hero-inner {
  position: relative;
  z-index: 2;
  padding-top: 140px;
  padding-bottom: 0;
}
.ev-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) { .ev-cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .ev-cards-grid { grid-template-columns: 1fr; }
  .ev-hero-inner { padding-top: 100px; padding-bottom: 60px; }
}
`
