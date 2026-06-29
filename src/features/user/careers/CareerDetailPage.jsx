import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const API_BASE = "https://zmiftah.tech/addedapi"
const LIST_PATH = "/careers"
const APPLY_PATH = "/careers/apply"

function sanitizeHtml(html) {
  if (!html) return ""
  return html
    .replace(/ style="[^"]*"/g, "").replace(/ class="[^"]*"/g, "")
    .replace(/ aria-level="[^"]*"/g, "").replace(/ clear="[^"]*"/g, "")
    .replace(/&nbsp;/g, " ").replace(/  +/g, " ")
    .replace(/<h[123](\s[^>]*)?>/gi, "<h2>").replace(/<\/h[123]>/gi, "</h2>")
    .replace(/<h4(\s[^>]*)?>/gi, "<h3>").replace(/<\/h4>/gi, "</h3>")
    .replace(/<h[56](\s[^>]*)?>/gi, "<h4>").replace(/<\/h[56]>/gi, "</h4>")
    .replace(/<span[^>]*>(<[^/])/g, "$1").replace(/(<\/[a-z]+>)<\/span>/g, "$1")
    .replace(/<span[^>]*>(.*?)<\/span>/g, "$1")
    .replace(/<p>\s*<\/p>/g, "").replace(/<p><br\s*\/?><\/p>/g, "").trim()
}

export default function CareerDetailPage() {
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    let id = params.get("id")
    if (!id) { try { id = sessionStorage.getItem("selected_job_id") } catch {} }
    if (!id) { setError("No job selected."); setLoading(false); return }
    fetchJob(id)
  }, [])

  async function fetchJob(id) {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_BASE}/careers/${encodeURIComponent(id)}`)
      if (!res.ok) throw new Error(res.status === 404 ? "Job not found" : `Error ${res.status}`)
      const data = await res.json()
      const j = data.job || data
      if (!j?.id) throw new Error("Invalid data")
      setJob(j)
      try { sessionStorage.setItem("selected_job_id", String(j.id)); sessionStorage.setItem("selected_job_title", j.title) } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally { setLoading(false) }
  }

  function goToApply() {
    if (!job) return
    try { sessionStorage.setItem("selected_job_id", String(job.id)); sessionStorage.setItem("selected_job_title", job.title) } catch {}
    window.location.href = APPLY_PATH
  }

  function imgUrl(p) { return `${API_BASE}/uploads/${p}` }
  function smImgUrl(p) {
    if (!p) return null
    return `${API_BASE}/uploads/${p.replace(/\.webp$/i, "_sm.webp")}`
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: "#0E0E0E", background: "#FBFBFD", overflowX: "hidden" }}>
      <style>{styles}</style>
      <Navbar />

      {/* LOADING */}
      {loading && (
        <div className="cd-state">
          <div className="cd-spinner" />
          <p className="cd-state-sub">Loading position…</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="cd-state">
          <div className="cd-state-code">404</div>
          <h2 className="cd-state-title">Position Not Found</h2>
          <p className="cd-state-sub">{error}</p>
          <button onClick={() => window.location.href = LIST_PATH} className="cd-btn-outline">← Back to Careers</button>
        </div>
      )}

      {/* CONTENT */}
      {!loading && job && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

          {/* ══ HERO ══ */}
          <section className="cd-hero">
            <div className="cd-hero-inner">
              {/* Left */}
              <motion.div className="cd-hero-left" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="cd-eyebrow"><span className="cd-dot" />Open Position</div>
                <h1 className="cd-title">{job.title}</h1>
                <div className="cd-tags">
                  <span className="cd-tag cd-tag-red">{job.type}</span>
                  <span className="cd-tag">{job.department}</span>
                  <span className="cd-tag">📍 {job.location}</span>
                  {job.deadline && <span className="cd-tag">Closes {job.deadline.slice(0, 10)}</span>}
                </div>
                <button onClick={goToApply} className="cd-btn-primary">Apply for this position →</button>
              </motion.div>

              {/* Right */}
              <motion.div className="cd-hero-right" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
                {job.thumbnail
                  ? <div className="cd-img-wrap"><img
                    src={imgUrl(job.thumbnail)}
                    srcSet={`${smImgUrl(job.thumbnail)} 480w, ${imgUrl(job.thumbnail)} 800w`}
                    sizes="(max-width: 640px) 100vw, 800px"
                    alt={job.title}
                    className="cd-img"
                    fetchpriority="high"
                    decoding="async"
                  /></div>
                  : <div className="cd-img-placeholder"><span className="cd-img-letter">{job.title.charAt(0)}</span></div>
                }
              </motion.div>
            </div>
          </section>

          {/* ══ BODY ══ */}
          <section className="cd-body">
            <div className="cd-body-inner">
              {/* Main */}
              <div className="cd-main">
                <motion.div className="cd-block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <h2 className="cd-h2">About the Role</h2>
                  {job.description
                    ? <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }} />
                    : <p className="cd-p">No description available.</p>
                  }
                </motion.div>

                {job.requirements && (
                  <motion.div className="cd-block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                    <h2 className="cd-h2">What We're Looking For</h2>
                    <div className="rich-content" dangerouslySetInnerHTML={{
                      __html: job.requirements.includes("<")
                        ? sanitizeHtml(job.requirements)
                        : `<ul>${job.requirements.split("\n").filter(r => r.trim()).map(r => `<li>${r.replace(/^[-•\d.]+\s*/, "")}</li>`).join("")}</ul>`
                    }} />
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="cd-sidebar">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                  <div className="cd-card">
                    <p className="cd-card-label">Job Details</p>
                    {[
                      { k: "Department", v: job.department },
                      { k: "Type", v: job.type },
                      { k: "Location", v: job.location },
                      ...(job.deadline ? [{ k: "Deadline", v: job.deadline.slice(0, 10) }] : []),
                    ].map(({ k, v }) => (
                      <div key={k} className="cd-card-row">
                        <span className="cd-card-key">{k}</span>
                        <span className="cd-card-val">{v}</span>
                      </div>
                    ))}
                    <button onClick={goToApply} className="cd-btn-black">Apply Now →</button>
                  </div>
                  <div className="cd-card-note">Our team reviews every application and responds within 5 business days.</div>
                </motion.div>
              </aside>
            </div>
          </section>

          {/* ══ BOTTOM CTA ══ */}
          <section className="cd-cta">
            <div className="cd-cta-inner">
              <p className="cd-cta-eyebrow">Ready to join us?</p>
              <h2 className="cd-cta-title">Take the next step<br /><em>in your career.</em></h2>
              <p className="cd-cta-sub">Submit your application and our team will get back to you within 5 business days.</p>
              <button onClick={goToApply} className="cd-btn-white">Apply for {job.title} →</button>
            </div>
          </section>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@350;400;450;500&family=JetBrains+Mono:wght@400;500&display=swap');
@keyframes cd-spin{to{transform:rotate(360deg);}}
@keyframes cd-pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.7);}}

.cd-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:70vh;text-align:center;padding:40px 24px;background:#F5F5F7;}
.cd-spinner{width:28px;height:28px;border-radius:50%;border:2px solid #F0EFEA;border-top-color:#0E0E0E;animation:cd-spin .75s linear infinite;}
.cd-state-code{font-size:80px;font-weight:400;color:#F0EFEA;font-family:'Fraunces',serif;line-height:1;letter-spacing:-4px;}
.cd-state-title{font-family:'Fraunces',serif;font-size:28px;font-weight:400;color:#0E0E0E;letter-spacing:-.01em;font-style:italic;}
.cd-state-sub{font-family:'Inter',sans-serif;font-size:15px;color:#A6A39E;line-height:1.7;max-width:320px;font-weight:350;}

.cd-hero{background:#0E0E0E;color:#fff;padding-bottom:80px;}
.cd-hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;padding:100px clamp(24px,7vw,120px) 0;}
.cd-hero-left{display:flex;flex-direction:column;align-items:flex-start;}
.cd-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;margin-bottom:24px;}
.cd-dot{width:6px;height:6px;border-radius:50%;background:#C8354B;flex-shrink:0;animation:cd-pulse 2s ease-in-out infinite;}
.cd-title{font-family:'Fraunces',serif;font-size:clamp(40px,5.5vw,64px);font-weight:400;line-height:.98;letter-spacing:-.02em;color:#fff;margin-bottom:28px;font-style:italic;}
.cd-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:36px;}
.cd-tag{font-family:'Inter',sans-serif;font-size:12px;font-weight:400;padding:5px 13px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);}
.cd-tag-red{background:rgba(200,53,75,.12);border-color:rgba(200,53,75,.25);color:#E8B4BD;}
.cd-img-wrap{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;border-radius:18px;}
.cd-img{width:100%;height:100%;object-fit:cover;display:block;}
.cd-img-placeholder{width:100%;aspect-ratio:4/3;background:#1A1A1A;border:1px solid rgba(255,255,255,.06);border-radius:18px;display:flex;align-items:center;justify-content:center;}
.cd-img-letter{font-family:'Fraunces',serif;font-size:100px;font-weight:400;font-style:italic;color:rgba(200,53,75,.10);line-height:1;user-select:none;}

.cd-btn-primary{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#0E0E0E;padding:14px 28px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:450;border:none;cursor:pointer;transition:all .2s;}
.cd-btn-primary:hover{background:#F5F5F7;transform:translateY(-1px);}
.cd-btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#6B6863;padding:12px 24px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:450;border:1.5px solid #F0EFEA;cursor:pointer;transition:all .2s;}
.cd-btn-outline:hover{border-color:#A6A39E;color:#0E0E0E;}
.cd-btn-black{display:block;width:100%;margin-top:20px;background:#0E0E0E;color:#fff;padding:14px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:450;border:none;cursor:pointer;transition:all .2s;text-align:center;}
.cd-btn-black:hover{background:#1A1A1A;transform:translateY(-1px);}
.cd-btn-white{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#0E0E0E;padding:15px 32px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:450;border:none;cursor:pointer;transition:all .2s;}
.cd-btn-white:hover{background:#F5F5F7;transform:translateY(-1px);}

.cd-body{background:#FBFBFD;padding:80px clamp(24px,7vw,120px) 100px;}
.cd-body-inner{display:grid;grid-template-columns:1fr 300px;gap:72px;align-items:start;}
.cd-block{margin-bottom:56px;}
.cd-block:last-child{margin-bottom:0;}
.cd-h2{font-family:'Fraunces',serif;font-size:24px;font-weight:400;color:#0E0E0E;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #F0EFEA;letter-spacing:-.01em;font-style:italic;}
.cd-p{font-family:'Inter',sans-serif;font-size:15px;line-height:1.7;color:#6B6863;}

.rich-content{font-family:'Inter',sans-serif;font-size:15px;line-height:1.7;color:#6B6863;}
.rich-content *{font-family:'Inter',sans-serif!important;font-size:inherit!important;line-height:inherit!important;background:none!important;color:inherit!important;letter-spacing:normal!important;text-transform:none!important;}
.rich-content h1,.rich-content h2{font-family:'Fraunces',serif!important;font-size:19px!important;font-weight:400!important;font-style:italic!important;color:#0E0E0E!important;line-height:1.15!important;letter-spacing:-.01em!important;margin:28px 0 10px!important;padding-bottom:10px;border-bottom:1px solid #F0EFEA;}
.rich-content h1:first-child,.rich-content h2:first-child{margin-top:0!important;}
.rich-content h3{font-family:'Inter',sans-serif!important;font-size:15px!important;font-weight:500!important;font-style:normal!important;color:#0E0E0E!important;line-height:1.5!important;margin:20px 0 4px!important;}
.rich-content h4{font-family:'JetBrains Mono',monospace!important;font-size:9px!important;font-weight:500!important;color:#A6A39E!important;letter-spacing:.16em!important;text-transform:uppercase!important;margin:16px 0 4px!important;}
.rich-content p{margin:0 0 8px!important;color:#6B6863!important;font-size:15px!important;}
.rich-content p:last-child{margin-bottom:0!important;}
.rich-content strong,.rich-content b{font-weight:500!important;color:#0E0E0E!important;}
.rich-content em,.rich-content i{font-style:italic!important;}
.rich-content span{font-family:inherit!important;font-size:inherit!important;color:inherit!important;background:none!important;}
.rich-content ul{list-style:none!important;padding:0!important;margin:4px 0 12px!important;}
.rich-content ul li{display:flex!important;align-items:flex-start!important;gap:12px!important;padding:7px 0!important;border-bottom:1px solid #F5F5F7!important;font-size:15px!important;line-height:1.7!important;color:#6B6863!important;}
.rich-content ul li:last-child{border-bottom:none!important;}
.rich-content ul li::before{content:""!important;flex-shrink:0!important;width:6px!important;height:6px!important;border-radius:50%!important;background:#C8354B!important;margin-top:9px!important;}
.rich-content ol{list-style:none!important;padding:0!important;margin:4px 0 12px!important;counter-reset:rc-ol;}
.rich-content ol li{display:flex!important;align-items:flex-start!important;gap:12px!important;padding:7px 0!important;border-bottom:1px solid #F5F5F7!important;font-size:15px!important;line-height:1.7!important;color:#6B6863!important;counter-increment:rc-ol!important;}
.rich-content ol li:last-child{border-bottom:none!important;}
.rich-content ol li::before{content:counter(rc-ol)"."!important;flex-shrink:0!important;font-weight:500!important;color:#0E0E0E!important;font-size:14px!important;min-width:20px!important;margin-top:1px!important;}
.rich-content hr{border:none!important;height:1px!important;background:#F0EFEA!important;margin:16px 0!important;}

.cd-sidebar{position:sticky;top:32px;}
.cd-card{background:#F5F5F7;border:1px solid #F0EFEA;border-radius:14px;padding:24px;margin-bottom:12px;}
.cd-card-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#A6A39E;padding-bottom:16px;margin-bottom:4px;border-bottom:1px solid #F0EFEA;}
.cd-card-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #F0EFEA;}
.cd-card-row:last-of-type{border-bottom:none;}
.cd-card-key{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:#A6A39E;text-transform:uppercase;letter-spacing:.14em;flex-shrink:0;}
.cd-card-val{font-family:'Inter',sans-serif;font-size:13px;font-weight:500;color:#0E0E0E;text-align:right;}
.cd-card-note{font-family:'Inter',sans-serif;font-size:13px;color:#A6A39E;line-height:1.7;padding:16px;border-radius:10px;background:#F5F5F7;border:1px solid #F0EFEA;border-left:3px solid #C8354B;}

.cd-cta{background:#0E0E0E;padding:96px clamp(24px,7vw,120px);}
.cd-cta-inner{max-width:540px;}
.cd-cta-eyebrow{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#E8B4BD;display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.cd-cta-eyebrow::before{content:'';display:block;width:24px;height:1.5px;background:#E8B4BD;}
.cd-cta-title{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,42px);font-weight:400;line-height:1.02;letter-spacing:-.01em;color:#fff;margin-bottom:16px;font-style:italic;}
.cd-cta-title em{font-style:italic;color:#C8354B;}
.cd-cta-sub{font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,.40);line-height:1.7;margin-bottom:36px;font-weight:350;}

@media(max-width:900px){.cd-hero-inner{grid-template-columns:1fr;gap:40px;}.cd-hero-right{order:-1;}.cd-img-wrap,.cd-img-placeholder{aspect-ratio:16/9;}.cd-body-inner{grid-template-columns:1fr;}.cd-sidebar{position:static;}}
@media(max-width:600px){.cd-hero{padding-bottom:56px;}.cd-hero-inner{padding-top:60px;}.cd-title{font-size:clamp(28px,8vw,44px);}.cd-body{padding-top:56px;padding-bottom:72px;}.cd-cta{padding-top:72px;padding-bottom:72px;}}
`
