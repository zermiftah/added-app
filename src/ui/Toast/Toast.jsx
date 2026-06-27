import { AnimatePresence, motion } from "framer-motion"

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className={`
            fixed bottom-6 right-6 z-[9999] flex items-center gap-2
            px-4 py-3 rounded-lg text-sm font-semibold font-dm
            border-l-[3px] shadow-lg
            ${toast.ok
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
            }
          `}
        >
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
