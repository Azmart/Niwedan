# Architecture

## Workspace
- npm workspaces are declared as `apps/*`; Node `>=20`.
- `apps/gallery`: lightweight React/Vite archive shell, plain CSS, content in `src/content.js`.
- `apps/niwedan`: original React/Vite petition using Tailwind and Framer Motion; copy in `src/data/content.js`.
- `apps/flower-field`: React/Vite interactive meadow using inline SVG and CSS; no Three.js or additional runtime dependency.
- `apps/mission-143`: React/Vite quiz with plain CSS; copy in `src/data/gameContent.js`. Private media and real names live server-side only and arrive through `POST /api/mission-unlock`.

## Development and Builds
- Root `npm run dev` uses `concurrently@9.2.4`.
- Gallery is the local front door on `5173` and proxies `/apps/niwedan` to `5174`, `/apps/flower-field` to `5175`, and `/apps/mission-143` to `5176`.
- Production is a single origin; ports are development-only.
- Build order is gallery, Niwedan, Flower Field, then Mission 143. Gallery clears `dist/`; sub-apps write beneath `dist/apps/` without clearing the root output.
- `npm test` runs `node --test tests/*.test.js`, covering the server handlers, the Mission 143 game engine, and the site gate. Edge functions are not executed by Vite, so the gate can only be exercised end to end by `netlify dev` or a deploy.
- Netlify redirects and Vercel rewrites list both sub-app SPA fallbacks before the root gallery fallback.

## Media
- `apps/niwedan/public/music.m4a`: original music flow, initial cue at 1:34.
- `apps/flower-field/public/music2.m4a`: Flower Field music, initial cue at 1:56; native loop restarts at 0:00.
- No private photographs are committed. Mission 143 private media lives in a private Supabase Storage bucket, referenced only by server-only object paths in `MISSION_MEDIA`.

## Server Endpoints
- `server/*.js` hold the shared handlers; `api/*.js` and `netlify/functions/*.mjs` are thin per-platform wrappers.
- `/api/mission-unlock` checks a nickname against server-only aliases, then mints Supabase Storage signed URLs (8 hour TTL) for the private Mission 143 media.
- `/api/quiz-event` and `/api/notify-choice` reach Discord only after an explicit opt-in choice.

## Security Status
- `netlify/edge-functions/site-gate.js` password-gates every path on `/*`, including static bundles and `/api/*`, whenever `SITE_PASSWORD` is set. It is a no-op when the variable is unset, which is what keeps `vite dev` usable.
- Edge functions run before `netlify.toml` redirects, so the SPA rewrites do not bypass the gate. There are no `excludedPath` entries, so new routes are covered automatically.
- Netlify only. Vercel has no equivalent middleware, so a Vercel deploy would be ungated.
- Mission 143 media sits in a private Supabase bucket reached only through server-signed URLs; the service role key never reaches the browser.
- Hosting sends no-index and basic security headers, but these are not access control.
- Superseded on 2026-08-01: earlier notes in this wiki claimed the collection had no auth and planned Sanity plus Asura for protected media. Supabase Storage plus the edge gate replaced that plan; Sanity and Asura are not used.
