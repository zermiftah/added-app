import { useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import { fetchData } from "lib/api"
import ThemeHeroFormSide   from "./themes/ThemeHeroFormSide"
import ThemeHeroCtaStacked from "./themes/ThemeHeroCtaStacked"
import ThemeEditorialSplit from "./themes/ThemeEditorialSplit"
import ThemeSplitPortrait  from "./themes/ThemeSplitPortrait"
import ThemeCenteredMinimal from "./themes/ThemeCenteredMinimal"
import ThemeBentoGrid      from "./themes/ThemeBentoGrid"
import ThemeInPersonSession from "./themes/ThemeInPersonSession"
import CustomPageRenderer  from "./CustomPageRenderer"

const THEMES = {
  "hero-form-side":   ThemeHeroFormSide,
  "hero-cta-stacked": ThemeHeroCtaStacked,
  "editorial-split":  ThemeEditorialSplit,
  "split-portrait":   ThemeSplitPortrait,
  "centered-minimal": ThemeCenteredMinimal,
  "bento-grid":       ThemeBentoGrid,
  "in-person-session": ThemeInPersonSession,
}

export default function WebinarLandingPage() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, page: null, notFound: false })

  useEffect(() => {
    let cancelled = false
    setState({ loading: true, page: null, notFound: false })

    fetchData(`webinar-pages/by-slug/${encodeURIComponent(slug)}`, null, "GET")
      .then(r => { if (!cancelled) setState({ loading: false, page: r.page, notFound: false }) })
      .catch(() => { if (!cancelled) setState({ loading: false, page: null, notFound: true }) })

    return () => { cancelled = true }
  }, [slug])

  // Set page title once data loaded
  useEffect(() => {
    if (state.page?.webinar_title) {
      document.title = `${state.page.webinar_title} — AddedEducation`
    }
    return () => { document.title = "AddedEducation" }
  }, [state.page])

  if (state.loading) {
    return (
      <div style={{ background: "#0E0E0E", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontFamily: "'Inter',sans-serif", fontSize: 14 }}>
        Loading…
      </div>
    )
  }

  if (state.notFound || !state.page) {
    // Redirect to home — keeps SEO clean (no random 404 routes)
    return <Navigate to="/" replace />
  }

  if (state.page.content_mode === "custom") {
    return <CustomPageRenderer page={state.page} />
  }

  const ThemeComp = THEMES[state.page.theme] || ThemeHeroFormSide
  return <ThemeComp page={state.page} />
}
