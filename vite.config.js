import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
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
})
