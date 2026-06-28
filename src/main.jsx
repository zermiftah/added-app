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
requestAnimationFrame(() => {
  document.body.classList.add('app-mounted')
})
