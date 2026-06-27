import { useState } from "react"

/**
 * Reusable contenteditable rich text editor
 * @param {React.RefObject} editorRef
 * @param {string} placeholder
 * @param {"normal"|"mini"} size - controls min-height
 */
export default function RichEditor({ editorRef, placeholder, size = "normal" }) {
  const [activeFormats, setActiveFormats] = useState(new Set())

  function exec(cmd, value) {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
    updateFmt()
  }

  function updateFmt() {
    const f = new Set()
    if (document.queryCommandState("bold")) f.add("bold")
    if (document.queryCommandState("italic")) f.add("italic")
    if (document.queryCommandState("underline")) f.add("underline")
    if (document.queryCommandState("insertOrderedList")) f.add("ol")
    if (document.queryCommandState("insertUnorderedList")) f.add("ul")
    const b = document.queryCommandValue("formatBlock")
    if (b) f.add(b.toLowerCase())
    setActiveFormats(f)
  }

  function handleKD(e) {
    if (e.key === "Tab") { e.preventDefault(); document.execCommand(e.shiftKey ? "outdent" : "indent") }
    if ((e.metaKey || e.ctrlKey) && e.key === "b") { e.preventDefault(); exec("bold") }
    if ((e.metaKey || e.ctrlKey) && e.key === "i") { e.preventDefault(); exec("italic") }
    if ((e.metaKey || e.ctrlKey) && e.key === "u") { e.preventDefault(); exec("underline") }
  }

  const tools = [
    { key: "h2", icon: "H1", action: () => exec("formatBlock", "h2") },
    { key: "h3", icon: "H2", action: () => exec("formatBlock", "h3") },
    { key: "sep1", icon: "|" },
    { key: "bold", icon: "B", action: () => exec("bold"), cls: "font-black" },
    { key: "italic", icon: "I", action: () => exec("italic"), cls: "italic" },
    { key: "underline", icon: "U", action: () => exec("underline"), cls: "underline" },
    { key: "sep2", icon: "|" },
    { key: "ul", icon: "≡", action: () => exec("insertUnorderedList") },
    { key: "ol", icon: "1.", action: () => exec("insertOrderedList") },
    { key: "sep3", icon: "|" },
    { key: "p", icon: "¶", action: () => exec("formatBlock", "p") },
    { key: "hr", icon: "—", action: () => exec("insertHorizontalRule") },
  ]

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-100">
        {tools.map(t =>
          t.key.startsWith("sep") ? (
            <span key={t.key} className="w-px h-4 bg-gray-200 mx-1 flex-shrink-0" />
          ) : (
            <button
              key={t.key}
              type="button"
              onMouseDown={e => { e.preventDefault(); t.action() }}
              className={`
                min-w-[26px] h-[26px] px-1 rounded text-xs font-semibold text-gray-500
                hover:bg-gray-200 hover:text-gray-900 transition-all
                ${t.cls || ""}
                ${activeFormats.has(t.key) ? "bg-gray-900 !text-white" : "bg-transparent"}
              `}
            >
              {t.icon}
            </button>
          )
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onKeyDown={handleKD}
        onKeyUp={updateFmt}
        onMouseUp={updateFmt}
        onFocus={updateFmt}
        className={`
          outline-none px-4 py-3 text-sm text-gray-900 font-dm leading-relaxed cursor-text overflow-y-auto
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:pointer-events-none
          [&_h2]:font-fraunces [&_h2]:text-lg [&_h2]:font-bold [&_h2]:italic [&_h2]:my-3
          [&_h3]:font-fraunces [&_h3]:text-base [&_h3]:font-bold [&_h3]:my-2
          [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:pl-5 [&_ol]:my-1.5
          [&_p]:mb-2 [&_hr]:my-3 [&_hr]:border-gray-200
          ${size === "mini" ? "min-h-[120px] max-h-[200px]" : "min-h-[200px] max-h-[480px]"}
        `}
      />
    </div>
  )
}
