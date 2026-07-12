import { useEffect, useRef, useState } from "react"
import { API_BASE_URL } from "lib/api"
import { createRegisterForWebinar } from "./registerForWebinar"

// Must match the import map in index.html exactly — the compiled custom
// bundle's own `import ... from "react"` resolves through THAT map, and we
// resolve the same URLs here so both end up sharing the exact same cached
// module instance (critical: two different React copies in one page breaks
// hooks/context). `/* @vite-ignore */` stops Vite from trying to statically
// bundle these — they must stay real runtime browser imports.
const REACT_CDN     = "https://esm.sh/react@18.3.1"
const REACT_DOM_CDN = "https://esm.sh/react-dom@18.3.1/client"

const UPLOADS_BASE = API_BASE_URL.replace(/\/addedapi$/, "") + "/addedapi/uploads/"

/**
 * Renders a Custom Code landing page. The compiled component is mounted as
 * an isolated "React island" inside a plain DOM node — NOT as normal nested
 * JSX — because the compiled bundle uses its own CDN-loaded React instance
 * (see index.html import map), separate from the main app's bundled React.
 * Mixing the two as parent/child would break hooks.
 */
export default function CustomPageRenderer({ page }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let root = null
    let cssLink = null

    async function mount() {
      try {
        if (!page.custom_compiled_js) {
          throw new Error("This page doesn't have compiled custom code yet — save it once in Added Admin first.")
        }

        if (page.custom_compiled_css) {
          cssLink = document.createElement("link")
          cssLink.rel = "stylesheet"
          cssLink.href = UPLOADS_BASE + page.custom_compiled_css
          document.head.appendChild(cssLink)
        }

        const jsUrl = UPLOADS_BASE + page.custom_compiled_js
        const [ReactMod, ReactDOMClientMod, CustomMod] = await Promise.all([
          import(/* @vite-ignore */ REACT_CDN),
          import(/* @vite-ignore */ REACT_DOM_CDN),
          import(/* @vite-ignore */ jsUrl),
        ])
        if (cancelled) return

        const CustomComponent = CustomMod.default
        if (!CustomComponent) throw new Error("The compiled code has no default export (missing `export default function ...`).")

        root = ReactDOMClientMod.createRoot(containerRef.current)
        root.render(
          ReactMod.createElement(CustomComponent, {
            page,
            registerForWebinar: createRegisterForWebinar(page),
          })
        )
      } catch (err) {
        console.error("[CustomPageRenderer]", err)
        if (!cancelled) setError(err.message || "This page couldn't load.")
      }
    }
    mount()

    return () => {
      cancelled = true
      if (root) setTimeout(() => root.unmount(), 0)
      if (cssLink) cssLink.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.slug, page.custom_compiled_js])

  if (error) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, padding: 40, textAlign: "center", fontFamily: "Inter, sans-serif" }}>
        <p style={{ color: "#666", fontSize: 15 }}>This page couldn't load.</p>
        <p style={{ color: "#999", fontSize: 12, maxWidth: 480 }}>{error}</p>
      </div>
    )
  }

  return <div ref={containerRef} />
}
