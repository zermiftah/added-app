import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

/**
 * TopLoadingBar — thin animated bar at the very top of the viewport that
 * sweeps left → right on every route change (like YouTube / GitHub's nav bar).
 *
 * Since all user routes are eager-bundled (see App.jsx), navigation itself is
 * instant — this is a fast, fixed-timing "trickle" animation purely for
 * perceived-performance polish, not tied to a real network/loader signal.
 * Total runtime ≈ 450ms, so it never feels like it's stalling the page.
 */
export default function TopLoadingBar() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []

    // Snap back to 0 instantly (no transition), then trickle forward.
    setVisible(true)
    setProgress(0)

    const schedule = (ms, fn) => timers.current.push(setTimeout(fn, ms))

    schedule(16,  () => setProgress(22))
    schedule(90,  () => setProgress(48))
    schedule(190, () => setProgress(72))
    schedule(300, () => setProgress(90))
    schedule(400, () => {
      setProgress(100)
      schedule(200, () => setVisible(false))
    })

    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 10000,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 0.1s ease" : "opacity 0.25s ease 0.05s",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #C8354B 0%, #9E2538 100%)",
          boxShadow: "0 0 8px rgba(200,53,75,0.55)",
          transition: progress === 0 ? "none" : "width 0.28s cubic-bezier(0.4,0,0.2,1)",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  )
}
