import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Signal to CSS that React has mounted — hides static hero shell in index.html
// Using rAF ensures it fires after first React paint
// ── Global image fade-in ──────────────────────────────────────
// MutationObserver watches for new <img> tags, adds onload handler.
// When image loads, adds .loaded class → CSS opacity: 0 → 1 transition.
// Skips fetchpriority="high" and loading="eager" (LCP images).
function initImageFade() {
  function attachFade(img) {
    if (img.dataset.noFade !== undefined) return
    if (img.getAttribute("fetchpriority") === "high") return
    if (img.getAttribute("loading") === "eager") return
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded")
      return
    }
    img.addEventListener("load",  () => img.classList.add("loaded"),  { once: true })
    img.addEventListener("error", () => img.classList.add("loaded"),  { once: true })
  }

  // Existing images
  document.querySelectorAll("img").forEach(attachFade)

  // Future images added by React
  const obs = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return
        if (node.tagName === "IMG") attachFade(node)
        else node.querySelectorAll?.("img").forEach(attachFade)
      })
    }
  })
  obs.observe(document.body, { childList: true, subtree: true })
}

// ── Scroll to top on route change ─────────────────────────────
// Runs once; listens to popstate + clicks on <a> tags so every
// navigation scrolls to top without needing a React component.
function initScrollToTop() {
  const scrollUp = () => requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }))
  window.addEventListener("popstate", scrollUp)
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]")
    if (!a) return
    const href = a.getAttribute("href")
    // Only internal relative links
    if (href && href.startsWith("/") && !href.startsWith("//")) scrollUp()
  })
}

requestAnimationFrame(() => {
  document.body.classList.add("app-mounted")
  initImageFade()
  initScrollToTop()
})
