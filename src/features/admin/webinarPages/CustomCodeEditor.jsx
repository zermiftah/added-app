import { useEffect, useRef, useState, useCallback } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { fetchData } from "lib/api"
import { buildPreviewPage } from "./previewMockData"

const IFRAME_HEAD = `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.3.1",
        "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
        "react-dom": "https://esm.sh/react-dom@18.3.1",
        "react-dom/client": "https://esm.sh/react-dom@18.3.1/client"
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;350;400;450;500;600&family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @font-face { font-family: 'Fraunces'; font-style: normal; font-weight: 300 400; font-display: swap; src: url('https://addededucation.com/fonts/fr-n-latin.woff2') format('woff2'); }
    @font-face { font-family: 'Fraunces'; font-style: italic; font-weight: 300 400; font-display: swap; src: url('https://addededucation.com/fonts/fr-i-latin.woff2') format('woff2'); }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #0E0E0E; }
    body { -webkit-font-smoothing: antialiased; }
  </style>
`

const DEFAULT_EXAMPLE = `export default function CustomLandingPage({ page, registerForWebinar }) {
  return (
    <div className="min-h-screen bg-ink text-white flex items-center justify-center p-10">
      <div className="text-center max-w-lg">
        <h1 className="font-fraunces text-5xl italic mb-4">{page.webinar_title}</h1>
        <p className="text-white/60">Start writing your custom landing page here.</p>
      </div>
    </div>
  )
}
`

/**
 * Custom Code editor for landing pages — CodeMirror on the left, a live
 * compiled preview (debounced) on the right, mounted inside an isolated
 * iframe (own document = own React instance via the CDN import map, and
 * the custom component's own `position: fixed` header etc. pins correctly
 * to the iframe's viewport instead of leaking onto the admin UI).
 */
export default function CustomCodeEditor({ token, value, onChange, previewThemeSeed = "hero-form-side" }) {
  const [source, setSource] = useState(value || DEFAULT_EXAMPLE)
  const [status, setStatus] = useState("idle") // idle | compiling | ok | error
  const [errorMsg, setErrorMsg] = useState("")
  const iframeRef = useRef(null)
  const rootRef = useRef(null)
  const debounceRef = useRef(null)
  const lastBlobUrls = useRef([])

  // Keep parent form state in sync
  useEffect(() => { onChange?.(source) }, [source]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prep the iframe document once
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    doc.open()
    doc.write(`<!doctype html><html><head>${IFRAME_HEAD}</head><body><div id="preview-root"></div></body></html>`)
    doc.close()
    // Block real form submission / navigation inside the live preview
    doc.addEventListener("submit", e => { e.preventDefault(); e.stopPropagation() }, true)
  }, [])

  const compileAndMount = useCallback(async (src) => {
    setStatus("compiling")
    try {
      const result = await fetchData("webinar-pages/compile-preview", { source: src }, "POST", token)
      const iframe = iframeRef.current
      if (!iframe?.contentDocument) return
      const doc = iframe.contentDocument

      // Swap the compiled CSS
      let styleTag = doc.getElementById("compiled-css")
      if (!styleTag) {
        styleTag = doc.createElement("style")
        styleTag.id = "compiled-css"
        doc.head.appendChild(styleTag)
      }
      styleTag.textContent = result.css || ""

      // Mount the compiled component as a fresh Blob-URL ES module import.
      // Blob URLs are unique every time, so this always re-executes fresh
      // (no stale module-cache issues between recompiles).
      const blob = new Blob([result.js], { type: "text/javascript" })
      const blobUrl = URL.createObjectURL(blob)
      lastBlobUrls.current.push(blobUrl)

      const [ReactMod, ReactDOMClientMod, CustomMod] = await Promise.all([
        doc.defaultView.eval('import("react")'),
        doc.defaultView.eval('import("react-dom/client")'),
        doc.defaultView.eval(`import("${blobUrl}")`),
      ])

      const CustomComponent = CustomMod.default
      if (!CustomComponent) throw new Error("No default export found — add `export default function YourComponent(...) { ... }`")

      const mockPage = buildPreviewPage(previewThemeSeed)
      const mockRegisterForWebinar = async (fields) => {
        console.log("[Preview] registerForWebinar called with:", fields)
        await new Promise(r => setTimeout(r, 500))
        return { ok: true }
      }

      if (!rootRef.current) {
        rootRef.current = ReactDOMClientMod.createRoot(doc.getElementById("preview-root"))
      }
      rootRef.current.render(
        ReactMod.createElement(CustomComponent, { page: mockPage, registerForWebinar: mockRegisterForWebinar })
      )

      // Clean up older blob URLs (keep only the last 2, in case of in-flight overlap)
      if (lastBlobUrls.current.length > 2) {
        URL.revokeObjectURL(lastBlobUrls.current.shift())
      }

      setStatus("ok")
      setErrorMsg("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err.message || "Compile failed")
    }
  }, [token, previewThemeSeed])

  // Debounced live compile — 700ms after typing stops
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => compileAndMount(source), 700)
    return () => clearTimeout(debounceRef.current)
  }, [source, compileAndMount])

  return (
    <div className="grid grid-cols-2 gap-3 h-[70vh] min-h-[500px]">
      {/* Code editor */}
      <div className="rounded-xl overflow-hidden border border-gray-200 flex flex-col">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-mono text-gray-500 flex items-center justify-between flex-shrink-0">
          <span>CustomLandingPage.tsx</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={source}
            height="100%"
            extensions={[javascript({ jsx: true, typescript: true })]}
            onChange={setSource}
            theme="dark"
            basicSetup={{ lineNumbers: true, foldGutter: true, autocompletion: true }}
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl overflow-hidden border border-gray-200 flex flex-col relative">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-mono text-gray-500 flex-shrink-0">
          Live Preview <span className="text-gray-400">— mock data, form submit disabled</span>
        </div>
        <div className="flex-1 relative bg-black">
          <iframe ref={iframeRef} title="Custom code preview" className="w-full h-full border-0" />
          {status === "error" && (
            <div className="absolute inset-x-0 bottom-0 bg-red-950/95 text-red-200 text-[12px] font-mono p-3 max-h-32 overflow-auto border-t border-red-800">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    idle:      { label: "Idle",       cls: "bg-gray-100 text-gray-500" },
    compiling: { label: "Compiling…", cls: "bg-amber-100 text-amber-700" },
    ok:        { label: "Compiled ✓", cls: "bg-emerald-100 text-emerald-700" },
    error:     { label: "Error",      cls: "bg-red-100 text-red-700" },
  }
  const s = map[status] || map.idle
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.cls}`}>{s.label}</span>
}
