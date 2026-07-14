import { useState, useEffect, useCallback, Fragment } from "react"
import { useAdminStore } from "stores/adminStore"
import { fetchData } from "lib/api"

const ARCHETYPE_LABELS = {
  builder: "Builder", researcher: "Researcher", creator: "Creator",
  changemaker: "Changemaker", founder: "Founder", specialist: "Specialist",
}
const ARCHETYPE_COLORS = {
  builder: "bg-amber-50 text-amber-700 border-amber-200",
  researcher: "bg-blue-50 text-blue-700 border-blue-200",
  creator: "bg-pink-50 text-pink-700 border-pink-200",
  changemaker: "bg-emerald-50 text-emerald-700 border-emerald-200",
  founder: "bg-violet-50 text-violet-700 border-violet-200",
  specialist: "bg-orange-50 text-orange-700 border-orange-200",
}
const STAGE_COLORS = {
  Strong: "bg-emerald-50 text-emerald-700",
  Developing: "bg-amber-50 text-amber-700",
  Emerging: "bg-gray-100 text-gray-600",
}

function fmtDate(dt) {
  if (!dt) return "—"
  const iso = String(dt).trim().replace(" ", "T")
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z")
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC"
}

export default function AdminDiagnosticResults() {
  const token = useAdminStore(s => s.token)
  const [results, setResults] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [archetypeFilter, setArchetypeFilter] = useState("")
  const [expanded, setExpanded] = useState(null)
  const [toast, setToast] = useState("")

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = archetypeFilter ? `?archetype=${archetypeFilter}` : ""
      const [r, s] = await Promise.all([
        fetchData(`diagnostic-test${q}`, null, "GET", token),
        fetchData("diagnostic-test/stats", null, "GET", token),
      ])
      setResults(r.results || [])
      setStats(s)
    } catch (e) {
      showToast(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [token, archetypeFilter])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm("Delete this result?")) return
    try {
      await fetchData(`diagnostic-test/${id}`, null, "DELETE", token)
      setResults(prev => prev.filter(r => r.id !== id))
      showToast("Deleted")
    } catch (e) {
      showToast(e.message || "Failed to delete")
    }
  }

  return (
    <div className="flex flex-col flex-1">
      {toast && (
        <div className="fixed top-4 right-4 z-[100] text-white text-[12px] px-4 py-2.5 rounded-lg shadow-xl bg-gray-900">{toast}</div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-7 py-6 bg-white border-b border-gray-100">
        <div>
          <h2 className="font-fraunces text-2xl font-bold italic text-gray-900">Diagnostic Test Results</h2>
          <p className="text-sm text-gray-400 mt-0.5">Every completed "Applicant File" quiz from /diagnostic-test</p>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="flex flex-wrap items-center gap-3 px-7 py-4 bg-white border-b border-gray-100">
          <div className="flex flex-col items-center px-4 py-2">
            <span className="text-lg font-black leading-none text-gray-900">{stats.total}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">Total</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          {stats.byArchetype.map(a => (
            <button
              key={a.archetype}
              onClick={() => setArchetypeFilter(f => f === a.archetype ? "" : a.archetype)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${archetypeFilter === a.archetype ? ARCHETYPE_COLORS[a.archetype] : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`}
            >
              {ARCHETYPE_LABELS[a.archetype] || a.archetype} · {a.n}
            </button>
          ))}
          {archetypeFilter && (
            <button onClick={() => setArchetypeFilter("")} className="text-[11px] text-gray-400 hover:text-gray-700 underline">Clear filter</button>
          )}
        </div>
      )}

      <div className="p-6">
        {loading ? (
          <div className="text-[13px] text-gray-400 py-20 text-center">Loading…</div>
        ) : !results.length ? (
          <div className="text-[13px] text-gray-500 py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
            No diagnostic test results yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Date</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Primary</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Secondary</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Grade</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Foundation</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap">Destination</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap"></th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-600 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <Fragment key={r.id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/60">
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${ARCHETYPE_COLORS[r.primary_archetype] || ""}`}>
                          {ARCHETYPE_LABELS[r.primary_archetype] || r.primary_archetype}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {r.is_hybrid && r.secondary_archetype ? (
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${ARCHETYPE_COLORS[r.secondary_archetype] || ""}`}>
                            {ARCHETYPE_LABELS[r.secondary_archetype] || r.secondary_archetype}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{r.foundation_grade || "—"}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STAGE_COLORS[r.foundation_stage] || "bg-gray-100 text-gray-500"}`}>
                          {r.foundation_stage || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{r.foundation_destination || "—"}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-[11px] text-gray-500 hover:text-gray-900 underline">
                          {expanded === r.id ? "Hide scores" : "View scores"}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <button onClick={() => handleDelete(r.id)} className="text-[11px] text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                    {expanded === r.id && (
                      <tr className="bg-gray-50/60 border-b border-gray-100">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-3">
                            {Object.entries(r.spike_scores || {}).map(([key, val]) => (
                              <div key={key} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{ARCHETYPE_LABELS[key] || key}</p>
                                <p className="text-[16px] font-bold text-gray-900">{val}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11.5px] text-gray-500">
                            Grades: <span className="text-gray-800">{r.foundation_grades || "—"}</span> ·
                            {" "}Testing: <span className="text-gray-800">{r.foundation_testing || "—"}</span> ·
                            {" "}Foundation score: <span className="text-gray-800">{r.foundation_score ?? "—"}</span>
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
