import { useState } from "react"

export function useToast() {
  const [toast, setToast] = useState(null)
  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, showToast }
}
