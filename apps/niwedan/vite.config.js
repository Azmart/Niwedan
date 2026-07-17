import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/apps/niwedan/',
  envDir: '../..',
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    outDir: '../../dist/apps/niwedan',
    emptyOutDir: true,
  },
})
