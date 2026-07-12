import { useState, useEffect, useCallback } from "react"
import { useAdminStore } from "stores/adminStore"
import { fetchData, API_BASE_URL } from "lib/api"
import { formatInPlaceTimezone, getTimezoneForPlace, getTzAbbr } from "lib/countryTimezones"

const BASE_URL = API_BASE_URL.replace(/\/addedapi$/, "")

function Toast({ msg, kind = "info" }) {
  if (!msg) return null
  const bg = kind === "error" ? "#7F1D1D" : kind === "success" ? "#065F46" : "#111827"
  return (
    <div className="fixed top-4 right-4 z-[100] text-white text-[12px] px-4 py-2.5 rounded-lg shadow-xl" style={{ background: bg }}>
      {msg}
    </div>
  )
}

function RecordingModal({ open, reg, onClose, onSaved }) {
  const token = useAdminStore(s => s.token)
  const [url, setUrl]       = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState("")

  useEffect(() => {
    if (open) setUrl(reg?.recording_youtube_url || "")
  }, [open, reg])

  if (!open || !reg) return null

  const save = async () => {
    if (!url.trim()) return
    setSaving(true)
    try {
      const r = await fetchData(`webinar-registrants/${reg.id}/recording`, { recording_youtube_url: url.trim() }, "PUT", token)
      onSaved({ ...reg, recording_youtube_url: url.trim(), recording_token: r.recording_token, recording_expires_at: r.recording_expires_at })
      onClose()
    } catch (e) {
      setToast(e.message || "Failed to save")
      setTimeout(() => setToast(""), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        {toast && <div className="mb-3 text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded">{toast}</div>}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Set Recording</h3>
        <p className="text-[12px] text-gray-500 mb-4">
          {reg.firstname} {reg.lastname} · {reg.email}
        </p>
        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">YouTube URL</label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 text-[12px]">Cancel</button>
          <button disabled={saving || !url.trim()} onClick={save} className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] disabled:opacity-50">
            {saving ? "Saving…" : "Save & Generate Link"}
          </button>
        </div>
      </div>
    </div>
  )
}

function isExpired(dt) {
  if (!dt) return true
  const iso = String(dt).trim().replace(" ", "T")
  const date = new Date(iso.endsWith("Z") ? iso : iso + "Z")
  return date < new Date()
}

// Generic UTC-ish formatter — used for recording link expiry/sent-at,
// which are system timestamps, not tied to the webinar's place/timezone.
// MySQL returns these as tz-less strings that ARE true UTC (config/db.js
// forces timezone:"+00:00") — must force UTC parsing explicitly, otherwise
// `new Date(dt)` silently reinterprets it as the viewer's own local time.
function formatDt(dt) {
  if (!dt) return "—"
  const iso = String(dt).trim().replace(" ", "T")
  const date = new Date(iso.endsWith("Z") ? iso : iso + "Z")
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC"
}

export default function AdminRegistrants({ slug, title, onBack }) {
  const token = useAdminStore(s => s.token)
  const [registrants, setRegistrants] = useState([])
  const [webinarPlace, setWebinarPlace] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [toast, setToast]             = useState({ msg: "", kind: "info" })
  const [recModal, setRecModal]       = useState({ open: false, reg: null })
  const [sending, setSending]         = useState({})
  const [reactivating, setReactivating] = useState({})

  const showToast = (msg, kind = "info") => {
    setToast({ msg, kind })
    setTimeout(() => setToast({ msg: "", kind: "info" }), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetchData(`webinar-registrants/${slug}`, null, "GET", token)
      setRegistrants(r.registrants || [])
      setWebinarPlace(r.webinar_place || null)
    } catch (e) {
      showToast(e.message, "error")
    } finally {
      setLoading(false)
    }
  }, [slug, token])

  useEffect(() => { load() }, [load])

  const updateLocal = (updated) => {
    setRegistrants(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r))
  }

  const handleSend = async (reg) => {
    setSending(s => ({ ...s, [reg.id]: true }))
    try {
      await fetchData(`webinar-registrants/${reg.id}/send`, {}, "POST", token)
      showToast(`Email sent to ${reg.email}`, "success")
      updateLocal({ ...reg, recording_sent_at: new Date().toISOString() })
    } catch (e) {
      showToast(e.message || "Failed to send", "error")
    } finally {
      setSending(s => ({ ...s, [reg.id]: false }))
    }
  }

  const handleReactivate = async (reg) => {
    setReactivating(s => ({ ...s, [reg.id]: true }))
    try {
      const r = await fetchData(`webinar-registrants/${reg.id}/reactivate`, {}, "POST", token)
      showToast("Reactivated for 48 hours", "success")
      updateLocal({ ...reg, recording_expires_at: r.recording_expires_at })
    } catch (e) {
      showToast(e.message || "Failed", "error")
    } finally {
      setReactivating(s => ({ ...s, [reg.id]: false }))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this registrant?")) return
    try {
      await fetchData(`webinar-registrants/${id}`, null, "DELETE", token)
      setRegistrants(p => p.filter(r => r.id !== id))
      showToast("Deleted", "success")
    } catch (e) {
      showToast(e.message, "error")
    }
  }

  return (
    <div className="p-6 w-full">
      <Toast msg={toast.msg} kind={toast.kind} />
      <RecordingModal
        open={recModal.open}
        reg={recModal.reg}
        onClose={() => setRecModal({ open: false, reg: null })}
        onSaved={(updated) => { updateLocal(updated); showToast("Recording set & link generated", "success") }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={onBack} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-semibold hover:bg-gray-200 transition-colors">Back</button>
        <div>
          <h1 className="text-[17px] font-semibold text-gray-900">Registrants</h1>
          <p className="text-[12px] text-gray-500">{title} · <span className="font-mono text-gray-400">/{slug}</span></p>
        </div>
        <span className="ml-auto text-[12px] text-gray-500">{registrants.length} registrant{registrants.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="text-[13px] text-gray-400 py-20 text-center">Loading…</div>
      ) : !registrants.length ? (
        <div className="text-[13px] text-gray-500 py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
          No registrants yet for this webinar.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Name</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Email</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Phone</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Curriculum</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Grade</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">
                  Registered{(() => { const tz = getTimezoneForPlace(webinarPlace); const abbr = getTzAbbr(tz); return abbr ? ` (${abbr})` : "" })()}
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Recording URL</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Watch Link</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Expires</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrants.map(r => {
                const expired  = isExpired(r.recording_expires_at)
                const hasRec   = !!r.recording_token
                const watchUrl = hasRec ? `${BASE_URL}/watch/${r.recording_token}` : null

                return (
                  <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                      {[r.firstname, r.lastname].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-gray-700">{r.email}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.phone || "—"}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.curriculum || "—"}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.grade || "—"}</td>
                    <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{formatInPlaceTimezone(r.created_at, webinarPlace)}</td>

                    {/* Recording URL */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {r.recording_youtube_url ? (
                          <a href={r.recording_youtube_url} target="_blank" rel="noopener noreferrer"
                             className="text-blue-600 hover:underline truncate max-w-[120px]">
                            YouTube ↗
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                        <button
                          onClick={() => setRecModal({ open: true, reg: r })}
                          className="flex-shrink-0 px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-600"
                        >
                          {r.recording_youtube_url ? "Edit" : "Set"}
                        </button>
                      </div>
                    </td>

                    {/* Watch link */}
                    <td className="px-3 py-2.5">
                      {watchUrl ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { navigator.clipboard.writeText(watchUrl); showToast("Copied!", "success") }}
                            className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-600"
                          >
                            Copy
                          </button>
                          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px]">
                            Preview ↗
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-[11px]">Set URL first</span>
                      )}
                    </td>

                    {/* Expires */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {r.recording_expires_at ? (
                        <span className={expired ? "text-red-500" : "text-green-600"}>
                          {expired ? "Expired" : formatDt(r.recording_expires_at)}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {/* Send link */}
                        {hasRec && !expired && (
                          <button
                            disabled={sending[r.id]}
                            onClick={() => handleSend(r)}
                            className="px-2 py-1 rounded bg-[#0E0E0E] text-white text-[10px] disabled:opacity-50 hover:bg-gray-800"
                            title={r.recording_sent_at ? `Last sent ${formatDt(r.recording_sent_at)}` : "Send recording link"}
                          >
                            {sending[r.id] ? "…" : (r.recording_sent_at ? "Resend" : "Send link")}
                          </button>
                        )}

                        {/* Reactivate */}
                        {hasRec && expired && (
                          <button
                            disabled={reactivating[r.id]}
                            onClick={() => handleReactivate(r)}
                            className="px-2 py-1 rounded bg-amber-600 text-white text-[10px] disabled:opacity-50 hover:bg-amber-700"
                          >
                            {reactivating[r.id] ? "…" : "Reactivate"}
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-2 py-1 rounded bg-gray-100 hover:bg-red-100 hover:text-red-600 text-[10px] text-gray-600"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
