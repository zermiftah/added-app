import { useEffect, useRef, useState } from "react"

export function useReveal(delay = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.unobserve(el) }
    }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return [ref, visible]
}

export function revealStyle(visible, delay = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  }
}

// Convenience component
import React from "react"
export function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal(delay)
  return (
    <div ref={ref} style={{ ...revealStyle(visible, 0), ...style }}>
      {children}
    </div>
  )
}
