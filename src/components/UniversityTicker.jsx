// ─── Edit nama dan URL logo di sini ────────────────────────────────────────
const UNIVERSITY_LOGOS = [
  { name: "Hong Kong",  url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/hongkong.png" },
  { name: "NUS",        url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/nus.png" },
  { name: "IE",         url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/ie.png" },
  { name: "Bocconi",    url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/bocconi.png" },
  { name: "MIT",        url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/mit.png" },
  { name: "Cornell",    url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/cornell.png" },
  { name: "Oxford",     url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/oxford.png" },
  { name: "Colombia",   url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/colombia.png" },
  { name: "Princeton",  url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/princeton.png" },
  { name: "Stanford",   url: "https://addededucation-assets.s3.us-east-1.amazonaws.com/university-logo/stanford.png" },
]
// ───────────────────────────────────────────────────────────────────────────

function LogoItem({ name, url }) {
  return (
    <div
      style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 36px", opacity: 0.5, transition: "opacity 0.3s ease" }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
    >
      <img
        src={url}
        alt={name}
        width={112} height={28} style={{ height: 28, width: "auto", maxWidth: 112, objectFit: "contain", display: "block" }}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.target.style.display = "none"
          e.target.nextSibling.style.display = "block"
        }}
      />
      <span style={{ display: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#A6A39E" }}>
        {name}
      </span>
    </div>
  )
}

export default function UniversityTicker() {
  const logos = [...UNIVERSITY_LOGOS, ...UNIVERSITY_LOGOS]

  return (
    <div style={{ width: "100%" }}>

      {/* ── Baris text — bg hitam, font putih ── */}
      <div style={{ background: "#0E0E0E", padding: "12px 0" }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#fff",
          textAlign: "center",
          margin: 0,
        }}>
          Our students have earned multiple offers from top 20 global universities, including
        </p>
      </div>

      {/* ── Logo ticker — bg cream/putih ── */}
      <div style={{ background: "#FBFBFD", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "18px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 96, zIndex: 10, pointerEvents: "none", background: "linear-gradient(to right, #FBFBFD, transparent)" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 96, zIndex: 10, pointerEvents: "none", background: "linear-gradient(to left, #FBFBFD, transparent)" }} />

        <div style={{ display: "flex", alignItems: "center", animation: "ticker-scroll 30s linear infinite", width: "max-content" }}>
          {logos.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} name={logo.name} url={logo.url} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
