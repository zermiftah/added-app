import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const API_BASE = "https://zmiftah.tech/addedapi"
const LIST_PATH = "/careers"

function Field({ label, error, children }) {
  return (
    <div className="ca-field">
      <label className="ca-label">{label}</label>
      {children}
      {error && <p className="ca-error">{error}</p>}
    </div>
  )
}

export default function CareerApplyPage() {
  const [jobId, setJobId] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", linkedin: "", portfolio: "", years_experience: "", source: "", cover_letter: "" })
  const [cvFile, setCvFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [drag, setDrag] = useState(false)
  const [toast, setToast] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    try { setJobId(sessionStorage.getItem("selected_job_id") || ""); setJobTitle(sessionStorage.getItem("selected_job_title") || "") } catch {}
  }, [])

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function showToast(msg, type = "error") {
    setToast({ msg, type }); setTimeout(() => setToast(null), 4500)
  }

  function validate() {
    const e = {}
    if (!form.first_name.trim()) e.first_name = "Required"
    if (!form.last_name.trim()) e.last_name = "Required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required"
    if (!form.phone.trim()) e.phone = "Required"
    if (!cvFile) e.cv = "Please upload your CV"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!jobId) { showToast("No job selected. Please go back."); return }
    if (!validate()) { showToast("Please fill in all required fields."); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("job_id", jobId); fd.append("job_title", jobTitle)
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (cvFile) fd.append("cv", cvFile)
      const res = await fetch(`${API_BASE}/careers/apply`, { method: "POST", body: fd })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Submission failed") }
      setSubmitted(true)
      try { sessionStorage.removeItem("selected_job_id"); sessionStorage.removeItem("selected_job_title") } catch {}
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Something went wrong")
    } finally { setSubmitting(false) }
  }

  function handleDrop(e) {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]; if (f) acceptFile(f)
  }

  function acceptFile(f) {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowed.includes(f.type)) { showToast("Only PDF and Word documents are accepted."); return }
    if (f.size > 5 * 1024 * 1024) { showToast("File must be under 5MB."); return }
    setCvFile(f); setErrors(e => ({ ...e, cv: "" }))
  }

  // ── SUCCESS ──
  if (submitted) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter',sans-serif", background: "#FBFBFD" }}>
        <style>{styles}</style>
        <Navbar />
        <motion.div className="ca-success" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="ca-success-icon">🎉</div>
          <h1 className="ca-success-title">Application Submitted!</h1>
          <p className="ca-success-sub">
            Thank you for applying to <strong>{jobTitle || "this position"}</strong>.<br />
            Our team will review your application and respond within 5 business days.
          </p>
          <button onClick={() => window.location.href = LIST_PATH} className="ca-btn-primary">← View More Open Roles</button>
        </motion.div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: "#0E0E0E", background: "#FBFBFD", overflowX: "hidden" }}>
      <style>{styles}</style>
      <Navbar />

      {/* ══ HEADER ══ */}
      <header className="ca-header">
        <div className="ca-header-glow" />
        <div className="ca-header-grid" />
        <motion.div className="ca-header-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div className="ca-eyebrow"><span className="ca-dot" />Application Form</div>
          <h1 className="ca-title">
            Apply for
            <em>{jobTitle || "this position"}</em>
          </h1>
          <p className="ca-subtitle">Fill in your details below. Required fields are marked with *.</p>
        </motion.div>
      </header>

      {/* ══ FORM ══ */}
      <main className="ca-form-section">
        <motion.div className="ca-form-wrap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>

          {/* Personal Info */}
          <div className="ca-group">
            <p className="ca-group-label">Personal Information</p>
            <div className="ca-grid">
              <Field label="First Name *" error={errors.first_name}>
                <input className={`ca-input${errors.first_name ? " ca-input-err" : ""}`} value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="Jane" />
              </Field>
              <Field label="Last Name *" error={errors.last_name}>
                <input className={`ca-input${errors.last_name ? " ca-input-err" : ""}`} value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Smith" />
              </Field>
              <Field label="Email *" error={errors.email}>
                <input className={`ca-input${errors.email ? " ca-input-err" : ""}`} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@email.com" />
              </Field>
              <Field label="Phone *" error={errors.phone}>
                <input className={`ca-input${errors.phone ? " ca-input-err" : ""}`} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+62 812 3456 7890" />
              </Field>
            </div>
          </div>

          {/* Professional */}
          <div className="ca-group">
            <p className="ca-group-label">Professional Details</p>
            <div className="ca-grid">
              <Field label="LinkedIn URL">
                <input className="ca-input" value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" />
              </Field>
              <Field label="Portfolio / Website">
                <input className="ca-input" value={form.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="yoursite.com" />
              </Field>
              <Field label="Years of Experience">
                <select className="ca-input ca-select" value={form.years_experience} onChange={e => set("years_experience", e.target.value)}>
                  <option value="">Select…</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </Field>
              <Field label="How did you hear about us?">
                <select className="ca-input ca-select" value={form.source} onChange={e => set("source", e.target.value)}>
                  <option value="">Select…</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="jobboard">Job Board</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="ca-group">
            <p className="ca-group-label">Cover Letter</p>
            <div className="ca-grid-full">
              <Field label="Cover Letter">
                <textarea className="ca-textarea" value={form.cover_letter} onChange={e => set("cover_letter", e.target.value)} placeholder="Tell us why you'd be a great fit for this role…" />
              </Field>
            </div>
          </div>

          {/* CV Upload */}
          <div className="ca-group">
            <p className="ca-group-label">Resume / CV</p>
            <Field label="Upload CV *" error={errors.cv}>
              <div
                className={`ca-upload${drag ? " ca-upload-drag" : ""}${cvFile ? " ca-upload-done" : ""}${errors.cv ? " ca-upload-err" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                {cvFile ? (
                  <>
                    <div className="ca-upload-check">✓</div>
                    <p className="ca-upload-filename">{cvFile.name}</p>
                    <p className="ca-upload-hint">Click to replace</p>
                  </>
                ) : (
                  <>
                    <div className="ca-upload-icon">↑</div>
                    <p className="ca-upload-text"><strong>Click to upload</strong> or drag & drop</p>
                    <p className="ca-upload-hint">PDF or Word — max 5MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => e.target.files?.[0] && acceptFile(e.target.files[0])} />
            </Field>
          </div>

          {/* Submit */}
          <div className="ca-submit-row">
            <button className="ca-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <><span className="ca-btn-spinner" /> Submitting…</> : "Submit Application →"}
            </button>
            <p className="ca-disclaimer">By submitting, you agree to our privacy policy. Your data will only be used to evaluate your application.</p>
          </div>
        </motion.div>
      </main>

      {/* Toast */}
      {toast && (
        <motion.div className="ca-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
          {toast.msg}
        </motion.div>
      )}

      <Footer />
    </div>
  )
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@350;400;450;500&family=JetBrains+Mono:wght@400;500&display=swap');
@keyframes ca-spin{to{transform:rotate(360deg);}}
@keyframes ca-pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.65);}}

.ca-header{position:relative;overflow:hidden;background:#0E0E0E;color:#fff;padding-bottom:96px;}
.ca-header-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(200,53,75,.10) 0%,transparent 65%);top:-120px;right:-80px;pointer-events:none;}
.ca-header-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:72px 72px;pointer-events:none;mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);}
.ca-header-content{position:relative;z-index:2;padding:120px clamp(24px,7vw,120px) 0;max-width:760px;}
.ca-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;margin-bottom:32px;}
.ca-dot{width:6px;height:6px;border-radius:50%;background:#C8354B;flex-shrink:0;animation:ca-pulse 2s ease-in-out infinite;}
.ca-title{font-family:'Fraunces',serif;font-size:clamp(36px,5vw,64px);font-weight:400;line-height:.98;letter-spacing:-.02em;color:#fff;margin-bottom:32px;display:flex;flex-direction:column;gap:4px;}
.ca-title em{font-style:italic;color:#C8354B;display:block;}
.ca-subtitle{font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,.45);max-width:480px;line-height:1.7;font-weight:350;}

.ca-form-section{background:#FBFBFD;padding:80px clamp(24px,7vw,120px) 120px;}
.ca-form-wrap{max-width:860px;}
.ca-group{margin-bottom:56px;}
.ca-group-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;padding-bottom:18px;margin-bottom:28px;border-bottom:1px solid #F0EFEA;display:flex;align-items:center;gap:10px;}
.ca-group-label::before{content:'';display:block;width:24px;height:1.5px;background:#C8354B;}
.ca-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.ca-grid-full{display:grid;grid-template-columns:1fr;}
.ca-field{display:flex;flex-direction:column;gap:8px;}
.ca-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#6B6863;}
.ca-input,.ca-textarea{background:#fff;border:1.5px solid #F0EFEA;border-radius:10px;color:#0E0E0E;padding:13px 16px;font-size:14px;font-weight:400;font-family:'Inter',sans-serif;outline:none;width:100%;transition:border-color .15s,box-shadow .15s;}
.ca-input::placeholder,.ca-textarea::placeholder{color:#A6A39E;font-weight:350;}
.ca-input:focus,.ca-textarea:focus{border-color:#0E0E0E;box-shadow:0 0 0 3px rgba(14,14,14,.05);}
.ca-input-err{border-color:#C8354B!important;}
.ca-input-err:focus{box-shadow:0 0 0 3px rgba(200,53,75,.08)!important;}
.ca-select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236B6863' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;}
.ca-textarea{resize:vertical;min-height:148px;}
.ca-error{font-family:'Inter',sans-serif;font-size:12px;color:#C8354B;}

.ca-upload{border:2px dashed #F0EFEA;border-radius:14px;padding:48px 32px;text-align:center;cursor:pointer;background:#fff;transition:all .2s;}
.ca-upload:hover{border-color:#A6A39E;background:#FBFBFD;}
.ca-upload-drag{border-color:#0E0E0E;background:#F5F5F7;}
.ca-upload-done{border-color:#6B1818;border-style:solid;background:rgba(107,24,24,.03);}
.ca-upload-err{border-color:#C8354B;}
.ca-upload-icon{font-size:24px;color:#A6A39E;margin-bottom:12px;display:block;line-height:1;}
.ca-upload-check{font-size:22px;color:#6B1818;margin-bottom:10px;}
.ca-upload-text{font-family:'Inter',sans-serif;font-size:14px;color:#6B6863;margin-bottom:6px;}
.ca-upload-text strong{color:#0E0E0E;font-weight:500;}
.ca-upload-filename{font-family:'Inter',sans-serif;font-size:14px;color:#0E0E0E;font-weight:450;margin-bottom:4px;}
.ca-upload-hint{font-family:'Inter',sans-serif;font-size:12px;color:#A6A39E;}

.ca-submit-row{display:flex;flex-direction:column;gap:16px;}
.ca-submit{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:#0E0E0E;color:#fff;padding:16px 32px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:450;letter-spacing:.01em;border:none;cursor:pointer;transition:all .2s;width:100%;}
.ca-submit:hover:not(:disabled){background:#C8354B;transform:translateY(-1px);}
.ca-submit:disabled{opacity:.4;cursor:not-allowed;}
.ca-btn-spinner{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:ca-spin .7s linear infinite;display:inline-block;flex-shrink:0;}
.ca-disclaimer{font-family:'Inter',sans-serif;font-size:12px;color:#A6A39E;text-align:center;line-height:1.7;font-weight:350;}

.ca-btn-primary{display:inline-flex;align-items:center;gap:8px;background:#0E0E0E;color:#fff;padding:14px 28px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;font-weight:450;border:none;cursor:pointer;transition:all .2s;}
.ca-btn-primary:hover{background:#C8354B;transform:translateY(-1px);}

.ca-success{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:70vh;padding:60px clamp(24px,7vw,120px);background:#FBFBFD;}
.ca-success-icon{font-size:56px;margin-bottom:28px;}
.ca-success-title{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,48px);font-weight:400;font-style:italic;letter-spacing:-.02em;color:#0E0E0E;margin-bottom:20px;}
.ca-success-sub{font-family:'Inter',sans-serif;font-size:15px;color:#6B6863;line-height:1.75;margin-bottom:40px;max-width:480px;font-weight:350;}
.ca-success-sub strong{color:#0E0E0E;font-weight:500;}

.ca-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0E0E0E;color:#fff;padding:14px 24px;border-radius:999px;font-family:'Inter',sans-serif;font-size:13px;font-weight:450;z-index:9999;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,.18);border:1px solid rgba(200,53,75,.35);}

@media(max-width:720px){.ca-grid{grid-template-columns:1fr;}.ca-header{padding-bottom:64px;}.ca-header-content{padding-top:80px;}.ca-form-section{padding-bottom:80px;}.ca-title{font-size:clamp(28px,8vw,44px);}}
`
