import { API_BASE_URL } from "lib/api"
import { trackFinallyLeads, deriveLP } from "lib/tracking"

/**
 * registerForWebinar — the one function custom-code landing pages need for
 * a fully working registration form. Bound to a specific `page` (via
 * createRegisterForWebinar), so custom code never has to know the slug,
 * the HubSpot IDs, or how the timezone/calendar math works — it just
 * calls this with the raw form fields.
 *
 * const registerForWebinar = createRegisterForWebinar(page)
 * const result = await registerForWebinar({ firstname, lastname, email, phone, country, curriculum, grade })
 * // result: { ok: true } | { ok: false, error: string }
 */
export function createRegisterForWebinar(page) {
  return async function registerForWebinar(fields) {
    try {
      const res = await fetch(`${API_BASE_URL}/webinar-pages/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: page.slug, ...fields }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.ok === false) {
        return { ok: false, error: data?.error || data?.message || "Registration failed. Please try again." }
      }

      // Best-effort HubSpot sync — only if this page has real IDs configured
      // in the sidebar. Mirrors what the built-in WebinarForm does, so
      // custom-code pages stay in sync with the CRM the same way. Fire and
      // forget: a HubSpot hiccup should never block the registrant from
      // seeing a successful confirmation (the DB save above already
      // succeeded, which is the source of truth).
      if (page.hubspot_portal_id && page.hubspot_form_id) {
        const hsFields = Object.entries(fields)
          .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
          .map(([name, value]) => ({ name, value: String(value) }))
        fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${page.hubspot_portal_id}/${page.hubspot_form_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: hsFields,
            context: { pageUri: window.location.href, pageName: page.webinar_title },
          }),
        }).catch(() => {})
      }

      trackFinallyLeads(deriveLP(page.webinar_place))
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || "Network error — please check your connection and try again." }
    }
  }
}
