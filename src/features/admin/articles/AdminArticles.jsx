import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  useArticlesQuery, useTopicsQuery, useAuthorsSelectQuery,
  useSaveArticleMutation, useDeleteArticleMutation,
  useAddTopicMutation, useDeleteTopicMutation,
} from "./api/articles-queries"
import { thumbUrl } from "./api/articles-api"
import { Button, Badge, Modal, Spinner, Toast, RichEditor } from "ui"
import { useToast } from "hooks/useToast"

const ART_STATUSES = ["published", "draft"]
const STATUS_VARIANT = { published: "green", draft: "amber" }
const EMPTY_FORM = { title: "", topic_id: "", author_id: "", status: "draft" }

function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function AdminArticles() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery]   = useState("")
  const [searchDraft, setSearchDraft]   = useState("")
  const [modal, setModal]               = useState(null)
  const [editingArticle, setEditingArticle] = useState(null)
  const [form, setForm]                 = useState({ ...EMPTY_FORM })
  const [thumbFile, setThumbFile]       = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showTopicPanel, setShowTopicPanel] = useState(false)
  const [newTopicName, setNewTopicName] = useState("")
  const [htmlMode, setHtmlMode]         = useState(false)
  const [htmlCode, setHtmlCode]         = useState("")
  const { toast, showToast }            = useToast()
  const thumbRef   = useRef(null)
  const contentRef = useRef(null)

  const { data: articles = [], isLoading } = useArticlesQuery(filterStatus, searchQuery)
  const { data: topics = [] }              = useTopicsQuery()
  const { data: authors = [] }             = useAuthorsSelectQuery()

  const saveArticle  = useSaveArticleMutation({ onSuccess: () => { showToast(modal === "edit" ? "Article updated!" : "Article created!"); closeModal() }, onError: msg => showToast(msg, false) })
  const deleteArticle = useDeleteArticleMutation({ onSuccess: () => { showToast("Article deleted"); setDeleteConfirm(null) }, onError: msg => showToast(msg, false) })
  const addTopic     = useAddTopicMutation({ onSuccess: () => { showToast("Topic added"); setNewTopicName("") }, onError: msg => showToast(msg, false) })
  const deleteTopic  = useDeleteTopicMutation({ onSuccess: () => showToast("Topic deleted"), onError: msg => showToast(msg, false) })

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function openCreate() {
    setForm({ title: "", topic_id: topics[0]?.id?.toString() || "", author_id: authors[0]?.id?.toString() || "", status: "draft" })
    setEditingArticle(null); setThumbFile(null); setThumbPreview(null); setHtmlMode(false); setHtmlCode(""); setModal("create")
    setTimeout(() => { contentRef.current && (contentRef.current.innerHTML = "") }, 50)
  }

  function openEdit(a) {
    setForm({ title: a.title, topic_id: a.topic_id?.toString() || "", author_id: a.author_id?.toString() || "", status: a.status })
    setEditingArticle(a); setThumbFile(null); setThumbPreview(a.thumbnail ? thumbUrl(a.thumbnail) : null)
    setHtmlMode(false); setHtmlCode(a.content || ""); setModal("edit")
    setTimeout(() => { contentRef.current && (contentRef.current.innerHTML = a.content || "") }, 50)
  }

  function closeModal() { setModal(null); setEditingArticle(null); setThumbFile(null); setThumbPreview(null) }

  function handleThumb(f) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) { showToast("JPG/PNG/WebP only", false); return }
    setThumbFile(f); setThumbPreview(URL.createObjectURL(f))
  }

  function handleSave() {
    if (!form.title.trim() || !form.topic_id || !form.author_id) { showToast("Title, topic & author required", false); return }
    const fd = new FormData()
    const content = htmlMode ? htmlCode : (contentRef.current?.innerHTML || "")
    fd.append("title", form.title); fd.append("topic_id", form.topic_id)
    fd.append("author_id", form.author_id); fd.append("content", content); fd.append("status", form.status)
    if (thumbFile) fd.append("thumbnail", thumbFile)
    saveArticle.mutate({ fd, id: editingArticle?.id })
  }

  const searched = searchQuery ? articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())) : articles

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-start justify-between gap-4 px-7 py-6 bg-white border-b border-gray-100">
        <div>
          <h2 className="font-fraunces text-2xl font-bold italic text-gray-900">Resource Articles</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage blog articles &amp; topics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTopicPanel(true)}>Topics</Button>
          <Button variant="primary" size="sm" onClick={openCreate}>+ New Article</Button>
        </div>
      </div>

      {/* Tabs + search */}
      <div className="flex items-center px-7 bg-white border-b border-gray-100 overflow-x-auto gap-0">
        {["all", ...ART_STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all ${filterStatus === s ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filterStatus === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>{articles.length}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 px-2">
          <input value={searchDraft} onChange={e => setSearchDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && setSearchQuery(searchDraft)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-gray-900 transition-all w-44" placeholder="Search articles…" />
        </div>
      </div>

      {/* Table */}
      <div className="p-7 overflow-x-auto">
        {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        : searched.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">
            <span className="text-4xl opacity-40">📝</span>
            <span className="text-sm">No articles found</span>
            <Button variant="outline" size="sm" onClick={openCreate}>Create first →</Button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm min-w-[780px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Thumb","Title","Topic","Author","Status","Date",""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 first:pl-5 last:pr-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searched.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                    <td className="px-4 py-3 pl-5">
                      {a.thumbnail ? <img src={thumbUrl(a.thumbnail)} alt="" className="w-12 h-8 object-cover rounded-md" />
                        : <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center text-sm">📄</div>}
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="font-semibold text-gray-900 text-[13px] truncate">{a.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">{a.slug}</div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="default">{a.topic_name}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {a.author_photo ? <img src={thumbUrl(a.author_photo)} alt="" className="w-5 h-5 rounded-full object-cover" />
                          : <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">{(a.author_name || "A")[0]}</div>}
                        <span className="text-xs text-gray-700">{a.author_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(a.created_at)}</td>
                    <td className="px-4 py-3 pr-5">
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="xs" onClick={() => openEdit(a)}>Edit</Button>
                        <Button variant="outline-danger" size="xs" onClick={() => setDeleteConfirm(a)}>Del</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal === "edit" ? "Edit Article" : "New Article"} size="xl"
        footer={<>
          <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" size="sm" loading={saveArticle.isPending} onClick={handleSave}>
            {modal === "edit" ? "Update Article" : "Create Article"}
          </Button>
        </>}
      >
        <div className="flex flex-col gap-5">
          {/* Thumbnail */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thumbnail</label>
            {thumbPreview ? (
              <div className="relative inline-block">
                <img src={thumbPreview} alt="" className="w-full max-h-48 object-cover rounded-lg" />
                <button onClick={() => { setThumbFile(null); setThumbPreview(null) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-all">✕</button>
              </div>
            ) : (
              <div onClick={() => thumbRef.current?.click()}
                className="flex flex-col items-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:border-gray-400 transition-all text-center">
                <span className="text-3xl">🖼</span>
                <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP · Max 5MB</span>
              </div>
            )}
            <input ref={thumbRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { if (e.target.files?.[0]) handleThumb(e.target.files[0]); e.target.value = "" }} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Title *</label>
            <input value={form.title} onChange={e => setF("title", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all" placeholder="Article title" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Topic *</label>
              <select value={form.topic_id} onChange={e => setF("topic_id", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all appearance-auto">
                <option value="" disabled>Select topic</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author *</label>
              <select value={form.author_id} onChange={e => setF("author_id", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all appearance-auto">
                <option value="" disabled>Select author</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
            <select value={form.status} onChange={e => setF("status", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-all appearance-auto">
              {ART_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Content</label>
            <div className="flex border-b border-gray-200 mb-0">
              <button type="button" onClick={() => { if (htmlMode) { setTimeout(() => { contentRef.current && (contentRef.current.innerHTML = htmlCode) }, 0); setHtmlMode(false) } }}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${!htmlMode ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}>✎ Visual</button>
              <button type="button" onClick={() => { if (!htmlMode) { setHtmlCode(contentRef.current?.innerHTML || ""); setHtmlMode(true) } }}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${htmlMode ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}>⟨/⟩ HTML</button>
            </div>
            {!htmlMode ? <RichEditor editorRef={contentRef} placeholder="Write your article content here…" />
            : (
              <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden min-h-[300px]">
                <div className="flex flex-col border-r border-gray-200">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border-b border-gray-200">HTML Code</div>
                  <textarea value={htmlCode} onChange={e => setHtmlCode(e.target.value)}
                    className="flex-1 p-4 font-mono text-xs bg-gray-900 text-green-400 outline-none resize-none min-h-[260px]" />
                </div>
                <div className="flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border-b border-gray-200">Preview</div>
                  <div className="flex-1 p-4 text-sm leading-relaxed overflow-y-auto" dangerouslySetInnerHTML={{ __html: htmlCode }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Article?" size="sm"
        footer={<>
          <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" size="sm" loading={deleteArticle.isPending} onClick={() => deleteArticle.mutate(deleteConfirm.id)}>Delete</Button>
        </>}
      >
        <p className="text-sm text-gray-500 leading-relaxed">Delete <strong className="text-gray-900">"{deleteConfirm?.title}"</strong>? This cannot be undone.</p>
      </Modal>

      {/* Topic panel */}
      <Modal open={showTopicPanel} onClose={() => setShowTopicPanel(false)} title="Manage Topics" size="sm">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input value={newTopicName} onChange={e => setNewTopicName(e.target.value)} onKeyDown={e => e.key === "Enter" && addTopic.mutate(newTopicName)}
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-gray-900 transition-all" placeholder="New topic name" />
            <Button variant="primary" size="sm" loading={addTopic.isPending} onClick={() => addTopic.mutate(newTopicName)}>Add</Button>
          </div>
          <div className="flex flex-col gap-2">
            {topics.map(t => (
              <div key={t.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{t.name}</span>
                  {t.is_default && <Badge variant="default">Default</Badge>}
                </div>
                {!t.is_default && <Button variant="outline-danger" size="xs" onClick={() => deleteTopic.mutate(t.id)}>Del</Button>}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
