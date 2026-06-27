import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  useAuthorsQuery, useAuthorDetailQuery,
  useSaveAuthorMutation, useDeleteAuthorMutation, useRemovePhotoMutation,
} from "./api/authors-queries"
import { thumbUrl } from "./api/authors-api"
import { Button, Badge, Modal, Spinner, Toast, RichEditor } from "ui"
import { useToast } from "hooks/useToast"

function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function AdminAuthors() {
  const [modal, setModal]               = useState(null)
  const [editingAuthor, setEditingAuthor] = useState(null)
  const [form, setForm]                 = useState({ name: "", title: "" })
  const [photoFile, setPhotoFile]       = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [detailId, setDetailId]         = useState(null)
  const [showDetail, setShowDetail]     = useState(false)
  const { toast, showToast }            = useToast()
  const photoRef  = useRef(null)
  const descRef   = useRef(null)
  const eduRef    = useRef(null)
  const awardsRef = useRef(null)

  const { data: authors = [], isLoading } = useAuthorsQuery()
  const { data: detailData }              = useAuthorDetailQuery(detailId)

  const saveAuthor   = useSaveAuthorMutation({ onSuccess: () => { showToast(modal === "edit" ? "Author updated!" : "Author created!"); closeModal() }, onError: msg => showToast(msg, false) })
  const deleteAuthor = useDeleteAuthorMutation({ onSuccess: () => { showToast("Author deleted"); setDeleteConfirm(null) }, onError: msg => showToast(msg, false) })
  const removePhoto  = useRemovePhotoMutation({ onSuccess: () => { setPhotoPreview(null); showToast("Photo removed") }, onError: msg => showToast(msg, false) })

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function openCreate() {
    setForm({ name: "", title: "" }); setEditingAuthor(null)
    setPhotoFile(null); setPhotoPreview(null); setModal("create")
    setTimeout(() => { descRef.current && (descRef.current.innerHTML = ""); eduRef.current && (eduRef.current.innerHTML = ""); awardsRef.current && (awardsRef.current.innerHTML = "") }, 50)
  }

  function openEdit(author) {
    setForm({ name: author.name, title: author.title || "" })
    setEditingAuthor(author); setPhotoFile(null); setPhotoPreview(author.photo ? thumbUrl(author.photo) : null); setModal("edit")
    setTimeout(() => { descRef.current && (descRef.current.innerHTML = author.description || ""); eduRef.current && (eduRef.current.innerHTML = author.education || ""); awardsRef.current && (awardsRef.current.innerHTML = author.awards || "") }, 50)
  }

  function openDetail(author) { setDetailId(author.id); setShowDetail(true) }

  function closeModal() { setModal(null); setEditingAuthor(null); setPhotoFile(null); setPhotoPreview(null) }

  function handlePhoto(f) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) { showToast("JPG/PNG/WebP only", false); return }
    setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f))
  }

  function handleSave() {
    if (!form.name.trim()) { showToast("Name required", false); return }
    const fd = new FormData()
    fd.append("name", form.name); fd.append("title", form.title)
    fd.append("description", descRef.current?.innerHTML || "")
    fd.append("education", eduRef.current?.innerHTML || "")
    fd.append("awards", awardsRef.current?.innerHTML || "")
    if (photoFile) fd.append("photo", photoFile)
    saveAuthor.mutate({ fd, id: editingAuthor?.id })
  }

  const detailAuthor   = detailData?.author || null
  const detailArticles = detailData?.articles || []
  const editArticles   = detailData?.articles || []

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-start justify-between gap-4 px-7 py-6 bg-white border-b border-gray-100">
        <div>
          <h2 className="font-fraunces text-2xl font-bold italic text-gray-900">Resource Authors</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage blog author profiles</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ New Author</Button>
      </div>

      <div className="flex items-center px-7 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 py-3.5 border-b-2 border-gray-900">
          <span className="text-[13px] font-medium text-gray-900">All Authors</span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-gray-900 text-white">{authors.length}</span>
        </div>
      </div>

      <div className="p-7">
        {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        : authors.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">
            <span className="text-4xl opacity-40">✍️</span>
            <span className="text-sm">No authors yet</span>
            <Button variant="outline" size="sm" onClick={openCreate}>Add first →</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {authors.map(a => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-3 p-5 pb-4">
                  {a.photo ? <img src={thumbUrl(a.photo)} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" />
                    : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">{(a.name || "A")[0]}</div>}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{a.name}</div>
                    {a.title && <div className="text-[11px] text-gray-400 truncate mt-0.5">{a.title}</div>}
                  </div>
                </div>
                <div className="flex mx-5 mb-4 border border-gray-100 rounded-lg overflow-hidden">
                  <div className="flex-1 py-2.5 text-center bg-gray-50">
                    <div className="text-sm font-black text-gray-900">{a.article_count}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Articles</div>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="flex-1 py-2.5 text-center bg-gray-50">
                    <div className="text-[11px] font-bold text-gray-700">{fmtDate(a.created_at).split(",")[0]}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Joined</div>
                  </div>
                </div>
                <div className="flex gap-1.5 px-5 pb-4">
                  <Button variant="outline" size="xs" className="flex-1" onClick={() => openDetail(a)}>View</Button>
                  <Button variant="outline" size="xs" className="flex-1" onClick={() => openEdit(a)}>Edit</Button>
                  <Button variant="outline-danger" size="xs" className="flex-1" onClick={() => setDeleteConfirm(a)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal === "edit" ? "Edit Author" : "New Author"} size="lg"
        footer={<>
          <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" size="sm" loading={saveAuthor.isPending} onClick={handleSave}>
            {modal === "edit" ? "Update Author" : "Create Author"}
          </Button>
        </>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Photo</label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="" className="w-20 h-20 rounded-full object-cover border-[3px] border-gray-100" />
                  <button onClick={() => editingAuthor ? removePhoto.mutate(editingAuthor.id) : (setPhotoFile(null), setPhotoPreview(null))}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-all">✕</button>
                </div>
              ) : (
                <div onClick={() => photoRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer text-2xl text-gray-300 hover:border-gray-400 transition-all">📷</div>
              )}
              <p className="text-xs text-gray-400 leading-relaxed">Click to upload<br />JPG, PNG, WebP · Max 5MB</p>
            </div>
            <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { if (e.target.files?.[0]) handlePhoto(e.target.files[0]); e.target.value = "" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Name *</label>
              <input value={form.name} onChange={e => setF("name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all" placeholder="Author full name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Title / Jabatan</label>
              <input value={form.title} onChange={e => setF("title", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all" placeholder="e.g. Senior Counselor" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description / Bio</label>
            <RichEditor editorRef={descRef} placeholder="Write a short bio…" size="mini" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Education</label>
            <RichEditor editorRef={eduRef} placeholder="Education background…" size="mini" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Awards &amp; Achievements</label>
            <RichEditor editorRef={awardsRef} placeholder="Awards, certifications…" size="mini" />
          </div>
          {modal === "edit" && editArticles.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Articles by {editingAuthor?.name} ({editArticles.length})</label>
              {editArticles.map(ar => (
                <div key={ar.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{ar.title}</div>
                    <div className="text-[11px] text-gray-400">{ar.topic_name} · {fmtDate(ar.created_at)}</div>
                  </div>
                  <Badge variant={ar.status === "published" ? "green" : "amber"}>{ar.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal open={showDetail && !!detailAuthor} onClose={() => { setShowDetail(false); setDetailId(null) }} title="Author Profile" size="lg"
        footer={<>
          <Button variant="outline" size="sm" onClick={() => { setShowDetail(false); setDetailId(null) }}>Close</Button>
          <Button variant="primary" size="sm" onClick={() => { setShowDetail(false); if (detailAuthor) openEdit(detailAuthor) }}>Edit Author</Button>
        </>}
      >
        {detailAuthor && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
              {detailAuthor.photo ? <img src={thumbUrl(detailAuthor.photo)} alt="" className="w-16 h-16 rounded-full object-cover border-[3px] border-gray-100 flex-shrink-0" />
                : <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">{(detailAuthor.name || "A")[0]}</div>}
              <div>
                <div className="font-fraunces text-xl font-bold text-gray-900">{detailAuthor.name}</div>
                {detailAuthor.title && <div className="text-sm text-gray-500 mt-1">{detailAuthor.title}</div>}
              </div>
            </div>
            {detailAuthor.description && <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Bio</p><div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100" dangerouslySetInnerHTML={{ __html: detailAuthor.description }} /></div>}
            {detailAuthor.education && <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Education</p><div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100" dangerouslySetInnerHTML={{ __html: detailAuthor.education }} /></div>}
            {detailAuthor.awards && <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Awards</p><div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100" dangerouslySetInnerHTML={{ __html: detailAuthor.awards }} /></div>}
            {detailArticles.length > 0 && (
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Articles ({detailArticles.length})</p>
                <div className="flex flex-col gap-2">
                  {detailArticles.map(ar => (
                    <div key={ar.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{ar.title}</div>
                        <div className="text-[11px] text-gray-400">{ar.topic_name} · {fmtDate(ar.created_at)}</div>
                      </div>
                      <Badge variant={ar.status === "published" ? "green" : "amber"}>{ar.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Author?" size="sm"
        footer={<>
          <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" size="sm" loading={deleteAuthor.isPending} onClick={() => deleteAuthor.mutate(deleteConfirm.id)}>Delete</Button>
        </>}
      >
        <p className="text-sm text-gray-500 leading-relaxed">
          Delete <strong className="text-gray-900">"{deleteConfirm?.name}"</strong>?
          {deleteConfirm?.article_count > 0 && <><br /><span className="text-red-600 font-semibold">This author has {deleteConfirm.article_count} article(s). Reassign them first.</span></>}
        </p>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
