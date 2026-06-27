/**
 * @param {"default"|"red"|"green"|"amber"|"blue"|"violet"} variant
 * @param {"sm"|"md"} size
 * @param {boolean} dot
 */
export default function Badge({ children, variant = "default", size = "sm", dot = false, className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-600 border-gray-200",
    red:     "bg-red-50 text-red-700 border-red-200",
    green:   "bg-green-50 text-green-700 border-green-200",
    amber:   "bg-amber-50 text-amber-700 border-amber-200",
    blue:    "bg-blue-50 text-blue-700 border-blue-200",
    violet:  "bg-violet-50 text-violet-700 border-violet-200",
  }

  const dotColors = {
    default: "bg-gray-500",
    red:     "bg-red-500",
    green:   "bg-green-500",
    amber:   "bg-amber-500",
    blue:    "bg-blue-500",
    violet:  "bg-violet-500",
  }

  const sizes = {
    sm: "text-[10px] px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold border rounded-full capitalize whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}
