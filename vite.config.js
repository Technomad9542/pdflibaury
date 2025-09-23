import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['.', '../cheat-sheet-project/reference-main/source/_posts']
    }
  },
  build: {
    rollupOptions: {
      external: ['/src/markdown-cheatsheets/']
    }
  }
})