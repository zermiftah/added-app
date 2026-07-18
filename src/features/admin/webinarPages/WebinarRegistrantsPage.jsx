import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchData } from "lib/api"
import { formatInPlaceTimezone } from "lib/countryTimezones"

const BASE_URL = "https://addededucation.com"

function isExpired(dt) {
  if (!dt) return true
  const iso = String(dt).trim().replace(" ", "T")
  const date = new Date(iso.endsWith("Z") ? iso : iso + "Z")
  return date < new Date()
}
function isNeverExpires(dt) {
  if (!dt) return false
  return new Date(dt.replace?.(" ", "T") || dt).getFullYear() >= 2099
}
function fmtDate(dt) {
  if (!dt) return "-"
  const iso = String(dt).trim().replace(" ", "T")
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z")
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}
function fmtPageDate(dt) {
  if (!dt) return ""
  return new Date(dt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

// No login on this page by design (sales team access) — every call below
// hits an intentionally public endpoint, not an admin-gated one. The
// pages filter uses a minimal public endpoint (slug/title/date only), not
// the full admin page list, so nothing sensitive (HubSpot IDs, custom
// code, etc.) leaks here.
export default function WebinarRegistrantsPage() {
  const [pages, setPages] = useState([])
  const [slugFilter, setSlugFilter] = useState("")
  const [registrants, setRegistrants] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState({})
  const [bulkSending, setBulkSending] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [toast, setToast] = useState({ msg: "", kind: "info" })

  const showToast = (msg, kind = "info") => {
    setToast({ msg, kind })
    setTimeout(() => setToast({ msg: "", kind: "info" }), 3000)
  }

  const loadPages = useCallback(async () => {
    try {
      const r = await fetchData("webinar-pages/public/for-registrants-filter", null, "GET")
      setPages(r.pages || [])
    } catch {
      // non-fatal — filter dropdown just stays empty
    }
  }, [])

  const loadRegistrants = useCallback(async () => {
    setLoading(true)
    try {
      const q = slugFilter ? `?slug=${encodeURIComponent(slugFilter)}` : ""
      const r = await fetchData(`webinar-registrants${q}`, null, "GET")
      setRegistrants(r.registrants || [])
      setSelected(new Set())
    } catch (e) {
      showToast(e.message || "Failed to load registrants", "error")
    } finally {
      setLoading(false)
    }
  }, [slugFilter])

  useEffect(() => { loadPages() }, [loadPages])
  useEffect(() => { loadRegistrants() }, [loadRegistrants])

  const handleSend = async (reg) => {
    setSending(s => ({ ...s, [reg.id]: true }))
    try {
      const r = await fetchData(`webinar-registrants/${reg.id}/send`, {}, "POST")
      showToast(r.message || `Link sent to ${reg.email}`, "success")
      setRegistrants(prev => prev.map(x => x.id === reg.id ? { ...x, recording_sent_at: new Date().toISOString() } : x))
    } catch (e) {
      showToast(e.message || "Failed to send", "error")
    } finally {
      setSending(s => ({ ...s, [reg.id]: false }))
    }
  }

  const copyLink = (token_) => {
    navigator.clipboard?.writeText(`${BASE_URL}/watch/${token_}`)
    showToast("Link copied", "success")
  }

  const copyBulkLink = (bulkToken) => {
    navigator.clipboard?.writeText(`${BASE_URL}/watch/${bulkToken}`)
    showToast("Bulk link copied", "success")
  }

  // The bulk (page-wide) link only makes sense when one specific landing
  // page is selected — it's a property of the page, not of "all pages".
  const selectedPage = slugFilter ? pages.find(p => p.slug === slugFilter) : null

  // ── Checkbox selection ──
  const selectableIds = useMemo(
    () => registrants.filter(r => r.recording_token && !isExpired(r.recording_expires_at)).map(r => r.id),
    [registrants]
  )
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => selected.has(id))
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(selectableIds))
  const toggleOne = (id) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const selectedRegistrants = registrants.filter(r => selected.has(r.id))

  const copySelectedLinks = () => {
    const lines = selectedRegistrants
      .filter(r => r.recording_token)
      .map(r => {
        const name = [r.firstname, r.lastname].filter(Boolean).join(" ") || r.email
        return `${name} - ${BASE_URL}/watch/${r.recording_token}`
      })
    if (!lines.length) { showToast("Nothing to copy", "error"); return }
    navigator.clipboard?.writeText(lines.join("\n"))
    showToast(`Copied ${lines.length} link(s)`, "success")
  }

  const sendSelected = async () => {
    if (!selected.size) return
    setBulkSending(true)
    try {
      const r = await fetchData("webinar-registrants/bulk-send", { ids: Array.from(selected) }, "POST")
      showToast(r.message || "Sending…", "success")
      const now = new Date().toISOString()
      setRegistrants(prev => prev.map(x => selected.has(x.id) ? { ...x, recording_sent_at: now } : x))
      setSelected(new Set())
    } catch (e) {
      showToast(e.message || "Failed to send", "error")
    } finally {
      setBulkSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.msg && (
        <div className={`fixed top-4 right-4 z-[100] text-white text-[12px] px-4 py-2.5 rounded-lg shadow-xl ${toast.kind === "error" ? "bg-red-600" : "bg-gray-900"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-10 py-6">
        <div className="w-full">
          <h1 className="font-fraunces text-2xl font-bold italic text-gray-900">Webinar Registrants</h1>
          <p className="text-sm text-gray-400 mt-1">All registrants across every landing page — send each person their watch link.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-10 py-4">
        <div className="w-full flex items-center gap-3 flex-wrap">
          <label className="text-[12px] font-semibold text-gray-600">Landing page:</label>
          <select
            value={slugFilter}
            onChange={e => setSlugFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none min-w-[280px]"
          >
            <option value="">All landing pages ({registrants.length} shown)</option>
            {pages.map(p => (
              <option key={p.slug} value={p.slug}>
                {p.slug}{p.date_start ? ` — ${fmtPageDate(p.date_start)}` : ""}
              </option>
            ))}
          </select>
          {slugFilter && (
            <button onClick={() => setSlugFilter("")} className="text-[12px] text-gray-400 hover:text-gray-700 underline">Clear</button>
          )}
          <span className="ml-auto text-[12px] text-gray-500">{registrants.length} registrant{registrants.length !== 1 ? "s" : ""}</span>
        </div>

        {selectedPage && (
          <div className="w-full mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-500">Bulk watch link (shared by everyone on this page):</span>
            {selectedPage.bulk_recording_token ? (
              <>
                <code className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 truncate max-w-[300px]">
                  {BASE_URL}/watch/{selectedPage.bulk_recording_token}
                </code>
                <button onClick={() => copyBulkLink(selectedPage.bulk_recording_token)} className="px-2.5 py-1 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-700 hover:border-gray-400">
                  Copy
                </button>
              </>
            ) : (
              <span className="text-[11px] text-gray-400">Not set yet — set it from Added Admin → Finally Leads.</span>
            )}
          </div>
        )}
      </div>

      {/* Bulk action bar — only appears once something is checked */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-40 bg-gray-900 text-white px-6 md:px-10 py-3 flex items-center gap-3 flex-wrap shadow-lg">
          <span className="text-[12.5px] font-semibold">{selected.size} selected</span>
          <button onClick={copySelectedLinks} className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[12px] font-semibold transition-colors">
            📋 Copy {selected.size} link{selected.size !== 1 ? "s" : ""}
          </button>
          <button
            onClick={sendSelected}
            disabled={bulkSending}
            className="px-3.5 py-1.5 rounded-full bg-[#C8354B] hover:bg-[#9E2538] text-[12px] font-semibold transition-colors disabled:opacity-50"
          >
            {bulkSending ? "Sending…" : `✉️ Send Link to ${selected.size}`}
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-[12px] text-white/60 hover:text-white underline">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="w-full p-6">
        {loading ? (
          <div className="text-[13px] text-gray-400 py-20 text-center">Loading…</div>
        ) : !registrants.length ? (
          <div className="text-[13px] text-gray-500 py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
            No registrants found.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2.5 whitespace-nowrap">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 accent-[#0E0E0E] cursor-pointer" title="Select all with an active link" />
                  </th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Landing Page</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Name</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Email</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Phone</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">School</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Curriculum</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Grade</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Registered</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Watch Link</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Expires</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {registrants.map(r => {
                  const hasRec  = !!r.recording_token
                  const expired = hasRec && isExpired(r.recording_expires_at)
                  const never   = hasRec && isNeverExpires(r.recording_expires_at)
                  const canSelect = hasRec && !expired

                  return (
                    <tr key={r.id} className={`border-t border-gray-100 hover:bg-gray-50 ${selected.has(r.id) ? "bg-gray-50" : ""}`}>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          disabled={!canSelect}
                          onChange={() => toggleOne(r.id)}
                          className="w-4 h-4 accent-[#0E0E0E] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={!hasRec ? "No watch link set" : expired ? "Expired" : "Select"}
                        />
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{r.webinar_slug}</div>
                        {r.webinar_title && <div className="text-[10.5px] text-gray-400 truncate max-w-[180px]">{r.webinar_title}</div>}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                        {[r.firstname, r.lastname].filter(Boolean).join(" ") || "-"}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700">{r.email}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.phone || "-"}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.school || "-"}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.curriculum || "-"}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.grade || "-"}</td>
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                        {formatInPlaceTimezone(r.created_at, r.webinar_place)}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {hasRec ? (
                          <button onClick={() => copyLink(r.recording_token)} className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-600">
                            Copy link
                          </button>
                        ) : <span className="text-gray-300">Not set</span>}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {!hasRec ? <span className="text-gray-300">-</span>
                          : expired ? <span className="text-red-500 font-semibold">Expired</span>
                          : never ? <span className="text-green-600 font-semibold">Never expires</span>
                          : <span className="text-green-600">{fmtDate(r.recording_expires_at)}</span>}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <button
                          disabled={!hasRec || expired || sending[r.id]}
                          onClick={() => handleSend(r)}
                          title={!hasRec ? "No watch link set yet" : expired ? "Link expired — ask admin to reactivate" : "Send watch link by email"}
                          className="px-2.5 py-1 rounded bg-[#C8354B] text-white text-[10.5px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#9E2538]"
                        >
                          {sending[r.id] ? "Sending…" : r.recording_sent_at ? "Resend" : "Send Link"}
                        </button>
                        {r.recording_sent_at && (
                          <p className="text-[9.5px] text-gray-400 mt-1 whitespace-nowrap">Sent {fmtDate(r.recording_sent_at)}</p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
