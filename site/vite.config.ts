import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "/budget_script/",
  server: {
    port: 3000,
  },
  build: {
    outDir: "../docs",
  },
})
