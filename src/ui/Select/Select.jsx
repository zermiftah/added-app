/**
 * Reusable select input
 */
export default function Select({
  label,
  error,
  hint,
  className = "",
  selectClassName = "",
  required = false,
  children,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}{required && " *"}
        </label>
      )}
      <select
        className={`
          w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-dm
          outline-none transition-all appearance-auto bg-white
          ${error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
          }
          ${selectClassName}
        `}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
