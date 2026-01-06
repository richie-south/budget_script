import { defineConfig } from "vite"

export default defineConfig({
  base: "/budget_script/",
  server: {
    port: 3000,
  },
  build: {
    outDir: "../docs",
  },
})
