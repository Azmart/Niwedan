import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createCelebrationDateHandler } from '../../server/celebration-date.js'

// Dev-only: vite serve does not run serverless functions, so mount the same
// handler locally at POST /api/celebration-date, reading the repo-root .env.
function celebrationDateDevPlugin(rootEnv) {
  return {
    name: 'celebration-date-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || !req.url.startsWith('/api/celebration-date')) return next()
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const headers = new Headers()
        for (const [key, value] of Object.entries(req.headers)) {
          if (key !== 'content-length' && value != null) headers.set(key, String(value))
        }
        const request = new Request(`http://${req.headers.host}${req.url}`, {
          method: 'POST',
          headers,
          body: Buffer.concat(chunks),
        })
        const response = await createCelebrationDateHandler({ env: rootEnv })(request)
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      })
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const rootEnv = loadEnv(mode, path.resolve(process.cwd(), '../..'), '')
  return {
    base: '/apps/little-world/',
    envDir: '../..',
    plugins: [react(), ...(command === 'serve' ? [celebrationDateDevPlugin(rootEnv)] : [])],
    server: {
      port: 5177,
      strictPort: true,
    },
    build: {
      outDir: '../../dist/apps/little-world',
      emptyOutDir: true,
    },
  }
})

