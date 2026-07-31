import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/apps/niwedan': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
      '/apps/flower-field': {
        target: 'http://localhost:5175',
        changeOrigin: true,
      },
      '/apps/mission-143': {
        target: 'http://localhost:5176',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
})
