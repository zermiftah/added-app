import { useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  useAssetsQuery,
  useUploadAssetMutation,
  useDeleteAssetMutation,
} from "./api/assets-queries"
import { API_BASE_URL } from "lib/api"
import { useToast } from "hooks/useToast"

const FILE_URL = (url) => `https://zmiftah.tech${url}`

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function AdminAssets() {
  const [filter, setFilter]         = useState("all")  // all | image | video
  const [search, setSearch]         = useState("")
  const [searchDraft, setSearchDraft] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [preview, setPreview]       = useState(null)  // asset object
  const [copied, setCopied]         = useState(null)
  const [dragging, setDragging]     = useState(false)
  const fileRef = useRef(null)
  const { toast, showToast } = useToast()

  const { data: assets = [], isLoading } = useAssetsQuery()

  const uploadAsset = useUploadAssetMutation({
    onSuccess: () => showToast("Asset uploaded!"),
    onError: (msg) => showToast(msg, false),
  })
  const deleteAsset = useDeleteAssetMutation({
    onSuccess: () => { showToast("Asset deleted"); setDeleteConfirm(null) },
    onError: (msg) => showToast(msg, false),
  })

  // ── Filtered list ─────────────────────────────────────────────
  const filtered = assets.filter(a => {
    if (filter !== "all" && a.type !== filter) return false
    if (search && !a.filename.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // ── Upload handlers ───────────────────────────────────────────
  function handleFiles(files) {
    Array.from(files).forEach(f => uploadAsset.mutate(f))
  }

  function onDrop(e) {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  // ── Copy URL ──────────────────────────────────────────────────
  function copyUrl(asset) {
    const url = FILE_URL(asset.url)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(asset.filename)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div>
          <h1 className="text-[17px] font-bold text-gray-900">Media Library</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Upload images &amp; videos — auto-converted to WebP. Copy URL to use anywhere.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploadAsset.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[13px] font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {uploadAsset.isPending
            ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading…</>
            : <><span className="text-base">+</span> Upload</>}
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-white">
        {["all", "image", "video"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition ${
              filter === f
                ? "bg-[#0E0E0E] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All" : f === "image" ? "🖼 Images" : "🎬 Videos"}
          </button>
        ))}
        <div className="ml-auto relative">
          <input
            value={searchDraft}
            onChange={e => { setSearchDraft(e.target.value); setSearch(e.target.value) }}
            placeholder="Search filename…"
            className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-700 w-48 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[12px]">🔍</span>
        </div>
        <span className="text-[11px] text-gray-400">{filtered.length} files</span>
      </div>

      {/* Drop zone + Grid */}
      <div
        className={`flex-1 overflow-y-auto p-6 transition-all ${dragging ? "bg-blue-50 ring-2 ring-inset ring-blue-300" : "bg-gray-50"}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-[13px]">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <span className="text-4xl">📂</span>
            <p className="text-[13px]">{assets.length === 0 ? "No assets yet — upload your first file above" : "No results for this filter"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(asset => (
              <AssetCard
                key={asset.filename}
                asset={asset}
                copied={copied === asset.filename}
                onCopy={() => copyUrl(asset)}
                onPreview={() => setPreview(asset)}
                onDelete={() => setDeleteConfirm(asset)}
              />
            ))}
          </div>
        )}

        {dragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-blue-600 font-semibold text-lg">Drop to upload</p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <Modal onClose={() => setPreview(null)} title={preview.filename}>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center max-h-[60vh]">
                {preview.type === "image" ? (
                  <img src={FILE_URL(preview.url)} alt={preview.filename} className="max-w-full max-h-[60vh] object-contain" />
                ) : (
                  <video controls className="max-w-full max-h-[60vh]" src={FILE_URL(preview.url)} />
                )}
              </div>
              <div className="space-y-1 text-[12px] text-gray-500">
                <div><span className="font-medium text-gray-700">Size:</span> {fmtSize(preview.size)}</div>
                <div><span className="font-medium text-gray-700">Type:</span> {preview.type}</div>
                <div><span className="font-medium text-gray-700">URL:</span></div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-[11px] break-all text-gray-700">
                    {FILE_URL(preview.url)}
                  </code>
                  <button
                    onClick={() => { copyUrl(preview); showToast("URL copied!") }}
                    className="px-3 py-1.5 bg-[#0E0E0E] text-white rounded text-[11px] font-medium hover:bg-gray-800 whitespace-nowrap"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <Modal onClose={() => setDeleteConfirm(null)} title="Delete Asset">
            <p className="text-[13px] text-gray-600 mb-4">
              Delete <span className="font-semibold text-gray-900">{deleteConfirm.filename}</span>? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAsset.mutate(deleteConfirm.filename)}
                disabled={deleteAsset.isPending}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {deleteAsset.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium text-white ${toast.ok ? "bg-gray-900" : "bg-red-500"}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Asset card ────────────────────────────────────────────────
function AssetCard({ asset, copied, onCopy, onPreview, onDelete }) {
  const fullUrl = `${API_BASE_URL.replace(/\/addedapi$/, "")}${asset.url}`
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div
        className="aspect-square bg-gray-100 cursor-pointer overflow-hidden"
        onClick={onPreview}
      >
        {asset.type === "image" ? (
          <img
            src={fullUrl}
            alt={asset.filename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-400">
            <span className="text-3xl">🎬</span>
            <span className="text-[10px]">video</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2">
        <p className="text-[10px] text-gray-500 truncate mb-1.5" title={asset.filename}>
          {asset.filename}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            title="Copy URL"
            className={`flex-1 py-1 rounded text-[10px] font-semibold transition ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {copied ? "✓ Copied" : "Copy URL"}
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="w-6 h-6 rounded bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-[11px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Reusable Modal ─────────────────────────────────────────────
function Modal({ onClose, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[14px] font-bold text-gray-900 truncate pr-4">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-[12px]">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}
