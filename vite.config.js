import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// Plugin: 
// 1. Async CSS load (non-blocking)
// 2. High-priority modulepreload for JS placed at top of <head> for earliest fetch
function optimizeAssetsPlugin() {
  return {
    name: "vite-optimize-assets",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        // Convert blocking CSS link to async
        html = html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
          (_, href) =>
            `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'" />` +
            `\n    <noscript><link rel="stylesheet" href="${href}" /></noscript>`
        )

        // Extract entry script src
        const entryMatch = html.match(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)">/) 
        const entrySrc = entryMatch ? entryMatch[1] : null

        // Extract all modulepreload chunks
        const chunkMatches = [...html.matchAll(/<link rel="modulepreload"[^>]*href="(\/assets\/[^"]+\.js)"/g)]
        const chunks = chunkMatches.map(m => m[1])

        // Build high-priority preload hints — placed RIGHT AFTER <meta charset> for earliest browser discovery
        const hints = []
        if (entrySrc) {
          hints.push(`<link rel="modulepreload" fetchpriority="high" href="${entrySrc}" />`)
        }
        chunks.forEach(href => {
          hints.push(`<link rel="modulepreload" fetchpriority="high" href="${href}" />`)
        })

        if (hints.length) {
          // Insert hints immediately after viewport meta for earliest fetch
          html = html.replace(
            /(<meta name="viewport"[^>]*\/>)/,
            `$1\n    ${hints.join("\n    ")}`
          )
        }

        return html
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), optimizeAssetsPlugin()],
  resolve: {
    alias: {
      features:   path.resolve(__dirname, "./src/features"),
      ui:         path.resolve(__dirname, "./src/ui"),
      stores:     path.resolve(__dirname, "./src/stores"),
      providers:  path.resolve(__dirname, "./src/providers"),
      hooks:      path.resolve(__dirname, "./src/hooks"),
      lib:        path.resolve(__dirname, "./src/lib"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-query":  ["@tanstack/react-query"],
          "vendor-motion": ["framer-motion"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    host: true,
    port: 5173,
  },
})
