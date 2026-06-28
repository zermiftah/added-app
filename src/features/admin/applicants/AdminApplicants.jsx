import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useApplicationsQuery, useUpdateStatusMutation, useExportExcelMutation } from "./api/applicants-queries"
import { cvUrl } from "./api/applicants-api"
import { useJobsQuery } from "features/admin/jobs/api/jobs-queries"
import { Button, Badge, Spinner, Toast } from "ui"
import { useToast } from "hooks/useToast"

const APP_STATUSES = ["pending", "reviewing", "shortlisted", "rejected", "hired"]
const STATUS_CFG = {
  pending:     { variant: "amber",  label: "Pending" },
  reviewing:   { variant: "blue",   label: "Reviewing" },
  shortlisted: { variant: "violet", label: "Shortlisted" },
  rejected:    { variant: "red",    label: "Rejected" },
  hired:       { variant: "green",  label: "Hired" },
}
const STATUS_ACTIVE_STYLE = {
  pending:     "border-amber-200 text-amber-700 bg-amber-50",
  reviewing:   "border-blue-200 text-blue-700 bg-blue-50",
  shortlisted: "border-violet-200 text-violet-700 bg-violet-50",
  rejected:    "border-red-200 text-red-700 bg-red-50",
  hired:       "border-green-200 text-green-700 bg-green-50",
}

export default function AdminApplicants() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterJob, setFilterJob]       = useState("all")
  const [search, setSearch]             = useState("")
  const [searchDraft, setSearchDraft]   = useState("")
  const [detail, setDetail]             = useState(null)
  const [newStatus, setNewStatus]       = useState("")
  const [newNotes, setNewNotes]         = useState("")
  const { toast, showToast }            = useToast()

  const filter = { status: filterStatus, job_id: filterJob, search }
  const { data: applications = [], isLoading } = useApplicationsQuery(filter)
  const { data: jobs = [] } = useJobsQuery("all")

  const updateStatus = useUpdateStatusMutation({ onSuccess: () => { showToast("Status updated!"); setDetail(d => d ? { ...d, status: newStatus, admin_notes: newNotes } : null) }, onError: msg => showToast(msg, false) })
  const exportExcel  = useExportExcelMutation({ onError: msg => showToast(msg, false) })

  const totalByStatus = (s) => applications.filter(a => a.status === s).length

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-7 py-6 bg-white border-b border-gray-100">
        <div>
          <h2 className="font-fraunces text-2xl font-bold italic text-gray-900">Applicants</h2>
          <p className="text-sm text-gray-400 mt-0.5">Review &amp; manage job applications</p>
        </div>
        <Button variant="outline" size="sm" loading={exportExcel.isPending} onClick={() => exportExcel.mutate(filter)}>⬇ Export Excel</Button>
      </div>

      {/* Stats */}
      <div className="flex bg-white border-b border-gray-100 overflow-x-auto">
        <button onClick={() => setFilterStatus("all")}
          className={`flex flex-col items-center px-6 py-3.5 gap-0.5 border-b-2 transition-all ${filterStatus === "all" ? "border-accent" : "border-transparent hover:bg-gray-50"}`}>
          <span className={`text-lg font-black leading-none ${filterStatus === "all" ? "text-accent" : "text-gray-900"}`}>{applications.length}</span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${filterStatus === "all" ? "text-accent" : "text-gray-400"}`}>Total</span>
        </button>
        {APP_STATUSES.map(s => {
          const cfg = STATUS_CFG[s]; const count = totalByStatus(s)
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`flex flex-col items-center px-5 py-3.5 gap-0.5 border-b-2 transition-all border-r border-gray-100 ${filterStatus === s ? "border-gray-900" : "border-transparent hover:bg-gray-50"}`}>
              <span className={`text-lg font-black leading-none ${filterStatus === s ? "text-gray-900" : "text-gray-700"}`}>{count}</span>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${filterStatus === s ? "text-gray-700" : "text-gray-400"}`}>{cfg.label}</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-7 py-3 bg-white border-b border-gray-100 overflow-x-auto">
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input value={searchDraft} onChange={e => setSearchDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && setSearch(searchDraft)}
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-gray-900 transition-all" placeholder="Search name or email…" />
        </div>
        <select value={filterJob} onChange={e => setFilterJob(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 transition-all appearance-auto min-w-[140px]">
          <option value="all">All Positions</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 transition-all appearance-auto min-w-[120px]">
          <option value="all">All Status</option>
          {APP_STATUSES.map(s => <option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
        </select>
        <Button variant="primary" size="sm" onClick={() => setSearch(searchDraft)}>Search</Button>
      </div>

      {/* Table */}
      <div className="p-7 overflow-x-auto">
        {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        : applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">
            <span className="text-sm">No applications found</span>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Applicant","Position","Experience","Source","Applied","Status","Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => {
                  const sc = STATUS_CFG[app.status] || { variant: "default", label: app.status }
                  return (
                    <motion.tr key={app.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                      <td className="px-4 py-3 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-600 uppercase flex-shrink-0">
                            {app.first_name[0]}{app.last_name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-[13px]">{app.first_name} {app.last_name}</div>
                            <div className="text-[11px] text-gray-400">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-700 max-w-[160px] truncate">{app.job_title}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{app.years_experience ? `${app.years_experience} yrs` : "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{app.source || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{app.created_at?.slice(0, 10) || "—"}</td>
                      <td className="px-4 py-3"><Badge variant={sc.variant}>{sc.label}</Badge></td>
                      <td className="px-4 py-3 pr-5">
                        <Button variant="outline" size="xs" onClick={() => { setDetail(app); setNewStatus(app.status); setNewNotes(app.admin_notes || "") }}>View →</Button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {detail && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setDetail(null)}>
            <motion.div className="absolute top-0 right-0 bottom-0 w-full max-w-[460px] bg-white shadow-2xl flex flex-col border-l border-gray-200"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-start justify-between px-7 py-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div>
                  <div className="font-fraunces text-lg font-bold italic text-gray-900">{detail.first_name} {detail.last_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{detail.job_title}</div>
                </div>
                <button aria-label="Close detail" onClick={() => setDetail(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-all text-sm">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* Contact */}
                <div className="px-7 py-5 border-b border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-3">Contact</p>
                  {[
                    { k: "Email", v: detail.email, href: `mailto:${detail.email}` },
                    { k: "Phone", v: detail.phone },
                    ...(detail.linkedin ? [{ k: "LinkedIn", v: detail.linkedin, href: detail.linkedin }] : []),
                    ...(detail.portfolio ? [{ k: "Portfolio", v: detail.portfolio, href: detail.portfolio }] : []),
                  ].map(({ k, v, href }) => (
                    <div key={k} className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-400 flex-shrink-0">{k}</span>
                      {href ? <a href={href} target="_blank" className="text-xs font-medium text-blue-600 hover:underline text-right break-all">{v}</a>
                        : <span className="text-xs font-medium text-gray-900 text-right">{v}</span>}
                    </div>
                  ))}
                </div>
                {/* Application */}
                <div className="px-7 py-5 border-b border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-3">Application</p>
                  {[
                    { k: "Experience", v: detail.years_experience ? `${detail.years_experience} years` : "—" },
                    { k: "Source", v: detail.source || "—" },
                    { k: "Applied", v: detail.created_at?.slice(0, 10) || "—" },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-400">{k}</span>
                      <span className="text-xs font-medium text-gray-900">{v}</span>
                    </div>
                  ))}
                  <div className="mt-3">
                    <a href={cvUrl(detail.cv_path)} target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all">
                      📄 Download CV / Resume
                    </a>
                  </div>
                </div>
                {detail.cover_letter && (
                  <div className="px-7 py-5 border-b border-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-3">Cover Letter</p>
                    <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-[3px] border-gray-200 whitespace-pre-wrap">{detail.cover_letter}</div>
                  </div>
                )}
                {/* Update status */}
                <div className="px-7 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-3">Update Status</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {APP_STATUSES.map(s => (
                      <button key={s} onClick={() => setNewStatus(s)}
                        className={`py-2 text-xs font-semibold border rounded-lg transition-all text-center ${newStatus === s ? STATUS_ACTIVE_STYLE[s] : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700"}`}>
                        {STATUS_CFG[s].label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5 mb-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin Notes</label>
                    <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all resize-y min-h-[80px]"
                      placeholder="Internal notes…" />
                  </div>
                  <Button variant="primary" size="md" className="w-full" loading={updateStatus.isPending}
                    onClick={() => updateStatus.mutate({ id: detail.id, data: { status: newStatus, notes: newNotes } })}>
                    Save Status & Notes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast toast={toast} />
    </div>
  )
}
