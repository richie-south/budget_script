import { defineConfig } from "vite"

export default defineConfig({
  base: "/buuget_script/",
  server: {
    port: 3000,
  },
  build: {
    outDir: "../docs",
  },
})
