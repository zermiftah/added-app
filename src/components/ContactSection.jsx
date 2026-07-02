import { useState, useEffect, useRef } from "react"

const COUNTRIES = [
  { iso: "AF", name: "Afghanistan", dial: "+93" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "JO", name: "Jordan", dial: "+962" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "LB", name: "Lebanon", dial: "+961" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "MA", name: "Morocco", dial: "+212" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "TW", name: "Taiwan", dial: "+886" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
]

function isValidEmail(e) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const d = e.trim().split("@")[1] || ""
  return re.test(e.trim()) && !d.includes("..") && !d.startsWith(".") && !d.endsWith(".")
}

export default function ContactSection({
  hubspotPortalId = "4257853",
  hubspotFormId = "e5ca474a-39dd-4fe2-b47c-5da477425a3e",
  hubspotRegion = "na2",
}) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    countryIso: "",
    phoneDialIso: "GB",
    phone: "",
    schoolname: "",
    email: "",
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const phoneRef = useRef(null)

  useEffect(() => {
    const fn = (e) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  const handleSubmit = async () => {
    setSubmitError("")
    const errs = {}
    if (!form.firstname.trim()) errs.firstname = "Please enter your first name."
    if (!form.email.trim()) errs.email = "Please enter your email address."
    else if (!isValidEmail(form.email)) errs.email = "Please enter a valid email."
    if (!form.countryIso) errs.countryIso = "Please select your country."
    if (!form.phone.trim()) errs.phone = "Please enter your phone number."
    if (!form.schoolname.trim()) errs.schoolname = "Please enter your school name."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const dial = COUNTRIES.find(c => c.iso === form.phoneDialIso)?.dial || ""
    const fullPhone = `${dial} ${form.phone.replace(/\D/g, "")}`

    setSubmitting(true)
    try {
      const base = hubspotRegion ? `https://api-${hubspotRegion}.hsforms.com` : "https://api.hsforms.com"
      const res = await fetch(`${base}/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: form.firstname.trim() },
            { name: "lastname", value: form.lastname.trim() },
            { name: "email", value: form.email.trim() },
            { name: "phone", value: fullPhone },
            { name: "school", value: form.schoolname.trim() },
            { name: "countryofresidence", value: COUNTRIES.find(c => c.iso === form.countryIso)?.name || "" },
          ],
          context: {
            pageUri: typeof window !== "undefined" ? window.location.href : "",
            pageName: "AddedEducation — Home",
          },
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        if (typeof window !== "undefined") {
          if (window.fbq) window.fbq("trackCustom", "Finally_Leads", { landing_page: "home" })
          if (window.gtag) window.gtag("event", "Finally_Leads", { landing_page: "home" })
        }
      } else {
        const d = await res.json().catch(() => null)
        setSubmitError(d?.message || "Something went wrong. Please try again.")
      }
    } catch {
      setSubmitError("Network error. Please check your connection.")
    } finally {
      setSubmitting(false)
    }
  }

  const currentDial = COUNTRIES.find(c => c.iso === form.phoneDialIso)
  const filteredCountries = COUNTRIES.filter(c => {
    const q = countrySearch.trim().toLowerCase()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q)
  })

  const inputBase = (hasErr) => ({
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.07)",
    border: `1px solid ${hasErr ? "#C8354B" : "rgba(255,255,255,0.13)"}`,
    borderRadius: 8,
    padding: "12px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 400,
    color: "#fff",
    outline: "none",
    transition: "border-color 0.18s",
  })

  const labelStyle = {
    display: "block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#A6A39E",
    marginBottom: 7,
  }

  const ErrMsg = ({ k }) => errors[k] ? (
    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#E8B4BD", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
      <span>⚠</span>{errors[k]}
    </p>
  ) : null

  return (
    <section id="contact" className="w-full bg-cream py-20 lg:py-28">
      <style>{`
        .ae-inp::placeholder { color: rgba(255,255,255,0.28) !important; }
        .ae-sel option { background: #0E0E0E; color: #fff; }
        .ae-phone-search::placeholder { color: rgba(255,255,255,0.35) !important; }
        .ae-inp:focus, .ae-sel:focus { border-color: rgba(255,255,255,0.3) !important; }
      `}</style>

      <div className="w-full px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          {/* Left - copy + form */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <div className="mb-7">
              <span className="font-mono text-[10px] font-500 uppercase tracking-[0.22em] border border-black/12 rounded px-3 py-2 text-ink">
                Contact Us
              </span>
            </div>

            <h2
              className="font-fraunces font-400 leading-[1.08] tracking-[-0.02em] text-ink mb-5"
              style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
            >
              Not sure where your child stands?{" "}
              <em className="italic text-accent">Let's find out together.</em>
            </h2>

            <p className="font-inter text-ink mb-3" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.45 }}>
              Book a complimentary 30-minute call with one of our counselors.
            </p>
            <p className="font-inter text-ink mb-5" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5 }}>
              You'll walk away knowing exactly where your child stands, what it would actually take to get them in, and 2–3 concrete next steps — whether you work with us or not.
            </p>

            {/* Trust strip */}
            <p className="font-inter text-stone flex flex-wrap gap-x-3 gap-y-1 items-center mb-8" style={{ fontSize: 12 }}>
              <span>Families in 12+ countries</span>
              <span className="text-stone-light">·</span>
              <span>Former admissions officers</span>
              <span className="text-stone-light">·</span>
              <span>WhatsApp support</span>
            </p>

            {/* Dark form card */}
            <div className="rounded-2xl p-8" style={{ background: "#0E0E0E" }}>
              {submitted ? (
                <div className="text-center py-12">
                  <p className="font-fraunces text-white font-400 mb-3" style={{ fontSize: 28 }}>
                    Thanks for reaching out!
                  </p>
                  <p className="font-inter text-stone-light" style={{ fontSize: 15, fontWeight: 350, lineHeight: 1.55 }}>
                    One of our counselors will be in touch shortly.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Row 1: First + Last */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={labelStyle}>First Name *</label>
                      <input
                        type="text"
                        placeholder="Jane"
                        value={form.firstname}
                        onChange={e => set("firstname", e.target.value)}
                        className="ae-inp"
                        style={inputBase(!!errors.firstname)}
                      />
                      <ErrMsg k="firstname" />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input
                        type="text"
                        placeholder="Smith"
                        value={form.lastname}
                        onChange={e => set("lastname", e.target.value)}
                        className="ae-inp"
                        style={inputBase(false)}
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="cs-country" style={labelStyle}>Country *</label>
                    <select
                      id="cs-country"
                      aria-label="Country"
                      value={form.countryIso}
                      onChange={e => set("countryIso", e.target.value)}
                      className="ae-sel"
                      style={{
                        ...inputBase(!!errors.countryIso),
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A6A39E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        paddingRight: 36,
                        cursor: "pointer",
                        color: form.countryIso ? "#fff" : "rgba(255,255,255,0.28)",
                      }}
                    >
                      <option value="" disabled>Please Select</option>
                      {COUNTRIES.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}
                    </select>
                    <ErrMsg k="countryIso" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <div ref={phoneRef} style={{ position: "relative", display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setPhoneOpen(v => !v)}
                        style={{
                          ...inputBase(false),
                          width: 110,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                          padding: "12px 12px",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: "#fff" }}>{currentDial?.iso} {currentDial?.dial}</span>
                        <span style={{ fontSize: 8, opacity: 0.55, transform: phoneOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
                      </button>

                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="7700 900 000"
                        value={form.phone}
                        onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
                        className="ae-inp"
                        style={{ ...inputBase(!!errors.phone), flex: 1 }}
                      />

                      {phoneOpen && (
                        <div style={{
                          position: "absolute",
                          top: "calc(100% + 6px)",
                          left: 0,
                          width: 280,
                          background: "#0E0E0E",
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: 12,
                          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                          zIndex: 50,
                          overflow: "hidden",
                        }}>
                          <div style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <input
                              autoFocus
                              placeholder="Search country…"
                              value={countrySearch}
                              onChange={e => setCountrySearch(e.target.value)}
                              className="ae-phone-search"
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "9px 12px",
                                fontSize: 13,
                                fontFamily: "'Inter', sans-serif",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 8,
                                color: "#fff",
                                outline: "none",
                              }}
                            />
                          </div>
                          <div style={{ maxHeight: 220, overflowY: "auto" }}>
                            {filteredCountries.map(c => {
                              const sel = c.iso === form.phoneDialIso
                              return (
                                <button
                                  key={c.iso}
                                  type="button"
                                  onClick={() => { setForm(f => ({ ...f, phoneDialIso: c.iso })); setPhoneOpen(false); setCountrySearch("") }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    padding: "9px 14px",
                                    border: "none",
                                    background: sel ? "rgba(200,53,75,0.18)" : "transparent",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 13,
                                    textAlign: "left",
                                    gap: 8,
                                  }}
                                  onMouseEnter={e => !sel && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                                  onMouseLeave={e => !sel && (e.currentTarget.style.background = "transparent")}
                                >
                                  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, opacity: 0.6, width: 20 }}>{c.iso}</span>
                                    {c.name}
                                  </span>
                                  <span style={{ color: "#A6A39E", fontSize: 11 }}>{c.dial}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <ErrMsg k="phone" />
                  </div>

                  {/* School */}
                  <div>
                    <label style={labelStyle}>School Name *</label>
                    <input
                      type="text"
                      placeholder="DAIS"
                      value={form.schoolname}
                      onChange={e => set("schoolname", e.target.value)}
                      className="ae-inp"
                      style={inputBase(!!errors.schoolname)}
                    />
                    <ErrMsg k="schoolname" />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      placeholder="jane@gmail.com"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      className="ae-inp"
                      style={inputBase(!!errors.email)}
                    />
                    <ErrMsg k="email" />
                  </div>

                  {submitError && (
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#E8B4BD", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                      <span>⚠</span>{submitError}
                    </p>
                  )}

                  <div style={{ marginTop: 4 }}>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="transition-all duration-200"
                      style={{
                        background: submitting ? "#9E2538" : "#C8354B",
                        color: "#fff",
                        border: "none",
                        borderRadius: 999,
                        padding: "14px 36px",
                        fontFamily: "'Inter',sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        cursor: submitting ? "not-allowed" : "pointer",
                        opacity: submitting ? 0.8 : 1,
                      }}
                      onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#9E2538" }}
                      onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#C8354B" }}
                    >
                      {submitting ? "Submitting…" : "Submit Now"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - hero image */}
          <div className="hidden lg:block">
            <div
              className="w-full h-full rounded-2xl overflow-hidden relative"
              style={{ background: "#E8E4DC", minHeight: 600 }}
            >
              <img
                src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782568975008_hWfYRPyqK5zWooV419AVB4Oxw.webp"
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
