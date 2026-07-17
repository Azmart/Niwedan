import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ base: '/apps/flower-field/', plugins: [react()], server: { port: 5175, strictPort: true }, build: { outDir: '../../dist/apps/flower-field', emptyOutDir: true } })
