// ─── Edit nama dan URL logo di sini ────────────────────────────────────────
const UNIVERSITY_LOGOS = [
  { name: "Hong Kong",  url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300459_hongkong.webp" },
  { name: "NUS",        url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300460_nus.webp" },
  { name: "IE",         url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300462_ie.webp" },
  { name: "Bocconi",    url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300470_bocconi.webp" },
  { name: "MIT",        url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300473_mit.webp" },
  { name: "Cornell",    url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300485_cornell.webp" },
  { name: "Oxford",     url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300773_oxford.webp" },
  { name: "Colombia",   url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300787_colombia.webp" },
  { name: "Princeton",  url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300819_princeton.webp" },
  { name: "Stanford",   url: "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782571300820_stanford.webp" },
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
