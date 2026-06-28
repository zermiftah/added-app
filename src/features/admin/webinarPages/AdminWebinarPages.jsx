import { useState, useEffect, useRef, useCallback } from "react"
import { useAdminStore } from "stores/adminStore"
import * as api from "./api/webinarPages-api"
import {
  CURRICULUM_VALUES_EN, GRADE_OPTIONS,
} from "../../user/webinarLanding/sharedData"
import { API_BASE_URL } from "lib/api"
import MediaPicker from "../shared/MediaPicker"

const THEMES = [
  { value: "hero-form-side",   label: "Hero with side form",      hint: "Form sits next to the headline in the hero (Singapore style)" },
  { value: "hero-cta-stacked", label: "Hero with stacked CTA",    hint: "Big hero with button, form section below (UK style)" },
  { value: "editorial-split",  label: "Editorial split",          hint: "Magazine-style asymmetric layout with sidebar meta" },
]

const photoUrl = (photo) => {
  if (!photo) return null
  if (photo.startsWith("http")) return photo
  if (photo.startsWith("/addedapi/")) return `${API_BASE_URL.replace(/\/$/, "").replace(/\/addedapi$/, "")}${photo}`
  return photo
}

// ============================================================
// Bits
// ============================================================
function Toast({ msg, kind = "info" }) {
  if (!msg) return null
  const bg = kind === "error" ? "#7F1D1D" : kind === "success" ? "#065F46" : "#111827"
  return (
    <div className="fixed top-4 right-4 z-[100] text-white text-[12px] px-4 py-2.5 rounded-lg shadow-xl" style={{ background: bg }}>
      {msg}
    </div>
  )
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[90] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl p-5 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <h4 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-[13px] text-gray-600 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px]">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[12px]">Delete</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">{label}</label>}
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  )
}

const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none"

// ============================================================
// Rich-content section editor (paragraph | list)
// ============================================================
function ContentEditor({ value, onChange, label }) {
  const v = value || { title: "", subtitle: "", type: "paragraph", body: "" }

  const setF = (k, val) => onChange({ ...v, [k]: val })

  // Toggle paragraph <-> list with sensible default body
  const setType = (type) => {
    onChange({
      ...v,
      type,
      body: type === "list" ? (Array.isArray(v.body) ? v.body : [{ title: "", description: "" }]) : (typeof v.body === "string" ? v.body : ""),
    })
  }

  const addItem    = () => setF("body", [...(v.body || []), { title: "", description: "" }])
  const removeItem = (i) => setF("body", v.body.filter((_, idx) => idx !== i))
  const updateItem = (i, field, val) => setF("body", v.body.map((it, idx) => idx === i ? { ...it, [field]: val } : it))

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-[12px] font-semibold text-gray-700 mb-3">{label}</p>

      <Field label="Section title">
        <input value={v.title || ""} onChange={e => setF("title", e.target.value)} className={inputCls} placeholder="e.g. Why you need this" />
      </Field>

      <Field label="Subtitle">
        <input value={v.subtitle || ""} onChange={e => setF("subtitle", e.target.value)} className={inputCls} placeholder="Short intro line under the title" />
      </Field>

      <Field label="Content type">
        <div className="flex gap-2">
          {["paragraph", "list"].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg text-[12px] capitalize ${v.type === t ? "bg-[#0E0E0E] text-white" : "bg-white border border-gray-200 text-gray-700"}`}
            >{t}</button>
          ))}
        </div>
      </Field>

      {v.type === "paragraph" && (
        <Field label="Body" hint="A single paragraph or two.">
          <textarea
            rows={5}
            value={typeof v.body === "string" ? v.body : ""}
            onChange={e => setF("body", e.target.value)}
            className={`${inputCls} resize-y`}
            placeholder="Write the section description here…"
          />
        </Field>
      )}

      {v.type === "list" && (
        <div>
          <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-2">Items</p>
          <div className="space-y-3">
            {(Array.isArray(v.body) ? v.body : []).map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-mono text-gray-400">#{String(i + 1).padStart(2, "0")}</span>
                  <button type="button" onClick={() => removeItem(i)} className="text-[10px] text-red-600 hover:underline">Remove</button>
                </div>
                <input
                  value={item.title || ""}
                  onChange={e => updateItem(i, "title", e.target.value)}
                  placeholder="Item title"
                  className={`${inputCls} mb-2`}
                />
                <textarea
                  rows={2}
                  value={item.description || ""}
                  onChange={e => updateItem(i, "description", e.target.value)}
                  placeholder="Item description"
                  className={`${inputCls} resize-y`}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-3 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-[12px] text-gray-600 hover:border-gray-900 hover:text-gray-900">
            + Add item
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Speakers editor
// ============================================================
function SpeakersEditor({ speakers, onChange, photoFiles, setPhotoFile }) {
  const add = () => onChange([...(speakers || []), { name: "", title: "", position: "", description: "", linkedin: "", photo: null }])
  const remove = (i) => {
    onChange(speakers.filter((_, idx) => idx !== i))
    setPhotoFile(i, null)
  }
  const update = (i, field, val) => onChange(speakers.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

  return (
    <div>
      <div className="space-y-4">
        {(speakers || []).map((s, i) => {
          const file    = photoFiles[i]
          const preview = file ? URL.createObjectURL(file) : photoUrl(s.photo)
          return (
            <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {preview
                    ? <img src={preview} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[28px]">👤</div>
                  }
                </div>
                <div className="flex-1">
                  <label className="inline-block px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-900 rounded-lg text-[12px] text-gray-700 cursor-pointer">
                    {preview ? "Replace photo" : "Upload photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(i, e.target.files?.[0] || null)} />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Optional. Auto-optimized + responsive variants generated.</p>
                </div>
                <button type="button" onClick={() => remove(i)} className="text-[10px] text-red-600 hover:underline flex-shrink-0">Remove speaker</button>
              </div>
              <Field label="Name">
                <input value={s.name || ""} onChange={e => update(i, "name", e.target.value)} className={inputCls} placeholder="e.g. Akshay Maliwal" />
              </Field>
              <Field label="Title / role tag" hint="Short label (e.g. Founder, Lead Counselor)">
                <input value={s.title || ""} onChange={e => update(i, "title", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Position" hint="Full position (shown below name)">
                <input value={s.position || ""} onChange={e => update(i, "position", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={s.description || ""} onChange={e => update(i, "description", e.target.value)} className={`${inputCls} resize-y`} />
              </Field>
              <Field label="LinkedIn URL">
                <input value={s.linkedin || ""} onChange={e => update(i, "linkedin", e.target.value)} placeholder="https://linkedin.com/in/…" className={inputCls} />
              </Field>
            </div>
          )
        })}
      </div>
      <button type="button" onClick={add} className="mt-3 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-[12px] text-gray-600 hover:border-gray-900 hover:text-gray-900">
        + Add speaker
      </button>
    </div>
  )
}

// ============================================================
// Universities editor — tag input
// ============================================================
function UniversityTags({ value, onChange }) {
  const [draft, setDraft] = useState("")
  const arr = Array.isArray(value) ? value : []

  const add = () => {
    const v = draft.trim()
    if (!v || arr.includes(v)) { setDraft(""); return }
    onChange([...arr, v])
    setDraft("")
  }
  const remove = (i) => onChange(arr.filter((_, idx) => idx !== i))

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder="e.g. Stanford"
          className={inputCls}
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px]">+ Add</button>
      </div>
      {arr.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {arr.map((u, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[12px] text-gray-700">
              {u}
              <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-600 text-[14px] leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Reject rules multi-checkbox
// ============================================================
function RejectRulesEditor({ value, onChange }) {
  const v = value || { curriculum: [], grade: [] }
  const toggle = (key, val) => {
    const list = Array.isArray(v[key]) ? v[key] : []
    const next = list.includes(val) ? list.filter(x => x !== val) : [...list, val]
    onChange({ ...v, [key]: next })
  }
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-[12px] text-gray-600 mb-3">Submissions matching ANY of these values will see a polite rejection message and skip HubSpot.</p>

      <Field label="Reject these curricula">
        <div className="flex flex-wrap gap-2">
          {CURRICULUM_VALUES_EN.map(c => (
            <label key={c} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] cursor-pointer border ${v.curriculum?.includes(c) ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-200 text-gray-700"}`}>
              <input type="checkbox" checked={v.curriculum?.includes(c) || false} onChange={() => toggle("curriculum", c)} className="hidden" />
              {c}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Reject these grades">
        <div className="flex flex-wrap gap-2">
          {GRADE_OPTIONS.map(g => (
            <label key={g.value} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] cursor-pointer border ${v.grade?.includes(g.value) ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-200 text-gray-700"}`}>
              <input type="checkbox" checked={v.grade?.includes(g.value) || false} onChange={() => toggle("grade", g.value)} className="hidden" />
              {g.label}
            </label>
          ))}
        </div>
      </Field>
    </div>
  )
}

// ============================================================
// MAIN PAGE — list + editor split
// ============================================================
export default function AdminWebinarPages() {
  const token = useAdminStore(s => s.token)
  const [view, setView]     = useState({ mode: "list", id: null })
  const [pages, setPages]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [toast, setToast]   = useState({ msg: "", kind: "info" })
  const [confirm, setConfirm] = useState({ open: false, payload: null })

  const showToast = (msg, kind = "info") => {
    setToast({ msg, kind })
    setTimeout(() => setToast({ msg: "", kind: "info" }), 2800)
  }

  const refreshList = useCallback(async () => {
    setLoading(true)
    try {
      const r = await api.listPages(token, search)
      setPages(r.pages || [])
    } catch (e) {
      showToast("Failed to load: " + e.message, "error")
    } finally {
      setLoading(false)
    }
  }, [token, search])

  useEffect(() => { refreshList() }, [refreshList])

  const handleDelete = async () => {
    try {
      await api.deletePage(confirm.payload.id, token)
      showToast("Deleted", "success")
      setConfirm({ open: false, payload: null })
      refreshList()
    } catch (e) {
      showToast(e.message, "error")
    }
  }

  if (view.mode === "edit") {
    return <PageEditor
      pageId={view.id}
      token={token}
      onBack={() => { setView({ mode: "list", id: null }); refreshList() }}
      onSaved={(msg) => showToast(msg, "success")}
      onError={(msg) => showToast(msg, "error")}
    />
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <Toast msg={toast.msg} kind={toast.kind} />
      <ConfirmDialog
        open={confirm.open}
        title="Delete landing page?"
        message={`"${confirm.payload?.webinar_title || confirm.payload?.slug}" will be permanently deleted. This cannot be undone.`}
        onCancel={() => setConfirm({ open: false, payload: null })}
        onConfirm={handleDelete}
      />

      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Webinar Landing Pages</h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Build & manage standalone webinar registration pages.</p>
        </div>
        <button
          onClick={() => setView({ mode: "edit", id: null })}
          className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px]"
        >
          + New Landing Page
        </button>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by slug or title…"
          className={`${inputCls} max-w-md`}
        />
      </div>

      {loading ? (
        <div className="text-[13px] text-gray-400 py-20 text-center">Loading…</div>
      ) : !pages.length ? (
        <div className="text-[13px] text-gray-500 py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
          <p className="mb-3">No landing pages yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Slug</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Theme</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Updated</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-900">{p.webinar_title}</td>
                  <td className="px-4 py-2.5">
                    <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono text-[12px]">/{p.slug} ↗</a>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 text-[12px]">{p.theme}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-[12px]">{new Date(p.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => setView({ mode: "edit", id: p.id })} className="text-blue-600 hover:underline text-[12px] mr-3">Edit</button>
                    <button onClick={() => setConfirm({ open: true, payload: p })} className="text-red-600 hover:underline text-[12px]">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================
// EDITOR
// ============================================================
function PageEditor({ pageId, token, onBack, onSaved, onError }) {
  const isNew = !pageId
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving]   = useState(false)
  const [form, setForm] = useState({
    slug: "", theme: "hero-form-side",
    webinar_title: "", webinar_subtitle: "",
    webinar_date: "", webinar_time: "", webinar_place: "", grade_years: "",
    hero_image: "",
    why_data:   { title: "", subtitle: "", type: "paragraph", body: "" },
    learn_data: { title: "", subtitle: "", type: "list",      body: [{ title: "", description: "" }] },
    speakers:   [],
    about_data: { description: "", universities: [] },
    hubspot_portal_id: "4257853",
    hubspot_form_id:   "",
    hubspot_region:    "na1",
    reject_rules: { curriculum: [], grade: [] },
    status: "published",
  })
  const [photoFiles, setPhotoFiles] = useState({}) // { 0: File, 1: File }
  const [heroPickerOpen, setHeroPickerOpen] = useState(false)
  const [slugStatus, setSlugStatus] = useState({ checking: false, available: null, reason: null })
  const slugCheckTimer = useRef(null)

  // Load existing page
  useEffect(() => {
    if (isNew) return
    let cancelled = false
    api.getPage(pageId, token)
      .then(r => {
        if (cancelled) return
        const p = r.page
        setForm({
          slug: p.slug,
          theme: p.theme,
          webinar_title: p.webinar_title || "",
          webinar_subtitle: p.webinar_subtitle || "",
          webinar_date: p.webinar_date || "",
          webinar_time: p.webinar_time || "",
          webinar_place: p.webinar_place || "",
          grade_years: p.grade_years || "",
          hero_image: p.hero_image || "",
          why_data:   p.why_data   || { title: "", subtitle: "", type: "paragraph", body: "" },
          learn_data: p.learn_data || { title: "", subtitle: "", type: "list",      body: [] },
          speakers:   Array.isArray(p.speakers) ? p.speakers : [],
          about_data: p.about_data || { description: "", universities: [] },
          hubspot_portal_id: p.hubspot_portal_id || "4257853",
          hubspot_form_id:   p.hubspot_form_id   || "",
          hubspot_region:    p.hubspot_region    || "na1",
          reject_rules: p.reject_rules || { curriculum: [], grade: [] },
          status: p.status || "published",
        })
      })
      .catch(e => onError("Load failed: " + e.message))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [pageId, isNew, token, onError])

  // Debounced slug check
  useEffect(() => {
    if (!form.slug) { setSlugStatus({ checking: false, available: null, reason: null }); return }
    clearTimeout(slugCheckTimer.current)
    setSlugStatus({ checking: true, available: null, reason: null })
    slugCheckTimer.current = setTimeout(async () => {
      try {
        const r = await api.checkSlug(form.slug, isNew ? null : pageId)
        setSlugStatus({ checking: false, available: r.available, reason: r.reason })
      } catch {
        setSlugStatus({ checking: false, available: null, reason: "error" })
      }
    }, 350)
    return () => clearTimeout(slugCheckTimer.current)
  }, [form.slug, isNew, pageId])

  const slugMsg = (() => {
    if (!form.slug) return null
    if (slugStatus.checking) return { type: "info", text: "Checking…" }
    if (slugStatus.available === true) return { type: "ok", text: `✓ /${form.slug} is available` }
    if (slugStatus.reason === "invalid_format") return { type: "err", text: "Only lowercase letters, numbers, and hyphens (e.g. uk-nus)" }
    if (slugStatus.reason === "reserved") return { type: "err", text: "This slug is reserved by another route" }
    if (slugStatus.reason === "taken") return { type: "err", text: "This slug is already in use — please choose a different one" }
    if (slugStatus.reason === "error") return { type: "err", text: "Could not verify slug" }
    return null
  })()

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setPhotoFile = (idx, file) => setPhotoFiles(prev => ({ ...prev, [idx]: file }))

  const canSave = form.slug && form.webinar_title && form.hubspot_form_id && slugStatus.available !== false && !slugStatus.checking

  const save = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("slug", form.slug.toLowerCase().trim())
      fd.append("theme", form.theme)
      fd.append("webinar_title", form.webinar_title)
      fd.append("webinar_subtitle", form.webinar_subtitle || "")
      fd.append("webinar_date", form.webinar_date || "")
      fd.append("webinar_time", form.webinar_time || "")
      fd.append("webinar_place", form.webinar_place || "")
      fd.append("grade_years", form.grade_years || "")
      fd.append("hero_image", form.hero_image || "")
      fd.append("why_data",   JSON.stringify(form.why_data))
      fd.append("learn_data", JSON.stringify(form.learn_data))
      fd.append("about_data", JSON.stringify(form.about_data))
      fd.append("reject_rules", JSON.stringify(form.reject_rules))
      fd.append("hubspot_portal_id", form.hubspot_portal_id)
      fd.append("hubspot_form_id",   form.hubspot_form_id)
      fd.append("hubspot_region",    form.hubspot_region)
      fd.append("status", form.status)

      // Speakers: send array as JSON; photos sent as `speaker_photo_N`
      // Strip photo field from JSON when there's a new file (server overrides)
      const speakersForBody = form.speakers.map((s, i) => {
        const out = { ...s }
        if (photoFiles[i]) out.photo = null
        return out
      })
      fd.append("speakers", JSON.stringify(speakersForBody))
      Object.entries(photoFiles).forEach(([i, file]) => {
        if (file) fd.append(`speaker_photo_${i}`, file)
      })

      if (isNew) {
        const r = await api.createPage(fd, token)
        onSaved(`Created → /${r.slug}`)
      } else {
        const r = await api.updatePage(pageId, fd, token)
        onSaved(`Updated → /${r.slug}`)
      }
      onBack()
    } catch (e) {
      onError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-[13px] text-gray-400">Loading editor…</div>
  }

  return (
    <div className="p-6 max-w-[920px] mx-auto">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <button onClick={onBack} className="text-[12px] text-gray-500 hover:text-gray-900 mb-1">← Back to list</button>
          <h1 className="text-[18px] font-semibold text-gray-900">{isNew ? "New Landing Page" : "Edit Landing Page"}</h1>
        </div>
        <div className="flex gap-2">
          <select
            value={form.status}
            onChange={e => setF("status", e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-[12px]"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={save}
            disabled={!canSave || saving}
            className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] disabled:opacity-50"
          >
            {saving ? "Saving…" : (isNew ? "Create page" : "Save changes")}
          </button>
        </div>
      </div>

      {/* SLUG + THEME */}
      <Section title="URL + theme">
        <Field
          label="Slug"
          error={slugMsg?.type === "err" ? slugMsg.text : null}
          hint={slugMsg?.type === "ok" ? slugMsg.text : (slugMsg?.type === "info" ? slugMsg.text : "Lowercase letters, numbers, hyphens only. e.g. uk-nus → https://zmiftah.tech/uk-nus")}
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-400 font-mono">/</span>
            <input
              value={form.slug}
              onChange={e => setF("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className={inputCls}
              placeholder="uk-nus"
            />
          </div>
        </Field>

        <Field label="Theme">
          <div className="space-y-2">
            {THEMES.map(t => (
              <label key={t.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${form.theme === t.value ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                <input type="radio" name="theme" checked={form.theme === t.value} onChange={() => setF("theme", t.value)} className="mt-0.5" />
                <div>
                  <p className="text-[13px] font-medium text-gray-900">{t.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t.hint}</p>
                </div>
              </label>
            ))}
          </div>
        </Field>
      </Section>

      {/* TOPIC */}
      <Section title="1 — Webinar topic">
        <Field label="Title *">
          <input value={form.webinar_title} onChange={e => setF("webinar_title", e.target.value)} className={inputCls} placeholder="Your Path to NUS & NTU…" />
        </Field>
        <Field label="Subtitle">
          <textarea rows={2} value={form.webinar_subtitle} onChange={e => setF("webinar_subtitle", e.target.value)} className={`${inputCls} resize-y`} placeholder="Short intro under the title" />
        </Field>
      </Section>

      {/* SCHEDULE */}
      <Section title="2 — Schedule">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date"><input value={form.webinar_date} onChange={e => setF("webinar_date", e.target.value)} className={inputCls} placeholder="Saturday, July 12" /></Field>
          <Field label="Time"><input value={form.webinar_time} onChange={e => setF("webinar_time", e.target.value)} className={inputCls} placeholder="6:00 PM SGT" /></Field>
          <Field label="Place"><input value={form.webinar_place} onChange={e => setF("webinar_place", e.target.value)} className={inputCls} placeholder="Online via Zoom" /></Field>
          <Field label="For (grade years)"><input value={form.grade_years} onChange={e => setF("grade_years", e.target.value)} className={inputCls} placeholder="Grade 9–12 students & parents" /></Field>
        </div>

        <Field label="Hero image" hint="Used in the hero section. Picks _sm.webp automatically on mobile.">
          <div className="flex items-start gap-3">
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              {form.hero_image
                ? <img src={photoUrl(form.hero_image)} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[22px]">🖼</div>
              }
            </div>
            <div className="flex flex-col gap-1.5">
              <button type="button" onClick={() => setHeroPickerOpen(true)} className="px-3 py-1.5 rounded-lg bg-[#0E0E0E] text-white text-[12px] self-start">
                {form.hero_image ? "Change image" : "Select from Media Library"}
              </button>
              {form.hero_image && (
                <button type="button" onClick={() => setF("hero_image", "")} className="text-[11px] text-gray-500 hover:text-red-600 self-start">
                  Remove
                </button>
              )}
            </div>
          </div>
        </Field>

        <MediaPicker
          open={heroPickerOpen}
          onClose={() => setHeroPickerOpen(false)}
          onPick={(url) => setF("hero_image", url)}
        />
      </Section>

      {/* WHY */}
      <Section title="3 — Why you need this">
        <ContentEditor value={form.why_data} onChange={v => setF("why_data", v)} label="Why-section content" />
      </Section>

      {/* LEARN */}
      <Section title="4 — What you'll learn">
        <ContentEditor value={form.learn_data} onChange={v => setF("learn_data", v)} label="Learn-section content" />
      </Section>

      {/* SPEAKERS */}
      <Section title="5 — Speakers / Hosts">
        <SpeakersEditor
          speakers={form.speakers}
          onChange={v => setF("speakers", v)}
          photoFiles={photoFiles}
          setPhotoFile={setPhotoFile}
        />
      </Section>

      {/* ABOUT */}
      <Section title="6 — About AddedEducation">
        <Field label="Description">
          <textarea rows={3} value={form.about_data.description || ""} onChange={e => setF("about_data", { ...form.about_data, description: e.target.value })} className={`${inputCls} resize-y`} />
        </Field>
        <Field label="Universities" hint="Click + or press Enter to add">
          <UniversityTags value={form.about_data.universities} onChange={v => setF("about_data", { ...form.about_data, universities: v })} />
        </Field>
      </Section>

      {/* HUBSPOT */}
      <Section title="7 — HubSpot integration">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Portal ID"><input value={form.hubspot_portal_id} onChange={e => setF("hubspot_portal_id", e.target.value)} className={inputCls} /></Field>
          <Field label="Form ID *"><input value={form.hubspot_form_id} onChange={e => setF("hubspot_form_id", e.target.value)} className={inputCls} placeholder="abc12345-..." /></Field>
          <Field label="Region"><input value={form.hubspot_region} onChange={e => setF("hubspot_region", e.target.value)} className={inputCls} placeholder="na1" /></Field>
        </div>
      </Section>

      {/* REJECT */}
      <Section title="8 — Rejection rules">
        <RejectRulesEditor value={form.reject_rules} onChange={v => setF("reject_rules", v)} />
      </Section>

      <div className="pt-4 flex justify-end gap-2">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border border-gray-200 text-[12px]">Cancel</button>
        <button onClick={save} disabled={!canSave || saving} className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] disabled:opacity-50">
          {saving ? "Saving…" : (isNew ? "Create page" : "Save changes")}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-[13px] font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}
