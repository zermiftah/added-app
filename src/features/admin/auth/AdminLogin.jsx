import { useState } from "react"
import { motion } from "framer-motion"
import { useLoginMutation } from "./api/auth-queries"
import Button from "ui/Button"
import Input from "ui/Input"

const NAV_FEATURES = [
  { icon: "💼", label: "Job Vacancy" },
  { icon: "👥", label: "Applicants" },
  { icon: "📝", label: "Resource Articles" },
  { icon: "✍️",  label: "Resource Authors" },
]

export default function AdminLogin() {
  const [form, setForm]       = useState({ username: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState("")

  const loginMutation = useLoginMutation({ onError: setError })

  function handleLogin() {
    setError("")
    if (!form.username || !form.password) { setError("Username and password required"); return }
    loginMutation.mutate(form)
  }

  return (
    <div className="flex w-full min-h-screen font-dm">
      {/* Left panel */}
      <div className="flex-1 bg-[#0f0f0f] flex flex-col px-14 py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        />
        <div className="absolute -bottom-32 -left-16 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,53,75,0.12) 0%, transparent 65%)" }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <div>
            <span className="block text-[13px] font-semibold text-white/55 tracking-wide">Added Education</span>
            <span className="block text-[10px] text-white/22 tracking-[3px] uppercase mt-1">Admin Dashboard</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-10">
            <p className="font-fraunces font-black italic text-white leading-[1.05] tracking-tight capitalize"
              style={{ fontSize: "clamp(36px, 3.8vw, 52px)" }}>
              One dashboard,<br />every tool you<br /><em className="text-accent not-italic">need.</em>
            </p>
            <div className="flex flex-col gap-3">
              {NAV_FEATURES.map(f => (
                <div key={f.label} className="flex items-center gap-3 text-white/40 text-[13px]">
                  <span className="text-base">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="w-7 h-[1.5px] bg-white/15 mb-3" />
            <p className="text-[12px] text-white/22 leading-relaxed">Authorised personnel only. All access is logged.</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[440px] flex-shrink-0 bg-white flex items-center justify-center px-14 py-14 overflow-y-auto">
        <motion.div className="w-full flex flex-col gap-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-2">
            <h1 className="font-fraunces text-[34px] font-black italic text-gray-900 tracking-tight leading-tight capitalize mb-2">Sign in</h1>
            <p className="text-sm text-gray-400 leading-relaxed">Admin access to Added Education portal</p>
          </div>

          <Input
            label="Username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter username"
            autoComplete="username"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all placeholder:text-gray-300"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1">
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-700 bg-red-50 border-l-[3px] border-red-500 px-4 py-3 rounded-r-lg">
              {error}
            </motion.div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-1"
            loading={loginMutation.isPending}
            onClick={handleLogin}
          >
            Sign In →
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
