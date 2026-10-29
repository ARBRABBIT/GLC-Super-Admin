import path from "path"
import os from "os"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: path.resolve(os.tmpdir(), "vite-cache-glc-ui"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
