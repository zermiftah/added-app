/**
 * @param {"sm"|"md"|"lg"} size
 * @param {"dark"|"light"} color
 */
export default function Spinner({ size = "md", color = "dark" }) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-[3px]" }
  const colors = { dark: "border-gray-200 border-t-gray-900", light: "border-white/30 border-t-white" }
  return <div className={`rounded-full animate-spin flex-shrink-0 ${sizes[size]} ${colors[color]}`} />
}
