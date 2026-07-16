import { useState, useMemo } from "react"
import { trackFinallyLeads, deriveLP } from "lib/tracking"
import {
  HS_FIELD_GRADE, HS_FIELD_CURRICULUM,
  CURRICULUM_VALUES_EN, GRADE_OPTIONS, COUNTRIES, DEFAULT_COUNTRY_ISO,
  isValidEmail, digitsOnly, isCurriculumRejected, isGradeRejected,
} from "./sharedData"

/**
 * WebinarForm — themeable, drop-in form for any of the 3 landing templates.
 *
 * Props:
 *   page              — { hubspot_portal_id, hubspot_form_id, hubspot_region, reject_rules }
 *   tokens            — { bg, surface, border, text, textMuted, accent, accentDeep, inputBg, inputBorder, error }
 *   variant           — "dark" | "light"   (just hints palette defaults if tokens missing)
 *   defaultCountryIso — string  (per-theme default)
 *   labels            — optional override texts (rare; we default to English)
 */
export default function WebinarForm({
  page,
  tokens = {},
  variant = "dark",
  defaultCountryIso = DEFAULT_COUNTRY_ISO,
}) {
  // Palette tokens with safe defaults per variant
  const T = useMemo(() => {
    const dark = {
      bg: "transparent",
      surface: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.12)",
      text: "#FFFFFF",
      textMuted: "rgba(255,255,255,0.6)",
      accent: "#C8354B",
      accentDeep: "#9E2538",
      inputBg: "rgba(255,255,255,0.04)",
      inputBorder: "rgba(255,255,255,0.14)",
      error: "#F87171",
    }
    const light = {
      bg: "#FFFFFF",
      surface: "#F7F7F8",
      border: "rgba(0,0,0,0.10)",
      text: "#0E0E0E",
      textMuted: "#6B6863",
      accent: "#C8354B",
      accentDeep: "#9E2538",
      inputBg: "#FFFFFF",
      inputBorder: "rgba(0,0,0,0.14)",
      error: "#C8354B",
    }
    const base = variant === "light" ? light : dark
    return { ...base, ...tokens }
  }, [variant, tokens])

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    countryIso: defaultCountryIso,
    phone: "",
    curriculumIndex: "",
    grade: "",
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [rejected, setRejected] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstname.trim()) e.firstname = "First name is required"
    if (!form.lastname.trim())  e.lastname  = "Last name is required"
    if (!isValidEmail(form.email)) e.email = "Valid email is required"
    if (!digitsOnly(form.phone)) e.phone = "Phone number is required"
    if (form.curriculumIndex === "") e.curriculumIndex = "Select a curriculum"
    if (!form.grade) e.grade = "Select your grade"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev?.preventDefault?.()
    if (submitting) return
    if (!validate()) return

    // Check rejection rules BEFORE sending to HubSpot
    const rejectRules = page?.reject_rules || { curriculum: [], grade: [] }
    const curriculumValue = CURRICULUM_VALUES_EN[Number(form.curriculumIndex)]
    if (isCurriculumRejected(curriculumValue, rejectRules.curriculum) ||
        isGradeRejected(form.grade, rejectRules.grade)) {
      setRejected(true)
      return
    }

    setSubmitting(true)
    try {
      const country = COUNTRIES.find(c => c.iso === form.countryIso) || { dial: "+1" }
      const fullPhone = `${country.dial}${digitsOnly(form.phone)}`

      const portalId = page?.hubspot_portal_id || "4257853"
      const formId   = page?.hubspot_form_id
      const region   = page?.hubspot_region   || "na1"

      const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`
      const payload = {
        submittedAt: Date.now(),
        fields: [
          { name: "firstname", value: form.firstname.trim() },
          { name: "lastname",  value: form.lastname.trim() },
          { name: "email",     value: form.email.trim() },
          { name: "phone",     value: fullPhone },
          { name: "country",   value: country.name || "" },
          { name: HS_FIELD_CURRICULUM, value: curriculumValue },
          { name: HS_FIELD_GRADE,      value: form.grade },
        ],
        context: { pageUri: typeof window !== "undefined" ? window.location.href : "", pageName: page?.webinar_title || "Webinar" },
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || `Submit failed (${res.status})`)
      }

      // Fire confirmation email via our backend (non-blocking — don't fail if this errors)
      const slug = typeof window !== "undefined" ? window.location.pathname.replace(/^\//, "").split("?")[0] : ""
      fetch(`https://addededucation.com/addedapi/webinar-pages/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          firstname:  form.firstname.trim(),
          lastname:   form.lastname.trim(),
          email:      form.email.trim(),
          phone:      `${country.dial}${digitsOnly(form.phone)}`,
          country:    country.name || "",
          curriculum: curriculumValue,
          grade:      form.grade,
        }),
      }).catch(() => {})

      trackFinallyLeads(deriveLP(page?.webinar_place))
      setDone(true)
    } catch (err) {
      setErrors(e => ({ ...e, _form: err.message || "Submission failed. Please try again." }))
    } finally {
      setSubmitting(false)
    }
  }

  // ── Inline styles ──
  const labelStyle = { display: "block", fontFamily: "'Inter',sans-serif", fontSize: 12, color: T.textMuted, marginBottom: 6, letterSpacing: "0.01em" }
  const inputStyle = {
    width: "100%", padding: "12px 14px", fontFamily: "'Inter',sans-serif", fontSize: 14, color: T.text,
    background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10,
    outline: "none", transition: "border-color 0.15s ease, background 0.15s ease",
    boxSizing: "border-box",
  }
  const errMsg = (msg) => msg ? <p style={{ color: T.error, fontSize: 12, marginTop: 6, fontFamily: "'Inter',sans-serif" }}>{msg}</p> : null

  if (done) {
    return (
      <div style={{ padding: 28, textAlign: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14 }}>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, color: T.text, marginBottom: 10 }}>You're in.</h3>
        <p style={{ fontFamily: "'Inter',sans-serif", color: T.textMuted, fontSize: 14, lineHeight: 1.55 }}>
          Thanks for registering. We've sent confirmation details to your email — keep an eye on your inbox.
        </p>
      </div>
    )
  }

  if (rejected) {
    return (
      <div style={{ padding: 28, textAlign: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14 }}>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, color: T.text, marginBottom: 10 }}>This session isn't the right fit.</h3>
        <p style={{ fontFamily: "'Inter',sans-serif", color: T.textMuted, fontSize: 14, lineHeight: 1.55 }}>
          Based on your current grade or curriculum, this particular webinar may not be the best match. Please reach out to our team at <strong style={{ color: T.text }}>hello@addededucation.com</strong> and we'll guide you to the right resources.
        </p>
      </div>
    )
  }

  const selectedCountry = COUNTRIES.find(c => c.iso === form.countryIso) || COUNTRIES[0]

  return (
    <form onSubmit={onSubmit} noValidate style={{ width: "100%" }}>
      {/* First + Last name grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor="wf-first" style={labelStyle}>First name *</label>
          <input id="wf-first" value={form.firstname} onChange={e => set("firstname", e.target.value)} style={inputStyle} autoComplete="given-name" />
          {errMsg(errors.firstname)}
        </div>
        <div>
          <label htmlFor="wf-last" style={labelStyle}>Last name *</label>
          <input id="wf-last" value={form.lastname} onChange={e => set("lastname", e.target.value)} style={inputStyle} autoComplete="family-name" />
          {errMsg(errors.lastname)}
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="wf-email" style={labelStyle}>Email *</label>
        <input id="wf-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} autoComplete="email" />
        {errMsg(errors.email)}
      </div>

      {/* Phone with dial code */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="wf-phone" style={labelStyle}>Phone number *</label>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(110px, 130px) 1fr", gap: 8 }}>
          <select
            aria-label="Country dial code"
            value={form.countryIso}
            onChange={e => set("countryIso", e.target.value)}
            style={{ ...inputStyle, padding: "12px 10px", cursor: "pointer" }}
          >
            {COUNTRIES.map(c => (
              <option key={c.iso} value={c.iso} style={{ background: variant === "light" ? "#fff" : "#0E0E0E", color: variant === "light" ? "#0E0E0E" : "#fff" }}>
                {c.iso} {c.dial}
              </option>
            ))}
          </select>
          <input
            id="wf-phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={e => set("phone", digitsOnly(e.target.value))}
            placeholder={`${selectedCountry.dial} ...`}
            style={inputStyle}
            autoComplete="tel-national"
          />
        </div>
        {errMsg(errors.phone)}
      </div>

      {/* Curriculum */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="wf-curr" style={labelStyle}>Which curriculum is your child enrolled in? *</label>
        <select
          id="wf-curr"
          value={form.curriculumIndex}
          onChange={e => set("curriculumIndex", e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="" style={{ background: variant === "light" ? "#fff" : "#0E0E0E" }}>— Select curriculum —</option>
          {CURRICULUM_VALUES_EN.map((c, i) => (
            <option key={c} value={i} style={{ background: variant === "light" ? "#fff" : "#0E0E0E", color: variant === "light" ? "#0E0E0E" : "#fff" }}>
              {c}
            </option>
          ))}
        </select>
        {errMsg(errors.curriculumIndex)}
      </div>

      {/* Grade */}
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="wf-grade" style={labelStyle}>Current grade *</label>
        <select
          id="wf-grade"
          value={form.grade}
          onChange={e => set("grade", e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="" style={{ background: variant === "light" ? "#fff" : "#0E0E0E" }}>— Select grade —</option>
          {GRADE_OPTIONS.map(g => (
            <option key={g.value} value={g.value} style={{ background: variant === "light" ? "#fff" : "#0E0E0E", color: variant === "light" ? "#0E0E0E" : "#fff" }}>
              {g.label}
            </option>
          ))}
        </select>
        {errMsg(errors.grade)}
      </div>

      {errors._form && (
        <p style={{ color: T.error, fontSize: 13, marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>{errors._form}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%", padding: "14px 18px",
          background: T.accent, color: "#fff", border: "none", borderRadius: 10,
          fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em",
          cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.7 : 1,
          transition: "background 0.15s ease",
        }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = T.accentDeep }}
        onMouseLeave={e => { e.currentTarget.style.background = T.accent }}
      >
        {submitting ? "Submitting…" : "Reserve my spot"}
      </button>
    </form>
  )
}
