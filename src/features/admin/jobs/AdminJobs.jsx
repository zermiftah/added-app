import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  useJobsQuery, useDepartmentsQuery, useSaveJobMutation,
  useDeleteJobMutation, useRemoveThumbnailMutation,
  useAddDepartmentMutation, useDeleteDepartmentMutation,
} from "./api/jobs-queries"
import { thumbUrl } from "./api/jobs-api"
import { Button, Input, Select, Modal, Badge, Spinner, Toast, RichEditor } from "ui"
import { useToast } from "hooks/useToast"

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"]
const JOB_STATUSES = ["active", "draft", "closed"]

const STATUS_VARIANT = { active: "green", draft: "amber", closed: "red" }
const EMPTY_FORM = { title: "", department: "", location: "Jakarta", type: "Full-time", deadline: "", status: "active" }

export default function AdminJobs() {
  const [filterStatus, setFilterStatus]   = useState("all")
  const [modal, setModal]                 = useState(null) // "create"|"edit"
  const [editingJob, setEditingJob]       = useState(null)
  const [form, setForm]                   = useState({ ...EMPTY_FORM })
  const [thumbFile, setThumbFile]         = useState(null)
  const [thumbPreview, setThumbPreview]   = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showDeptPanel, setShowDeptPanel] = useState(false)
  const [newDeptName, setNewDeptName]     = useState("")
  const { toast, showToast }              = useToast()
  const thumbRef  = useRef(null)
  const descRef   = useRef(null)
  const reqRef    = useRef(null)

  const { data: jobs = [], isLoading }    = useJobsQuery(filterStatus)
  const { data: depts = [] }              = useDepartmentsQuery()

  const saveJob      = useSaveJobMutation({ onSuccess: () => { showToast(modal === "edit" ? "Job updated!" : "Job created!"); closeModal() }, onError: showToast.bind(null) })
  const deleteJob    = useDeleteJobMutation({ onSuccess: () => { showToast("Vacancy closed"); setDeleteConfirm(null) }, onError: msg => showToast(msg, false) })
  const removeThumb  = useRemoveThumbnailMutation({ onSuccess: () => { setThumbPreview(null); showToast("Thumbnail removed") }, onError: msg => showToast(msg, false) })
  const addDept      = useAddDepartmentMutation({ onSuccess: () => { showToast("Department added"); setNewDeptName("") }, onError: msg => showToast(msg, false) })
  const deleteDept   = useDeleteDepartmentMutation({ onSuccess: () => showToast("Department deleted"), onError: msg => showToast(msg, false) })

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function openCreate() {
    setForm({ ...EMPTY_FORM, department: depts[0]?.name || "" })
    setEditingJob(null); setThumbFile(null); setThumbPreview(null); setModal("create")
    setTimeout(() => { descRef.current && (descRef.current.innerHTML = ""); reqRef.current && (reqRef.current.innerHTML = "") }, 50)
  }

  function openEdit(job) {
    setForm({ title: job.title, department: job.department, location: job.location, type: job.type, deadline: job.deadline?.slice(0, 10) || "", status: job.status })
    setEditingJob(job); setThumbFile(null); setThumbPreview(job.thumbnail ? thumbUrl(job.thumbnail) : null); setModal("edit")
    setTimeout(() => { descRef.current && (descRef.current.innerHTML = job.description || ""); reqRef.current && (reqRef.current.innerHTML = job.requirements || "") }, 50)
  }

  function closeModal() { setModal(null); setEditingJob(null); setThumbFile(null); setThumbPreview(null) }

  function handleThumb(f) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) { showToast("JPG/PNG/WebP only", false); return }
    if (f.size > 5 * 1024 * 1024) { showToast("Max 5MB", false); return }
    setThumbFile(f); setThumbPreview(URL.createObjectURL(f))
  }

  function handleSave() {
    if (!form.title.trim() || !form.department || !form.type) { showToast("Title, department & type required", false); return }
    const fd = new FormData()
    Object.entries({ ...form, description: descRef.current?.innerHTML || "", requirements: reqRef.current?.innerHTML || "" }).forEach(([k, v]) => fd.append(k, v))
    if (thumbFile) fd.append("thumbnail", thumbFile)
    saveJob.mutate({ fd, id: editingJob?.id })
  }

  const allJobs = jobs // already filtered by query
  const counts = JOB_STATUSES.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s).length }), {})

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-7 py-6 bg-white border-b border-gray-100">
        <div>
          <h2 className="font-fraunces text-2xl font-bold italic text-gray-900">Job Vacancies</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage open positions &amp; departments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowDeptPanel(true)}>⊞ Departments</Button>
          <Button variant="primary" size="sm" onClick={openCreate}>+ New Vacancy</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-7 bg-white border-b border-gray-100 overflow-x-auto">
        {["all", ...JOB_STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all ${filterStatus === s ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filterStatus === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
              {s === "all" ? jobs.length : (counts[s] || 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="p-7 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : allJobs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">
            <span className="text-4xl opacity-40">📋</span>
            <span className="text-sm">No vacancies found</span>
            <Button variant="outline" size="sm" onClick={openCreate}>Create one →</Button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Position","Department","Type","Location","Deadline","Status","Created",""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job, i) => (
                  <motion.tr key={job.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                    <td className="px-4 py-3 pl-5 font-semibold text-gray-900">{job.title}</td>
                    <td className="px-4 py-3"><Badge variant="default">{job.department}</Badge></td>
                    <td className="px-4 py-3"><Badge variant="red">{job.type}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{job.location || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{job.deadline ? job.deadline.slice(0, 10) : "—"}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[job.status]} dot>{job.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{job.created_at?.slice(0, 10) || "—"}</td>
                    <td className="px-4 py-3 pr-5">
                      <div className="flex gap-1.5 justify-end">
                        <Button variant="outline" size="xs" onClick={() => openEdit(job)}>Edit</Button>
                        <Button variant="outline-danger" size="xs" onClick={() => setDeleteConfirm(job)}>Close</Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE/EDIT MODAL ── */}
      <Modal open={!!modal} onClose={closeModal} title={modal === "edit" ? "Edit Vacancy" : "New Vacancy"}
        subtitle={modal === "edit" ? `Editing: ${editingJob?.title}` : "Fill in the job details below"}
        size="lg"
        footer={<>
          <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" size="sm" loading={saveJob.isPending} onClick={handleSave}>
            {modal === "edit" ? "Save Changes" : "Create Vacancy"}
          </Button>
        </>}
      >
        <div className="flex flex-col gap-5">
          {/* Thumbnail */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 pb-3 mb-4 border-b border-gray-100">Thumbnail</p>
            {thumbPreview ? (
              <div className="flex gap-4 items-start">
                <img src={thumbPreview} className="w-44 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0" alt="" />
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="xs" onClick={() => thumbRef.current?.click()}>Change</Button>
                  <Button variant="outline-danger" size="xs" loading={removeThumb.isPending} onClick={() => editingJob ? removeThumb.mutate(editingJob.id) : (setThumbFile(null), setThumbPreview(null))}>Remove</Button>
                </div>
              </div>
            ) : (
              <div onClick={() => thumbRef.current?.click()}
                className="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:border-gray-400 transition-all text-center">
                <span className="text-2xl">↑</span>
                <span className="text-sm text-gray-600"><strong>Click to upload</strong> thumbnail</span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP · max 5MB</span>
              </div>
            )}
            <input ref={thumbRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => e.target.files?.[0] && handleThumb(e.target.files[0])} />
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Job Title" required className="col-span-2" value={form.title} onChange={e => setF("title", e.target.value)} placeholder="e.g. Senior University Counselor" />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Department *</label>
              <div className="flex gap-2">
                <select value={form.department} onChange={e => setF("department", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 transition-all appearance-auto">
                  {depts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
                <button onClick={() => setShowDeptPanel(true)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all text-lg flex-shrink-0">+</button>
              </div>
            </div>
            <Select label="Employment Type" required value={form.type} onChange={e => setF("type", e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input label="Location" value={form.location} onChange={e => setF("location", e.target.value)} placeholder="e.g. Jakarta" />
            <Input label="Deadline" type="date" value={form.deadline} onChange={e => setF("deadline", e.target.value)} />
            <Select label="Status" value={form.status} onChange={e => setF("status", e.target.value)}>
              {JOB_STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Job Description</label>
              <RichEditor editorRef={descRef} placeholder="Describe the role and responsibilities…" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Requirements</label>
              <RichEditor editorRef={reqRef} placeholder="Add requirements…" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Close Vacancy" size="sm"
        footer={<>
          <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" size="sm" loading={deleteJob.isPending} onClick={() => deleteJob.mutate(deleteConfirm.id)}>Close Vacancy</Button>
        </>}
      >
        <p className="text-sm text-gray-500 leading-relaxed">Close <strong className="text-gray-900">"{deleteConfirm?.title}"</strong>? This cannot be undone.</p>
      </Modal>

      {/* Dept panel */}
      <Modal open={showDeptPanel} onClose={() => setShowDeptPanel(false)} title="Departments" subtitle="Add or remove departments" size="sm"
        footer={<Button variant="primary" size="sm" onClick={() => setShowDeptPanel(false)}>Done</Button>}
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input inputClassName="h-10" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} onKeyDown={e => e.key === "Enter" && addDept.mutate(newDeptName)} placeholder="New department name…" className="flex-1" />
            <Button variant="primary" size="sm" loading={addDept.isPending} onClick={() => addDept.mutate(newDeptName)}>Add</Button>
          </div>
          <div className="flex flex-col gap-2">
            {depts.map(d => (
              <div key={d.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{d.name}</span>
                  <Badge variant={d.is_default ? "default" : "green"}>{d.is_default ? "Default" : "Custom"}</Badge>
                </div>
                {!d.is_default && <Button variant="outline-danger" size="xs" onClick={() => deleteDept.mutate(d.id)}>Delete</Button>}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
