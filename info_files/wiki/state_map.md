# State Map

## Routes and Screens

| Route | Workspace | Dev port | Production output | Purpose |
| --- | --- | ---: | --- | --- |
| `/` | `apps/gallery` | 5173 | `dist/index.html` | Archive shell and sub-app links |
| `/apps/niwedan/` | `apps/niwedan` | 5174 | `dist/apps/niwedan/index.html` | Original gallery-access petition |
| `/apps/flower-field/` | `apps/flower-field` | 5175 | `dist/apps/flower-field/index.html` | Interactive encouragement meadow |
| `/apps/mission-143/` | `apps/mission-143` | 5176 | `dist/apps/mission-143/index.html` | Bilingual quiz with server-gated private media |

## Site Gate
- Every route above sits behind `netlify/edge-functions/site-gate.js` on `/*` when `SITE_PASSWORD` is set, so the first screen on any entry URL is the shared password page.
- State is a single 30-day cookie; there is no client-side gate state and no gate code in any app bundle.
- Success redirects back to the originally requested path, so deep links survive the gate.
- The gate is invisible under `npm run dev` because Vite does not run edge functions.

## Flower Field State
- `blooms`: local array, maximum 20; first is a rose and seven flower types cycle.
- `stars`: local array, maximum 48; sky taps add stars without advancing flowers.
- `offset`: horizontal meadow position; pointer movement beyond 7px is a drag and creates nothing.
- `done`: derived from 20 blooms; reveals the final bilingual note.
- Final-note visibility: local state; close hides only the note and preserves the completed meadow.
- Bees: decorative layer rendered when `blooms.length > 5`; two bees, no pointer events.
- Breeze: decorative inner wrapper applied after bloom; disabled under reduced motion.

## Flower Field Music State
- `isChoosing`: opens the initial modal and locks body scroll.
- `isPlaying`: mirrors native audio play/pause events.
- `hasStarted`: ref ensuring the first play seeks to 116 seconds only once.
- Silent entry and Escape close the gate without playback; the persistent toggle can start music later.
- Native `loop` makes the first end transition restart at 0:00.

## Navigation and Data
- Gallery cards are generated from `apps/gallery/src/content.js`.
- Niwedan user-facing copy remains in `apps/niwedan/src/data/content.js`.
- Sub-apps provide a visible link back to `/`.
- Mission 143 copy is in `apps/mission-143/src/data/gameContent.js`; real names, accepted answers, and media URLs are absent from it and applied at runtime by `applyUnlock()` after `/api/mission-unlock` succeeds.
- Corrected on 2026-08-01: there is no longer "no backend". Serverless handlers exist under `server/`, `api/`, and `netlify/functions/`. There is still no analytics and no page-load or scroll tracking; outbound data leaves only on an explicit user choice.
