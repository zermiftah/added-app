/**
 * Reusable Button
 * @param {"primary"|"secondary"|"danger"|"ghost"|"outline"} variant
 * @param {"sm"|"md"|"lg"} size
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold font-dm rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"

  const variants = {
    primary:   "bg-gray-900 text-white hover:bg-accent",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger:    "bg-red-500 text-white hover:bg-red-600",
    ghost:     "bg-transparent text-gray-600 hover:bg-gray-100",
    outline:   "bg-transparent text-gray-700 border border-gray-200 hover:border-gray-400 hover:text-gray-900",
    "outline-danger": "bg-transparent text-red-500 border border-red-100 hover:bg-red-50",
    "ghost-dark": "bg-transparent text-white/50 border border-white/10 hover:text-white hover:border-white/30",
  }

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />}
      {children}
    </button>
  )
}
