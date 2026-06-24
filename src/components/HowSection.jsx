import { useRef } from "react"
import { Reveal } from "../hooks/useReveal"

const SERVICES = [
  {
    btnLabel: "Learn about Academic pathways",
    title: "End-to-End Admissions Guidance",
    body: "One counselor stays with your child from first call to final submission, so nothing gets missed. Backed by a full team of essay specialists, subject experts, and former admissions officers.",
    imgLeft: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80",
    imgRight: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80",
  },
  {
    btnLabel: "Learn about Athlete recruitment",
    title: "Athletic support for junior athletes",
    body: "A network of 2000+ coach connections across tennis, soccer, golf, swimming and more, managed by specialists who've played at university level and helped students get recruited.",
    imgLeft: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80",
    imgRight: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&q=80",
  },
  {
    btnLabel: "Speak to a counselor",
    title: "Not Sure Where To Start?",
    body: "Whether your child is in Grade 9 or Grade 12, just beginning or already behind, we'll tell you exactly where they stand and what needs to happen next.",
    imgLeft: null,
    imgRight: null,
  },
]

function RollButton({ label }) {
  const btnRef = useRef(null)
  const handleEnter = () => {
    const el = btnRef.current; if (!el) return
    el.style.background = "#0E0E0E"
    el.querySelector(".rt").style.transform = "translateY(-100%)"
    el.querySelector(".rb").style.transform = "translateY(0%)"
  }
  const handleLeave = () => {
    const el = btnRef.current; if (!el) return
    el.style.background = "transparent"
    el.querySelector(".rt").style.transform = "translateY(0%)"
    el.querySelector(".rb").style.transform = "translateY(100%)"
  }
  const spanBase = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", transition: "transform 0.38s cubic-bezier(0.76,0,0.24,1)", padding: "0 28px", boxSizing: "border-box" }
  return (
    <a ref={btnRef} href="/contact" onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", height: 46, borderRadius: 999, border: "1.5px solid #0E0E0E", background: "transparent", padding: "0 28px", textDecoration: "none", overflow: "hidden", cursor: "pointer", transition: "background 0.38s cubic-bezier(0.76,0,0.24,1)", boxSizing: "border-box", minWidth: "fit-content" }}
    >
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", visibility: "hidden", padding: "0 2px" }}>{label}</span>
      <span className="rt" style={{ ...spanBase, color: "#0E0E0E", transform: "translateY(0%)" }}>{label}</span>
      <span className="rb" style={{ ...spanBase, color: "#fff", transform: "translateY(100%)" }}>{label}</span>
    </a>
  )
}

export default function HowSection() {
  return (
    <section style={{ background: "#FBFBFD", width: "100%", padding: "80px 0 96px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#fff", background: "#6B6863", borderRadius: 999, padding: "9px 20px" }}>
              How we help you
            </span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="fraunces-heading" style={{ textAlign: "center", fontSize: "clamp(30px, 3.5vw, 48px)", lineHeight: 1.12, letterSpacing: "-0.02em", color: "#0E0E0E", marginBottom: 52 }}>
            We work around{" "}
            <em style={{ fontStyle: "italic", color: "#C8354B" }}>your child,</em>
            <br />not the other way around.
          </h2>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SERVICES.map((svc, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 180px", alignItems: "center", gap: 24, paddingTop: 20, paddingBottom: 20 }}>
                <div style={{ width: 180, height: 180, borderRadius: 12, overflow: "hidden", background: "#E8E4DC", flexShrink: 0, visibility: svc.imgLeft ? "visible" : "hidden" }}>
                  {svc.imgLeft && <img src={svc.imgLeft} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: 14 }}><RollButton label={svc.btnLabel} /></div>
                  <h3 className="fraunces-heading" style={{ fontSize: 18, fontWeight: 500, color: "#0E0E0E", marginBottom: 8, lineHeight: 1.3 }}>{svc.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 400, color: "#6B6863", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>{svc.body}</p>
                </div>
                <div style={{ width: 180, height: 180, borderRadius: 12, overflow: "hidden", background: "#E8E4DC", flexShrink: 0, visibility: svc.imgRight ? "visible" : "hidden" }}>
                  {svc.imgRight && <img src={svc.imgRight} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
