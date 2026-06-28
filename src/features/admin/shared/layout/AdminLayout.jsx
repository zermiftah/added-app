import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useAdminStore } from "stores/adminStore"

const NAV_ITEMS = [
  { key: "jobs",       label: "Job Vacancy",      icon: "💼", group: "Career Portal" },
  { key: "applicants", label: "Applicants",        icon: "👥", group: "Career Portal" },
  { key: "articles",   label: "Resource Articles", icon: "📝", group: "Resources" },
  { key: "authors",    label: "Resource Authors",  icon: "✍️",  group: "Resources" },
  { key: "assets",     label: "Media Library",     icon: "🖼", group: "Media" },
  { key: "team",       label: "Team",              icon: "👤", group: "Media" },
  { key: "webinars",   label: "Landing Pages",     icon: "🎯", group: "Media" },
]

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const activeNav  = useAdminStore(s => s.activeNav)
  const setActiveNav = useAdminStore(s => s.setActiveNav)
  const signOut    = useAdminStore(s => s.signOut)

  return (
    <div className="flex w-full min-h-screen bg-gray-50 font-dm">
      {/* ── SIDEBAR ── */}
      <aside className={`flex-shrink-0 bg-[#0f0f0f] flex flex-col sticky top-0 h-screen transition-all duration-200 border-r border-white/5 ${collapsed ? "w-[60px]" : "w-[220px]"}`}>
        {/* Brand header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/5 min-h-[60px] gap-2">
          {!collapsed && (
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-white tracking-wide truncate">Added Education</span>
              <span className="block text-[10px] text-white/25 tracking-widest uppercase mt-0.5 truncate">Admin</span>
            </div>
          )}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(v => !v)}
            className="flex-shrink-0 w-7 h-7 rounded-md bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center text-[10px]"
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
          {!collapsed && <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/20 px-2.5 pt-3 pb-1">Career Portal</span>}
          {NAV_ITEMS.filter(n => n.group === "Career Portal").map(item => (
            <NavItem key={item.key} item={item} active={activeNav === item.key} collapsed={collapsed} onClick={() => setActiveNav(item.key)} />
          ))}
          {!collapsed && <div className="my-2 border-t border-white/5" />}
          {collapsed && <div className="my-1 border-t border-white/5" />}
          {!collapsed && <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/20 px-2.5 pb-1">Resources</span>}
          {NAV_ITEMS.filter(n => n.group === "Resources").map(item => (
            <NavItem key={item.key} item={item} active={activeNav === item.key} collapsed={collapsed} onClick={() => setActiveNav(item.key)} />
          ))}
          {!collapsed && <div className="my-2 border-t border-white/5" />}
          {collapsed && <div className="my-1 border-t border-white/5" />}
          {!collapsed && <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/20 px-2.5 pb-1">Media</span>}
          {NAV_ITEMS.filter(n => n.group === "Media").map(item => (
            <NavItem key={item.key} item={item} active={activeNav === item.key} collapsed={collapsed} onClick={() => setActiveNav(item.key)} />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/5">
          <button
            aria-label="Logout"
            onClick={signOut}
            title={collapsed ? "Logout" : undefined}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all font-dm text-[13px] font-medium"
          >
            <span className="text-[15px] w-5 text-center flex-shrink-0">⏻</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

function NavItem({ item, active, collapsed, onClick }) {
  return (
    <button
      aria-label={item.label}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg border-none font-dm text-[13px] font-medium transition-all text-left ${active ? "bg-accent/15 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/80"}`}
    >
      <span className="text-[15px] w-5 text-center flex-shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && active && <span className="ml-auto w-1 h-4 rounded-full bg-accent flex-shrink-0" />}
    </button>
  )
}
