// lib/tracking.js
// Shared GA4 + Meta Pixel tracking for every landing page (6 built-in
// themes + Custom Code pages) — ported from the pattern already used in
// the Framer source files (page_view / page_exit / form_view / CTAClick,
// all suffixed by a per-page "LP" id), plus a fixed Finally_Leads event
// on successful registration.
//
// LP is derived from the page's own "Place" field (e.g. "Hong Kong" ->
// "hong_kong") instead of being hand-typed per file, so every page gets
// a consistent, correct LP automatically — no per-page setup needed.

const GA_ID = "G-9P7B03E9NM"

// "Hong Kong" -> "hong_kong", "United Kingdom" -> "united_kingdom"
export function deriveLP(place) {
  if (!place) return "unknown"
  const slug = String(place).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  return slug || "unknown"
}

export function trackMeta(ev, params, custom = false) {
  if (typeof window === "undefined" || !window.fbq) return
  try {
    if (custom) window.fbq("trackCustom", ev, params)
    else window.fbq("track", ev, params)
  } catch { /* never let tracking break the page */ }
}

export function trackGA(ev, params) {
  if (typeof window === "undefined" || !window.gtag) return
  try { window.gtag("event", ev, params) } catch { /* noop */ }
}

// CTA button clicks — e.g. trackCTAClick(lp, "register")
export function trackCTAClick(lp, buttonId) {
  trackMeta(`CTAClick_${lp}`, { button: buttonId }, true)
  trackGA(`cta_click_${lp}`, { button: buttonId })
}

// Fired once, on a successful registration — event name is always
// "Finally_Leads" (never suffixed), with the page identified via a param.
export function trackFinallyLeads(lp) {
  trackMeta("Finally_Leads", { landing_page: lp }, true)
  trackGA("Finally_Leads", { landing_page: lp })
}

// Call once per landing page mount (e.g. in a useEffect with []) — sets
// up GA4 (once per lp, shared script tag), fires page_view immediately,
// tracks form_view the first time #register scrolls into view, and
// tracks page_exit (with time-on-page + whether the form was seen) via
// beforeunload. Returns a cleanup function.
export function initPageTracking(lp, formElementId = "register") {
  if (typeof window === "undefined") return () => {}

  if (!document.getElementById(`ga4-${lp}`)) {
    const s = document.createElement("script")
    s.id = `ga4-${lp}`
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    gtag("js", new Date())
    gtag("config", GA_ID)
    window.gtag = window.gtag || gtag
  }

  trackGA(`page_view_${lp}`)
  trackMeta(`PageView_${lp}`, undefined, true)

  const pageLoadTime = Date.now()
  let formViewed = false

  const onExit = () => {
    const t = Math.round((Date.now() - pageLoadTime) / 1000)
    trackGA(`page_exit_${lp}`, { time_on_page_seconds: t, scrolled_to_form: formViewed })
  }
  window.addEventListener("beforeunload", onExit)

  let observer = null
  // The element may not exist yet on the very first paint (custom code
  // mounts async) — retry briefly instead of silently giving up.
  let tries = 0
  const attach = () => {
    const el = document.getElementById(formElementId)
    if (el) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !formViewed) {
          formViewed = true
          trackMeta(`FormView_${lp}`, undefined, true)
          trackGA(`form_view_${lp}`)
        }
      }, { threshold: 0.3 })
      observer.observe(el)
    } else if (tries < 10) {
      tries++
      setTimeout(attach, 300)
    }
  }
  attach()

  return () => {
    window.removeEventListener("beforeunload", onExit)
    if (observer) observer.disconnect()
  }
}
