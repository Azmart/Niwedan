import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: vite serve does not run serverless functions, so mount the same
// handler locally at POST /api/mission-unlock, reading the repo-root .env.
function missionUnlockDevPlugin(rootEnv) {
  return {
    name: 'mission-unlock-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || !req.url.startsWith('/api/mission-unlock')) return next()
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const headers = new Headers()
        for (const [key, value] of Object.entries(req.headers)) if (key !== 'content-length' && value != null) headers.set(key, String(value))
        const request = new Request(`http://${req.headers.host}${req.url}`, { method: 'POST', headers, body: Buffer.concat(chunks) })
        const { createMissionUnlockHandler } = await import('../../server/mission-unlock.js')
        const response = await createMissionUnlockHandler({ env: rootEnv })(request)
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
    base: '/apps/mission-143/',
    plugins: [react(), ...(command === 'serve' ? [missionUnlockDevPlugin(rootEnv)] : [])],
    // Honour an assigned PORT when one is provided, otherwise keep 5176 so the
    // four-app `npm run dev` keeps its stable per-app ports.
    server: { port: Number(process.env.PORT) || 5176, strictPort: true },
    build: { outDir: '../../dist/apps/mission-143', emptyOutDir: true },
  }
})
