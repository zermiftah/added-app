import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import ThemeHeroFormSide   from "../../user/webinarLanding/themes/ThemeHeroFormSide"
import ThemeHeroCtaStacked from "../../user/webinarLanding/themes/ThemeHeroCtaStacked"
import ThemeEditorialSplit from "../../user/webinarLanding/themes/ThemeEditorialSplit"
import ThemeSplitPortrait  from "../../user/webinarLanding/themes/ThemeSplitPortrait"
import ThemeCenteredMinimal from "../../user/webinarLanding/themes/ThemeCenteredMinimal"
import ThemeBentoGrid      from "../../user/webinarLanding/themes/ThemeBentoGrid"
import { buildPreviewPage } from "./previewMockData"

const THEME_COMPONENTS = {
  "hero-form-side":   ThemeHeroFormSide,
  "hero-cta-stacked": ThemeHeroCtaStacked,
  "editorial-split":  ThemeEditorialSplit,
  "split-portrait":   ThemeSplitPortrait,
  "centered-minimal": ThemeCenteredMinimal,
  "bento-grid":       ThemeBentoGrid,
}

// Minimal iframe document shell — self-contained so the theme's own
// `position: fixed` header/nav pins to THIS frame's viewport, not the
// admin page behind the modal. Fonts match the live site exactly.
const IFRAME_HEAD = `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;350;400;450;500;600&family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @font-face {
      font-family: 'Fraunces';
      font-style: normal; font-weight: 300 400; font-display: swap;
      src: url('https://addededucation.com/fonts/fr-n-latin.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Fraunces';
      font-style: italic; font-weight: 300 400; font-display: swap;
      src: url('https://addededucation.com/fonts/fr-i-latin.woff2') format('woff2');
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #0E0E0E; }
    body { -webkit-font-smoothing: antialiased; }
  </style>
`

export default function ThemePreviewModal({ themeKey, themeLabel, onClose }) {
  const iframeRef = useRef(null)
  const rootRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    doc.open()
    doc.write(`<!doctype html><html><head>${IFRAME_HEAD}</head><body><div id="preview-root"></div></body></html>`)
    doc.close()

    // Block any real form submission (HubSpot / registration API) — this is
    // a static Lorem Ipsum preview, it must never fire a network request.
    doc.addEventListener("submit", (e) => { e.preventDefault(); e.stopPropagation() }, true)

    const mountNode = doc.getElementById("preview-root")
    const ThemeComp = THEME_COMPONENTS[themeKey] || ThemeHeroFormSide
    const page = buildPreviewPage(themeKey)

    const root = createRoot(mountNode)
    rootRef.current = root
    root.render(<ThemeComp page={page} />)
    setReady(true)

    return () => {
      // Defer unmount to next tick — avoids "synchronous unmount during
      // render" warning if the modal closes mid-effect.
      setTimeout(() => rootRef.current?.unmount(), 0)
    }
  }, [themeKey])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(10,10,10,0.72)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="w-full bg-[#0E0E0E] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 1440, width: "96vw", height: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/10 bg-[#161616] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">Theme preview — {themeLabel}</p>
              <p className="text-[11px] text-white/40 truncate">Lorem Ipsum placeholder content · not real webinar data</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-white/30 px-2 py-1 rounded border border-white/10">Esc to close</span>
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body — scrollable "browser" frame */}
        <div className="flex-1 relative bg-black">
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "2px solid rgba(200,53,75,0.25)", borderTopColor: "#C8354B",
                animation: "tp-spin 0.7s linear infinite",
              }} />
              <style>{`@keyframes tp-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          <iframe
            ref={iframeRef}
            title="Theme preview"
            className="w-full h-full border-0"
            style={{ opacity: ready ? 1 : 0, transition: "opacity 0.2s ease" }}
          />
        </div>
      </div>
    </div>
  )
}
