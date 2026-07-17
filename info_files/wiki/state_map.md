# State Map

## Routes and Screens

| Route | Workspace | Dev port | Production output | Purpose |
| --- | --- | ---: | --- | --- |
| `/` | `apps/gallery` | 5173 | `dist/index.html` | Archive shell and sub-app links |
| `/apps/niwedan/` | `apps/niwedan` | 5174 | `dist/apps/niwedan/index.html` | Original gallery-access petition |
| `/apps/flower-field/` | `apps/flower-field` | 5175 | `dist/apps/flower-field/index.html` | Interactive encouragement meadow |

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
- Both sub-apps provide a visible link back to `/`.
- There is no backend, shared global state, analytics, or page-load tracking.
