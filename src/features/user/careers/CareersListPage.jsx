import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const API_BASE = "https://zmiftah.tech/addedapi"
const DETAIL_PATH = "/careers/detail"

const interviewSteps = [
  { num: "01", title: "Application & Cover Letter", desc: "Submit your application with your CV and a cover letter telling us why you're the right fit. We review every submission carefully." },
  { num: "02", title: "Intro Call", desc: "A relaxed 30-minute conversation to learn about your background, share what we do, and answer any questions you have about the role." },
  { num: "03", title: "Case Study", desc: "A take-home exercise tailored to your role. We want to see how you think — there's no single right answer." },
  { num: "04", title: "Video Interview", desc: "A deeper conversation about your experience, the case study, and how you'd approach real challenges in this position." },
  { num: "05", title: "Reference Check & Offer", desc: "We reach out to past collaborators, then extend a formal offer to the right candidate." },
]

export default function CareersListPage() {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [departments, setDepartments] = useState(["All"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const rolesRef = useRef(null)

  useEffect(() => { fetchJobs() }, [])
  useEffect(() => {
    setFiltered(activeFilter === "All" ? jobs : jobs.filter(j => j.department === activeFilter))
  }, [activeFilter, jobs])

  async function fetchJobs() {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_BASE}/careers`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      const jobsData = data.jobs || data
      if (!Array.isArray(jobsData)) throw new Error("Invalid response")
      setJobs(jobsData)
      const deps = Array.from(new Set(jobsData.map(j => j.department).filter(Boolean)))
      setDepartments(["All", ...deps.sort()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally { setLoading(false) }
  }

  function goToDetail(jobId, jobTitle) {
    try { sessionStorage.setItem("selected_job_id", String(jobId)); sessionStorage.setItem("selected_job_title", jobTitle) } catch {}
    window.location.href = `${DETAIL_PATH}?id=${encodeURIComponent(String(jobId))}`
  }

  function thumbUrl(p) { return `${API_BASE}/uploads/${p}` }

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#0E0E0E", background: "#FBFBFD", overflowX: "hidden" }}>
      <style>{styles}</style>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="cl-hero">
        <div className="cl-hero-bg" />
        <div className="cl-hero-overlay" />
        <div className="cl-hero-glow" />
        <div className="cl-hero-grid" />
        <motion.div className="cl-hero-inner" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div className="cl-eyebrow"><span className="cl-dot" />Careers at AddedEducation</div>
          <h1 className="cl-h1">Shape the future <span className="cl-h1-em">of admissions.</span></h1>
          <p className="cl-hero-sub">Join the team that's helped 3,170+ students earn spots at the world's top universities. We're building the most trusted name in university admissions across South East Asia.</p>
        </motion.div>
      </section>

      {/* ══ OPEN ROLES ══ */}
      <section className="cl-roles" ref={rolesRef}>
        <div className="cl-section-inner">
          <div className="cl-section-header">
            <p className="cl-section-tag">Open Positions</p>
            <h2 className="cl-section-title">Find your role<em> here.</em></h2>
          </div>

          {/* Filter pills */}
          <div className="cl-filter-row">
            {departments.map(dep => (
              <button key={dep} className={`cl-pill${activeFilter === dep ? " cl-pill-active" : ""}`} onClick={() => setActiveFilter(dep)}>
                {dep}
                {dep !== "All" && <span className="cl-pill-count">{jobs.filter(j => j.department === dep).length}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="cl-state"><div className="cl-spinner" /><span className="cl-state-text">Loading positions…</span></div>
          ) : error ? (
            <div className="cl-state cl-state-err">
              <span className="cl-state-icon">⚠</span>
              <span className="cl-state-text">{error}</span>
              <button className="cl-btn-outline" onClick={fetchJobs}>Try again</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="cl-state"><span className="cl-state-text">No open positions in this department right now.</span></div>
          ) : (
            <div className="cl-grid">
              <AnimatePresence mode="popLayout">
                {filtered.map((job, i) => (
                  <motion.div key={job.id} className="cl-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }} onClick={() => goToDetail(job.id, job.title)}>
                    <div className="cl-card-thumb">
                      {job.thumbnail
                        ? <img src={thumbUrl(job.thumbnail)} alt={job.title} className="cl-card-img" />
                        : <div className="cl-card-thumb-empty"><span className="cl-card-letter">{job.title.charAt(0)}</span></div>
                      }
                      <span className="cl-type-pill">{job.type}</span>
                    </div>
                    <div className="cl-card-body">
                      <div className="cl-card-tags">
                        <span className="cl-tag">{job.department}</span>
                        {job.deadline && <span className="cl-tag cl-tag-muted">Closes {job.deadline.slice(0, 10)}</span>}
                      </div>
                      <h3 className="cl-card-title">{job.title}</h3>
                      <div className="cl-card-meta"><span>📍 {job.location}</span></div>
                      {job.description && (() => {
                        const plain = job.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
                        return <p className="cl-card-desc">{plain.slice(0, 115)}{plain.length > 115 ? "…" : ""}</p>
                      })()}
                    </div>
                    <div className="cl-card-footer">
                      <button className="cl-apply-btn" onClick={e => { e.stopPropagation(); goToDetail(job.id, job.title) }}>Apply now →</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="cl-process">
        <div className="cl-section-inner">
          <div className="cl-section-header">
            <p className="cl-section-tag cl-section-tag-light">The Process</p>
            <h2 className="cl-section-title cl-section-title-light">How we<em> hire.</em></h2>
            <p className="cl-section-sub">Transparent, respectful, and designed to let you show your best self.</p>
          </div>
          <div className="cl-steps">
            {interviewSteps.map((step, i) => (
              <motion.div key={i} className="cl-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <div className="cl-step-num">{step.num}</div>
                <div className="cl-step-body">
                  <h3 className="cl-step-title">{step.title}</h3>
                  <p className="cl-step-desc">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@350;400;450;500&family=JetBrains+Mono:wght@400;500&display=swap');
@keyframes cl-spin { to { transform: rotate(360deg); } }
@keyframes cl-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.65);} }

.cl-hero { position:relative;overflow:hidden;background:#0E0E0E;color:#fff;padding-bottom:96px; }
.cl-hero-bg { position:absolute;inset:0;background-image:url('https://addededucation-assets.s3.us-east-1.amazonaws.com/images/vRwqcjkjJJvZusEeq6lojyQAW3s.png');background-size:cover;background-position:center top;background-repeat:no-repeat; }
.cl-hero-overlay { position:absolute;inset:0;background:linear-gradient(to bottom,rgba(14,14,14,0.55) 0%,rgba(14,14,14,0.72) 50%,rgba(14,14,14,0.95) 100%); }
.cl-hero-glow { position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(200,53,75,.12) 0%,transparent 65%);top:-120px;right:-80px;pointer-events:none; }
.cl-hero-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:72px 72px;pointer-events:none;mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent); }
.cl-hero-inner { position:relative;z-index:2;padding:140px clamp(24px,6vw,80px) 0; }
.cl-eyebrow { display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;margin-bottom:32px; }
.cl-dot { width:6px;height:6px;border-radius:50%;background:#C8354B;flex-shrink:0;animation:cl-pulse 2s ease-in-out infinite; }
.cl-h1 { font-family:'Fraunces',serif;font-size:clamp(36px,4.5vw,58px);font-weight:400;line-height:1.05;letter-spacing:-.02em;color:#fff;margin-bottom:32px;font-style:italic; }
.cl-h1-em { display:inline;font-style:italic;color:#C8354B; }
.cl-hero-sub { font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,.45);max-width:480px;line-height:1.7;margin-bottom:48px;font-weight:350; }
.cl-roles { background:#FBFBFD; }
.cl-section-inner { padding:96px clamp(24px,6vw,80px); }
.cl-section-header { margin-bottom:56px; }
.cl-section-tag { font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;margin-bottom:16px;display:flex;align-items:center;gap:10px; }
.cl-section-tag::before { content:'';display:block;width:24px;height:1.5px;background:#C8354B; }
.cl-section-tag-light { color:#E8B4BD; }
.cl-section-tag-light::before { background:#E8B4BD; }
.cl-section-title { font-family:'Fraunces',serif;font-size:clamp(32px,4vw,42px);font-weight:400;line-height:1.02;letter-spacing:-.01em;color:#0E0E0E; }
.cl-section-title em { font-style:italic;color:#C8354B; }
.cl-section-title-light { color:#fff!important; }
.cl-section-sub { font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,.4);margin-top:16px;max-width:460px;line-height:1.7;font-weight:350; }

.cl-filter-row { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:48px; }
.cl-pill { display:inline-flex;align-items:center;gap:7px;padding:8px 18px;font-size:13px;font-weight:400;border:1.5px solid #F0EFEA;border-radius:999px;background:transparent;color:#6B6863;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s; }
.cl-pill:hover { border-color:#A6A39E;color:#0E0E0E; }
.cl-pill-active { border-color:#0E0E0E!important;color:#0E0E0E!important;background:#F5F5F7!important; }
.cl-pill-count { font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;background:#F0EFEA;color:#6B6863;padding:1px 7px;border-radius:999px; }
.cl-pill-active .cl-pill-count { background:#0E0E0E;color:#fff; }

.cl-state { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:80px 24px;text-align:center;border:1.5px dashed #F0EFEA;border-radius:14px; }
.cl-state-err { border-color:rgba(200,53,75,.2); }
.cl-state-icon { font-size:32px; }
.cl-state-text { font-family:'Inter',sans-serif;font-size:14px;color:#A6A39E; }
.cl-spinner { width:26px;height:26px;border-radius:50%;border:2px solid #F0EFEA;border-top-color:#0E0E0E;animation:cl-spin .75s linear infinite; }
.cl-btn-outline { display:inline-flex;align-items:center;gap:8px;background:transparent;color:#6B6863;padding:10px 20px;border-radius:999px;font-family:'Inter',sans-serif;font-size:13px;font-weight:450;border:1.5px solid #F0EFEA;cursor:pointer;transition:all .2s; }
.cl-btn-outline:hover { border-color:#A6A39E;color:#0E0E0E; }

.cl-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px; }
.cl-card { background:#fff;border:1.5px solid #F0EFEA;border-radius:14px;cursor:pointer;overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s,box-shadow .2s,transform .2s; }
.cl-card:hover { border-color:#A6A39E;box-shadow:0 8px 32px rgba(0,0,0,.06);transform:translateY(-2px); }
.cl-card-thumb { position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:#F5F5F7;flex-shrink:0; }
.cl-card-img { width:100%;height:100%;object-fit:cover;transition:transform .4s ease; }
.cl-card:hover .cl-card-img { transform:scale(1.04); }
.cl-card-thumb-empty { width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#F5F5F7; }
.cl-card-letter { font-family:'Fraunces',serif;font-size:56px;font-weight:400;font-style:italic;color:rgba(200,53,75,.12);line-height:1;user-select:none; }
.cl-type-pill { position:absolute;bottom:10px;left:10px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;font-weight:500;padding:4px 10px;border-radius:999px;background:rgba(14,14,14,.8);color:#E8B4BD;border:1px solid rgba(200,53,75,.25);backdrop-filter:blur(8px); }
.cl-card-body { padding:20px 22px;flex:1;display:flex;flex-direction:column;gap:10px; }
.cl-card-tags { display:flex;gap:7px;flex-wrap:wrap; }
.cl-tag { font-family:'Inter',sans-serif;font-size:11px;font-weight:450;letter-spacing:.02em;padding:4px 10px;border-radius:999px;background:#F5F5F7;border:1px solid #F0EFEA;color:#6B6863; }
.cl-tag-muted { color:#A6A39E;background:#FBFBFD; }
.cl-card-title { font-family:'Fraunces',serif;font-size:20px;font-weight:400;line-height:1.1;color:#0E0E0E;transition:color .2s;letter-spacing:-.01em; }
.cl-card:hover .cl-card-title { color:#C8354B; }
.cl-card-meta { display:flex;flex-wrap:wrap;gap:12px;font-family:'Inter',sans-serif;font-size:12px;color:#A6A39E; }
.cl-card-desc { font-family:'Inter',sans-serif;font-size:14px;color:#A6A39E;line-height:1.7;font-weight:350; }
.cl-card-footer { padding:0 22px 20px; }
.cl-apply-btn { display:inline-flex;align-items:center;gap:8px;padding:10px 20px;font-size:13px;font-weight:450;letter-spacing:.01em;border-radius:999px;background:#0E0E0E;color:#fff;border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s; }
.cl-apply-btn:hover { background:#C8354B; }

.cl-process { background:#0E0E0E; }
.cl-steps { display:flex;flex-direction:column;gap:0;position:relative;max-width:680px; }
.cl-steps::before { content:'';position:absolute;left:20px;top:10px;bottom:10px;width:1px;background:linear-gradient(to bottom,transparent,rgba(200,53,75,.25) 10%,rgba(200,53,75,.25) 90%,transparent); }
.cl-step { display:flex;gap:40px;align-items:flex-start;padding:32px 0;border-bottom:1px solid rgba(255,255,255,.04);position:relative; }
.cl-step:last-child { border-bottom:none; }
.cl-step-num { font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.14em;color:#C8354B;flex-shrink:0;width:40px;text-align:center;padding-top:2px;position:relative;z-index:1; }
.cl-step-body { flex:1; }
.cl-step-title { font-family:'Fraunces',serif;font-size:20px;font-weight:400;color:#fff;margin-bottom:10px;letter-spacing:-.01em; }
.cl-step-desc { font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,.40);line-height:1.7;font-weight:350; }

@media(max-width:640px){.cl-grid{grid-template-columns:1fr;}.cl-h1{font-size:clamp(28px,8vw,44px);}.cl-hero-inner{padding-top:100px;}.cl-section-inner{padding:72px 24px;}}
`
