import { useEffect, useState } from "react"
import { useAdminStore } from "stores/adminStore"
import { fetchData, API_BASE_URL } from "lib/api"

const buildUrl = (path) => {
  if (!path) return null
  if (path.startsWith("http")) return path
  if (path.startsWith("/addedapi/")) return `${API_BASE_URL.replace(/\/$/, "").replace(/\/addedapi$/, "")}${path}`
  return path
}

/**
 * MediaPicker — modal that lists media library images and returns the
 * relative URL (`/addedapi/uploads/addededucation-assets/asset_xxx.webp`)
 * on pick. Excludes `_sm.webp` variants from the picker.
 *
 * Props:
 *   open, onClose, onPick(relativeUrl)
 *   value     — current value (relative path) for preview
 *   onClear   — optional clear handler
 *   typeFilter — "image" (default) — only show images
 */
export default function MediaPicker({ open, onClose, onPick }) {
  const token = useAdminStore(s => s.token)
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch]   = useState("")
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true); setError(null)
    fetchData("assets", null, "GET", token)
      .then(r => {
        if (cancelled) return
        const list = (r.assets || [])
          .filter(a => a.type === "image" && !a.filename.toLowerCase().endsWith("_sm.webp"))
        setItems(list)
      })
      .catch(e => !cancelled && setError(e.message || "Failed to load assets"))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [open, token])

  if (!open) return null

  const filtered = search.trim()
    ? items.filter(a => a.filename.toLowerCase().includes(search.toLowerCase()))
    : items

  return (
    <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-4">
          <h3 className="text-[14px] font-semibold text-gray-900">Select from Media Library</h3>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search filenames…"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] flex-1 max-w-xs focus:border-gray-900 focus:outline-none"
          />
          <button aria-label="Close" onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-[12px]">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="py-20 text-center text-[13px] text-gray-400">Loading…</div>
          ) : error ? (
            <div className="py-20 text-center text-[13px] text-red-600">{error}</div>
          ) : !filtered.length ? (
            <div className="py-20 text-center text-[13px] text-gray-500">No images found.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filtered.map(asset => (
                <button
                  key={asset.filename}
                  onClick={() => { onPick(asset.url); onClose() }}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-transparent hover:border-gray-900 transition-all"
                  title={asset.filename}
                >
                  <img
                    src={buildUrl(asset.url)}
                    alt={asset.filename}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate font-mono">{asset.filename}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200 text-[11px] text-gray-500 text-center">
          Tip: only desktop variants shown. Mobile <code>_sm.webp</code> will be picked automatically when the landing page loads on small screens.
        </div>
      </div>
    </div>
  )
}
