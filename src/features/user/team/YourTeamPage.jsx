import { useEffect, useState, useRef } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import ResponsiveImg from "../../../ui/ResponsiveImg/ResponsiveImg"
import { fetchData, API_BASE_URL } from "lib/api"

const C = {
  cream: "#FBFBFD",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  accent: "#C8354B",
  border: "rgba(255,255,255,0.08)",
}

const HERO_BG = "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782640932634_Ma3Zar3CyfhdZE701tEZRDCZwm8.webp"

const photoUrl = (photo) => {
  if (!photo) return null
  if (photo.startsWith("http")) return photo
  if (photo.startsWith("/addedapi/")) return `${API_BASE_URL.replace(/\/$/, "").replace(/\/addedapi$/, "")}${photo}`
  return photo
}

// Description with smooth height transition — opens DOWN, pushes siblings
function MemberCard({ member }) {
  const [open, setOpen]     = useState(false)
  const [maxH, setMaxH]     = useState(0)
  const descRef             = useRef(null)
  const hasDescription      = !!member.description?.trim()

  // Measure description's natural height once mounted
  useEffect(() => {
    if (descRef.current) {
      setMaxH(descRef.current.scrollHeight)
    }
  }, [member.description])

  return (
    <div
      className="yt-card"
      onMouseEnter={() => hasDescription && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => hasDescription && setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={hasDescription ? 0 : -1}
    >
      {/* Image area — fixed aspect, red glow underneath */}
      <div className="yt-card-imgbox">
        <div className="yt-card-glow" aria-hidden="true" />

        {member.photo ? (
          <ResponsiveImg
            src={photoUrl(member.photo)}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="yt-card-img"
          />
        ) : (
          <div className="yt-card-placeholder">{member.name?.[0] || "?"}</div>
        )}
      </div>

      {/* Meta below image */}
      <div className="yt-card-meta">
        <h4 className="yt-card-name">{member.name}</h4>
        {member.position && <p className="yt-card-pos">{member.position}</p>}

        {/* Smooth height expand — content stays in flow, pushes neighbors */}
        {hasDescription && (
          <div
            className="yt-card-desc-wrap"
            style={{
              maxHeight: open ? maxH : 0,
              opacity:   open ? 1 : 0,
            }}
            aria-hidden={!open}
          >
            <p ref={descRef} className="yt-card-desc">{member.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CategorySection({ category }) {
  if (!category.members?.length) return null
  return (
    <div className="yt-cat">
      <div className="yt-cat-header">
        <h2 className="fraunces-heading yt-cat-title">{category.name}</h2>
        {category.description && (
          <p className="yt-cat-desc">{category.description}</p>
        )}
      </div>

      <div className="yt-grid">
        {category.members.map(m => <MemberCard key={m.id} member={m} />)}
      </div>
    </div>
  )
}

export default function YourTeamPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchData("team/public", null, "GET")
      .then(r => { if (!cancelled) setCategories(r.categories || []) })
      .catch(e => { if (!cancelled) setError(e.message || "Failed to load") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ background: C.ink, minHeight: "100vh" }}>
      <Navbar />

      <style>{`
        /* ── Outer wrapper to provide top/bottom gap for borders ── */
        .yt-section-outer {
          padding: 56px clamp(16px, 4vw, 40px);
          background: ${C.ink};
        }
        /* ── Section: full border, max-width 7xl ──────────── */
        .yt-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px clamp(24px, 5vw, 56px);
          border: 1px solid ${C.border};
        }

        /* ── Category block ───────────────────────────────── */
        .yt-cat { margin-bottom: 96px; }
        .yt-cat:last-child { margin-bottom: 0; }
        .yt-cat-header { margin-bottom: 48px; }
        .yt-cat-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          color: #fff;
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .yt-cat-desc {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: ${C.stoneLight};
          line-height: 1.6;
          max-width: 720px;
        }

        /* ── Grid: align-items start so cards expand independently ── */
        .yt-grid {
          display: grid;
          gap: 48px 32px;
          grid-template-columns: repeat(3, 1fr);
          justify-items: center;
          align-items: start;
        }
        @media (max-width: 900px) {
          .yt-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 24px; }
        }
        @media (max-width: 560px) {
          .yt-grid { grid-template-columns: 1fr; gap: 36px; }
        }

        /* ── Card: transparent, blends with bg ─────────── */
        .yt-card {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: transparent;
        }

        /* ── Image box: fixed aspect, contained ─────────── */
        .yt-card-imgbox {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          isolation: isolate;
        }

        /* ── Red radial glow behind photo ──────────────── */
        .yt-card-glow {
          position: absolute;
          inset: 12% 8%;
          background: radial-gradient(circle at 50% 55%, rgba(200,53,75,0.45) 0%, rgba(200,53,75,0.18) 35%, transparent 70%);
          filter: blur(20px);
          z-index: 0;
          pointer-events: none;
        }

        /* ── The photo itself ──────────────────────────── */
        .yt-card-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          display: block;
        }

        .yt-card-placeholder {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.15);
          font-family: 'Fraunces', serif;
          font-size: 64px;
          font-weight: 300;
        }

        /* ── Card meta below image ──────────────────────── */
        .yt-card-meta {
          width: 100%;
          padding-top: 20px;
          text-align: left;
        }
        .yt-card-name {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .yt-card-pos {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: ${C.stoneLight};
          line-height: 1.45;
        }

        /* ── Description: smooth height expand, pushes siblings ─── */
        .yt-card-desc-wrap {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
          will-change: max-height, opacity;
        }
        .yt-card-desc {
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #fff;
          line-height: 1.65;
          padding-top: 14px;
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", width: "100%", minHeight: "60vh", overflow: "hidden", background: C.inkSoft }}>
        <img
          src={HERO_BG}
          alt=""
          fetchpriority="high"
          decoding="async"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
         loading="lazy"/>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(14,14,14,0.40) 0%, rgba(14,14,14,0.55) 50%, rgba(14,14,14,0.88) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 2,
          minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "120px clamp(24px, 6vw, 80px) 64px clamp(24px, 8vw, 120px)",
        }}>
          <h1 className="fraunces-heading" style={{
            fontFamily: "'Fraunces', serif", fontWeight: 400, fontStyle: "italic",
            fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.05, color: "#fff",
            letterSpacing: "-0.02em",
          }}>
            Meet The Team
          </h1>
        </div>
      </section>

      {/* ══ CONTENT — outer adds top/bottom gap, inner gets full border ══ */}
      <div className="yt-section-outer">
        <section className="yt-section">
          {loading && (
            <div style={{ color: C.stoneLight, textAlign: "center", padding: "60px 0", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
              Loading team…
            </div>
          )}

          {error && !loading && (
            <div style={{ color: C.accent, textAlign: "center", padding: "60px 0", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
              {error}
            </div>
          )}

          {!loading && !error && categories.length === 0 && (
            <div style={{ color: C.stoneLight, textAlign: "center", padding: "60px 0", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
              Team information coming soon.
            </div>
          )}

          {!loading && !error && categories.map(cat => (
            <CategorySection key={cat.id} category={cat} />
          ))}
        </section>
      </div>

      <Footer />
    </div>
  )
}
