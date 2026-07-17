# Architecture

## Workspace
- npm workspaces are declared as `apps/*`; Node `>=20`.
- `apps/gallery`: lightweight React/Vite archive shell, plain CSS, content in `src/content.js`.
- `apps/niwedan`: original React/Vite petition using Tailwind and Framer Motion; copy in `src/data/content.js`.
- `apps/flower-field`: React/Vite interactive meadow using inline SVG and CSS; no Three.js or additional runtime dependency.

## Development and Builds
- Root `npm run dev` uses `concurrently@9.2.4`.
- Gallery is the local front door on `5173` and proxies `/apps/niwedan` to `5174` and `/apps/flower-field` to `5175`.
- Production is a single origin; ports are development-only.
- Build order is gallery, Niwedan, then Flower Field. Gallery clears `dist/`; sub-apps write beneath `dist/apps/` without clearing the root output.
- Netlify redirects and Vercel rewrites list both sub-app SPA fallbacks before the root gallery fallback.

## Media
- `apps/niwedan/public/music.m4a`: original music flow, initial cue at 1:34.
- `apps/flower-field/public/music2.m4a`: Flower Field music, initial cue at 1:56; native loop restarts at 0:00.
- No private photographs are committed.
- Long-term direction discussed but not implemented: Sanity for private structured content/Studio and Asura for protected image/video storage and delivery.

## Security Status
- Current apps have no authentication or password gate.
- Hosting sends no-index and basic security headers, but these are not access control.
- Future private media must not rely on obscured Sanity/CDN URLs; use authenticated signed/proxied Asura delivery.
