import { useState, useMemo } from "react"
import {
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useReorderCategories,
  useMembers, useCreateMember, useUpdateMember, useDeleteMember, useReorderMembers,
} from "./api/team-queries"
import { API_BASE_URL } from "lib/api"

// ============================================================
// Small reusable bits
// ============================================================
function Toast({ msg }) {
  if (!msg) return null
  return (
    <div className="fixed top-4 right-4 z-[100] bg-gray-900 text-white text-[12px] px-4 py-2.5 rounded-lg shadow-xl">
      {msg}
    </div>
  )
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[90] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
        <h4 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-[13px] text-gray-600 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[12px] hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  )
}

// Resolve asset URL the same way other admin modules do
const photoUrl = (photo) => {
  if (!photo) return null
  if (photo.startsWith("http")) return photo
  if (photo.startsWith("/addedapi/")) return `${API_BASE_URL.replace(/\/$/, "").replace(/\/addedapi$/, "")}${photo}`
  return photo
}

// ============================================================
// Category Modal — create / edit
// ============================================================
function CategoryModal({ open, initial, onClose, onSave, saving }) {
  const [name, setName]               = useState("")
  const [description, setDescription] = useState("")

  // sync when opening / initial changes
  useMemo(() => {
    if (open) {
      setName(initial?.name || "")
      setDescription(initial?.description || "")
    }
  }, [open, initial])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-gray-900">{initial ? "Edit Category" : "New Category"}</h3>
          <button aria-label="Close" onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-[12px]">✕</button>
        </div>

        <label className="block mb-3">
          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Name *</span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Management"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Description</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="The founders and directors who oversee every aspect of how AddedEducation"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none resize-none"
          />
        </label>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">Cancel</button>
          <button
            disabled={saving || !name.trim()}
            onClick={() => onSave({ name: name.trim(), description: description.trim() })}
            className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] disabled:opacity-50 hover:bg-gray-800"
          >
            {saving ? "Saving…" : initial ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Member Modal — create / edit
// ============================================================
function MemberModal({ open, initial, categoryId, categories, onClose, onSave, saving }) {
  const [name, setName]               = useState("")
  const [position, setPosition]       = useState("")
  const [description, setDescription] = useState("")
  const [catId, setCatId]             = useState(categoryId || "")
  const [photoFile, setPhotoFile]     = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  useMemo(() => {
    if (open) {
      setName(initial?.name || "")
      setPosition(initial?.position || "")
      setDescription(initial?.description || "")
      setCatId(initial?.category_id || categoryId || "")
      setPhotoFile(null)
      setPhotoPreview(initial?.photo ? photoUrl(initial.photo) : null)
    }
  }, [open, initial, categoryId])

  if (!open) return null

  const handlePhoto = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setPhotoFile(f)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = () => {
    const fd = new FormData()
    fd.append("category_id", catId)
    fd.append("name", name.trim())
    fd.append("position", position.trim())
    fd.append("description", description.trim())
    if (photoFile) fd.append("photo", photoFile)
    onSave(fd)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl my-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-gray-900">{initial ? "Edit Member" : "New Member"}</h3>
          <button aria-label="Close" onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-[12px]">✕</button>
        </div>

        {/* Photo */}
        <div className="mb-4">
          <span className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-2">Photo</span>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {photoPreview
                ? <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[24px]">👤</div>
              }
            </div>
            <div className="flex-1">
              <label className="inline-block px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[12px] text-gray-700 cursor-pointer">
                {photoPreview ? "Replace photo" : "Upload photo"}
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
              {photoPreview && (
                <button
                  onClick={() => { setPhotoFile(null); setPhotoPreview(initial?.photo ? photoUrl(initial.photo) : null) }}
                  className="ml-2 text-[11px] text-gray-500 hover:text-gray-700"
                >Reset</button>
              )}
              <p className="text-[10px] text-gray-400 mt-1">JPG/PNG/WebP — auto-optimized server-side</p>
            </div>
          </div>
        </div>

        {/* Category */}
        <label className="block mb-3">
          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Category *</span>
          <select
            value={catId}
            onChange={e => setCatId(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none"
          >
            <option value="">— Select category —</option>
            {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label className="block mb-3">
          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Name *</span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Akshay Maliwal"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none"
          />
        </label>

        <label className="block mb-3">
          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Position</span>
          <input
            value={position}
            onChange={e => setPosition(e.target.value)}
            placeholder="e.g. Founder & CEO"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Description</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional bio / extra info"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:border-gray-900 focus:outline-none resize-none"
          />
        </label>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">Cancel</button>
          <button
            disabled={saving || !name.trim() || !catId}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] disabled:opacity-50 hover:bg-gray-800"
          >
            {saving ? "Saving…" : initial ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Drag-reorder hook (HTML5 native DnD)
// ============================================================
function useReorder(items, onReorder) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  const onDragStart = (i) => (e) => { setDragIdx(i); e.dataTransfer.effectAllowed = "move" }
  const onDragOver  = (i) => (e) => { e.preventDefault(); setOverIdx(i) }
  const onDragEnd   = () => { setDragIdx(null); setOverIdx(null) }
  const onDrop      = (i) => (e) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { onDragEnd(); return }
    const newItems = [...items]
    const [moved] = newItems.splice(dragIdx, 1)
    newItems.splice(i, 0, moved)
    onReorder(newItems.map(x => x.id))
    onDragEnd()
  }

  return { dragIdx, overIdx, onDragStart, onDragOver, onDragEnd, onDrop }
}

// ============================================================
// Category card — header + member grid
// ============================================================
function CategoryCard({ category, onEdit, onDelete, onAddMember, onEditMember, onDeleteMember, dragHandlers, index, isDragging }) {
  const { data: members = [], isLoading } = useMembers(category.id)
  const reorderMembers = useReorderMembers()

  const memberDrag = useReorder(members, (ids) => reorderMembers.mutate(ids))

  return (
    <div
      draggable
      onDragStart={dragHandlers.onDragStart(index)}
      onDragOver={dragHandlers.onDragOver(index)}
      onDragEnd={dragHandlers.onDragEnd}
      onDrop={dragHandlers.onDrop(index)}
      className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${isDragging ? "opacity-40" : ""} ${dragHandlers.overIdx === index ? "ring-2 ring-blue-500" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="cursor-grab text-gray-400 hover:text-gray-700 text-[14px] select-none" title="Drag to reorder">⋮⋮</span>
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-gray-900 truncate">{category.name}</h3>
            {category.description && <p className="text-[11px] text-gray-500 truncate">{category.description}</p>}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onAddMember(category.id)} className="px-2.5 py-1 rounded-md bg-[#0E0E0E] text-white text-[11px] hover:bg-gray-800">+ Member</button>
          <button onClick={() => onEdit(category)} aria-label="Edit category" className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-[11px]">✎</button>
          <button onClick={() => onDelete(category)} aria-label="Delete category" className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-600 text-[11px]">🗑</button>
        </div>
      </div>

      {/* Members grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-[12px] text-gray-400 py-4 text-center">Loading members…</div>
        ) : !members.length ? (
          <div className="text-[12px] text-gray-400 py-6 text-center border border-dashed border-gray-200 rounded-lg">No members yet</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {members.map((m, i) => (
              <div
                key={m.id}
                draggable
                onDragStart={memberDrag.onDragStart(i)}
                onDragOver={memberDrag.onDragOver(i)}
                onDragEnd={memberDrag.onDragEnd}
                onDrop={memberDrag.onDrop(i)}
                className={`group relative bg-gray-50 rounded-lg overflow-hidden transition-all cursor-grab ${memberDrag.dragIdx === i ? "opacity-40" : ""} ${memberDrag.overIdx === i ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  {m.photo
                    ? <img src={photoUrl(m.photo)} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[32px]">👤</div>
                  }
                </div>
                <div className="p-2">
                  <p className="text-[12px] font-semibold text-gray-900 truncate">{m.name}</p>
                  {m.position && <p className="text-[10px] text-gray-500 truncate">{m.position}</p>}
                </div>
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditMember(m)} aria-label="Edit" className="w-6 h-6 flex items-center justify-center rounded-md bg-white/90 hover:bg-white text-[10px] shadow-sm">✎</button>
                  <button onClick={() => onDeleteMember(m)} aria-label="Delete" className="w-6 h-6 flex items-center justify-center rounded-md bg-white/90 hover:bg-red-100 hover:text-red-600 text-[10px] shadow-sm">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function AdminTeam() {
  const { data: categories = [], isLoading } = useCategories()
  const createCat   = useCreateCategory()
  const updateCat   = useUpdateCategory()
  const deleteCat   = useDeleteCategory()
  const reorderCats = useReorderCategories()
  const createMem   = useCreateMember()
  const updateMem   = useUpdateMember()
  const deleteMem   = useDeleteMember()

  const [catModal,   setCatModal]   = useState({ open: false, initial: null })
  const [memModal,   setMemModal]   = useState({ open: false, initial: null, categoryId: null })
  const [confirm,    setConfirm]    = useState({ open: false, type: null, payload: null })
  const [toast,      setToast]      = useState("")

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  const catDrag = useReorder(categories, (ids) => {
    reorderCats.mutate(ids, { onSuccess: () => showToast("Order updated") })
  })

  // ── Handlers ──
  const handleSaveCategory = async (data) => {
    try {
      if (catModal.initial) {
        await updateCat.mutateAsync({ id: catModal.initial.id, data })
        showToast("Category updated")
      } else {
        await createCat.mutateAsync(data)
        showToast("Category created")
      }
      setCatModal({ open: false, initial: null })
    } catch (e) {
      showToast("Error: " + (e.message || "Save failed"))
    }
  }

  const handleSaveMember = async (fd) => {
    try {
      if (memModal.initial) {
        await updateMem.mutateAsync({ id: memModal.initial.id, fd })
        showToast("Member updated")
      } else {
        await createMem.mutateAsync(fd)
        showToast("Member created")
      }
      setMemModal({ open: false, initial: null, categoryId: null })
    } catch (e) {
      showToast("Error: " + (e.message || "Save failed"))
    }
  }

  const handleConfirmDelete = async () => {
    try {
      if (confirm.type === "category") {
        await deleteCat.mutateAsync(confirm.payload.id)
        showToast("Category deleted")
      } else if (confirm.type === "member") {
        await deleteMem.mutateAsync(confirm.payload.id)
        showToast("Member deleted")
      }
    } catch (e) {
      showToast("Error: " + (e.message || "Delete failed"))
    } finally {
      setConfirm({ open: false, type: null, payload: null })
    }
  }

  const saving = createCat.isPending || updateCat.isPending || createMem.isPending || updateMem.isPending

  return (
    <div className="p-6 w-full">
      <Toast msg={toast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Team</h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Manage categories and members shown on the public team page. Drag to reorder.</p>
        </div>
        <button
          onClick={() => setCatModal({ open: true, initial: null })}
          className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] hover:bg-gray-800"
        >
          + Category
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-[13px] text-gray-400 py-20 text-center">Loading…</div>
      ) : !categories.length ? (
        <div className="text-[13px] text-gray-500 py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
          <p className="mb-3">No categories yet</p>
          <button
            onClick={() => setCatModal({ open: true, initial: null })}
            className="px-4 py-2 rounded-lg bg-[#0E0E0E] text-white text-[12px] hover:bg-gray-800"
          >
            Create first category
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((c, i) => (
            <CategoryCard
              key={c.id}
              category={c}
              index={i}
              isDragging={catDrag.dragIdx === i}
              dragHandlers={catDrag}
              onEdit={(cat) => setCatModal({ open: true, initial: cat })}
              onDelete={(cat) => setConfirm({ open: true, type: "category", payload: cat })}
              onAddMember={(catId) => setMemModal({ open: true, initial: null, categoryId: catId })}
              onEditMember={(mem) => setMemModal({ open: true, initial: mem, categoryId: mem.category_id })}
              onDeleteMember={(mem) => setConfirm({ open: true, type: "member", payload: mem })}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CategoryModal
        open={catModal.open}
        initial={catModal.initial}
        saving={saving}
        onClose={() => setCatModal({ open: false, initial: null })}
        onSave={handleSaveCategory}
      />
      <MemberModal
        open={memModal.open}
        initial={memModal.initial}
        categoryId={memModal.categoryId}
        categories={categories}
        saving={saving}
        onClose={() => setMemModal({ open: false, initial: null, categoryId: null })}
        onSave={handleSaveMember}
      />
      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === "category" ? "Delete category?" : "Delete member?"}
        message={
          confirm.type === "category"
            ? `"${confirm.payload?.name}" and all its members will be deleted. This cannot be undone.`
            : `"${confirm.payload?.name}" will be deleted. This cannot be undone.`
        }
        onCancel={() => setConfirm({ open: false, type: null, payload: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
