# CLAUDE.md

Notes for Claude Code working in this repo. This mirrors **`AGENTS.md`** — read
that for the full guide. The essentials:

## Project

**Niwedan** (निवेदन) — a one-page, no-backend, bilingual (English + Nepali)
"Official Gallery Access Request." A charming, slightly-dramatic, fully
respectful request to save one photo. A personal gift styled as a legal filing.

## Golden rules

1. **Consent-first, always.** The site must clearly say "no" is an okay,
   respected answer (see `finalNote` in `src/data/content.js`). Never add dark
   patterns, pressure, urgency, or anything creepy/possessive/desperate/sexual.
2. **Keep the tone:** romantic, playful, witty, lightly "official." Make her
   smile, not cringe.
3. **Bilingual.** Strings come in `...En` / `...Ne` pairs — edit both. Nepali is
   formal-register Devanagari (`className="ne"` or `"ne-serif"`).
4. **All copy lives in `src/data/content.js`.** Change text there, not in JSX.
5. **Stay lightweight.** Vite + React + Tailwind + Framer Motion only. No
   Three.js / heavy deps. The background is plain Canvas.
6. **Respect `prefers-reduced-motion`** and accessibility (skip link, focusable
   modal with Escape, semantic landmarks, strong contrast).
7. **No real private photos** committed — `PhotoFrame.jsx` is a placeholder.

### Mission 143 quiz sharing exception

Mission 143 may send quiz events only after the player deliberately chooses the
equal-weight **Share attempts** action and has first seen the disclosure. Those
events may include raw typed answers, selections, attempts, lives, and replay
count for Person A through Discord. The player can stop future sharing at any
time; messages already delivered to Discord cannot be recalled. Identity
checks, all pre-consent interaction, private play, and unrelated activity must
never transmit. This narrow exception does not permit silent analytics,
background tracking, or any other outbound data collection.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # must stay green — this is the definition of "done"
npm run preview
```

No tests/linter configured. Verify visually at mobile + desktop widths.

## Map

- `src/App.jsx` — layout & section order.
- `src/data/content.js` — all EN/NE copy + `meta`.
- `src/components/` — one file per section + primitives (`Reveal`, `Modal`,
  `Seal`, `HeartBurst`, `PhotoFrame`, `ParticleField`, `CursorGlow`,
  `MusicPlayer`).
- `src/lib/notify.js` — optional Discord ping (`VITE_DISCORD_WEBHOOK_URL`); the
  only data that leaves the browser, only on her explicit choice. No silent
  tracking.
- `src/index.css` — `.glass`, `.btn-*`, `.text-gradient`, body gradient.
- `tailwind.config.js` — `romance` / `sky` / `ink` colors, fonts, animations.
