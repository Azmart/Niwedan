# Our Little Archive · हाम्रो सानो संग्रह

A bilingual workspace for a growing collection of small, personal apps. The
App Gallery lives at `/`; each chapter is built independently beneath `/apps/`.
The collection currently includes **Niwedan**, **Flowers for Today**, and
**Mission 143**.

## App #1: निवेदन · Niwedan

### Official Gallery Access Request

A playful, respectful, slightly-dramatic-in-a-cute-way single-page micro-site that
charmingly asks for permission to save **one** photo to a phone gallery — and
politely requests the HD original in the inbox, because screenshotting a story
"feels both illegal and disrespectful to the quality of the masterpiece."

It is a tiny digital love letter dressed up as an official legal filing.
Bilingual: **English + नेपाली**. The current app does not collect personal data;
it just asks — nicely.

> _"Temporary stories are not enough for permanent art."_

---

## ✨ Features

- **One-page interactive experience** with smooth scroll and a scroll-progress bar.
- **Romantic red ↔ sky-blue palette** over a midnight-navy gradient.
- **Animated background** — a lightweight `<canvas>` field of floating glowing
  embers and hearts (no Three.js, no heavy deps).
- **Glassmorphism cards**, gradient display type, and a wax-seal "official document"
  petition section with a drop-cap and signature.
- **Interactive verdict**: _Permission Granted_ (heart-burst + modal),
  _Send HD Version First_ (modal), and a gentle _Needs More Convincing_ that
  reveals a closing argument.
- **The real story, on the record** — the original message is preserved as
  "Exhibit Ø," and the whole site is framed as the appeal.
- **Accessible**: semantic landmarks, keyboard focus styles, a skip link, an
  `aria-modal` dialog (Escape / backdrop to close), and full
  `prefers-reduced-motion` support (animations and the cursor glow switch off).
- **Mobile-first responsive** design.

## 🧱 Tech stack

| Tool             | Why                                              |
| ---------------- | ------------------------------------------------ |
| **Vite 6**       | Fast dev server + tiny production build.         |
| **React 18**     | Component structure for the sections.            |
| **Tailwind CSS 3** | Utility styling + a small design-token theme.  |
| **Framer Motion 11** | Scroll reveals, modal, heart-burst, 3D tilt. |

The animated background and cursor glow are plain Canvas/DOM — **no Three.js**,
keeping the bundle light (~100 KB gzipped JS).

## 🚀 Getting started

> Requires **Node 20+**.

```bash
npm install      # install dependencies
npm run dev      # start the Gallery → http://localhost:5173/
npm run dev:niwedan # start Niwedan independently
npm run build    # assemble all four workspaces → dist/
npm run preview  # preview the assembled dist/ output
```

## 🗂️ Project structure

```
.
├── apps/
│   ├── gallery/              # collection shell at /
│   │   ├── index.html
│   │   ├── src/              # bilingual gallery UI and copy
│   │   └── vite.config.js    # root dist/ build configuration
│   └── niwedan/
│       ├── index.html         # entry, fonts, meta
│       ├── public/            # favicon + music
│       ├── src/               # React app, copy, and components
│       ├── tailwind.config.js # colors, fonts, keyframes
│       └── vite.config.js     # /apps/niwedan/ build configuration
├── package.json               # npm workspace orchestration
├── netlify.toml               # Netlify build + SPA redirect
└── vercel.json                # Vercel build + SPA rewrite
```

## ✏️ Make it yours

Almost everything is editable in one place: **[`apps/niwedan/src/data/content.js`](apps/niwedan/src/data/content.js)**.

- **Change the wording / names** — edit the EN and NE strings there. The
  petitioner's name and Request ID live in the `meta` object at the top.
- **Add the real photo** — open
  [`apps/niwedan/src/components/PhotoFrame.jsx`](apps/niwedan/src/components/PhotoFrame.jsx)
  and replace the abstract "artwork" `<div>` with an `<img>` (drop the file in
  `apps/niwedan/public/` and construct its URL with `import.meta.env.BASE_URL`).
  The frame, tilt, and plaque stay as-is.
  _The repo intentionally ships with a placeholder — no private photos included._
- **Tweak the colors** — adjust the `romance` / `sky` / `ink` palettes in
  [`apps/niwedan/tailwind.config.js`](apps/niwedan/tailwind.config.js).

## 🔔 Get a ping when she answers

The site sends an opt-in choice to a small serverless endpoint, which then posts
to Discord. The webhook URL remains a server-side secret:

1. Discord → your channel → **Edit Channel → Integrations → Webhooks → New
   Webhook → Copy URL**.
2. Copy `.env.example` to `.env` and paste the URL into `DISCORD_WEBHOOK_URL`.
3. On Netlify, make that variable available to Functions or all scopes; on
   Vercel, add it as a server-side environment variable. Then redeploy.

Plain `npm run dev` serves only the Vite apps; use `netlify dev` for local
end-to-end notification testing.

Now "Permission Granted" and "Send HD Version First" each post a message to your
Discord. Leave it unset and the buttons just show their friendly on-screen
messages — no ping, no error. The endpoint only accepts the two deliberate
choices, keeps the webhook out of the shipped JavaScript, and Netlify rate-limits
requests per visitor and domain.

## 🎵 Music

On arrival she picks **Enter with music** or **Enter in silence** (a gate is the
only reliable way to play audio — browsers block autoplay with sound until a
click). The song (`apps/niwedan/public/music.m4a`) begins at **1:34** the first time it plays
and loops from the start after that. A floating button (bottom-right) is always
there to mute/unmute. Swap the file (keep the name `music.m4a`) or change the
start time via `START_AT` in
[`apps/niwedan/src/components/MusicPlayer.jsx`](apps/niwedan/src/components/MusicPlayer.jsx).

## ☁️ Deployment

The workspace builds four static SPAs into one `dist/` directory: the Gallery
at `/`, Niwedan at `/apps/niwedan/`, Flower Field at `/apps/flower-field/`, and
Mission 143 at `/apps/mission-143/`, plus optional serverless notification
endpoints.
Netlify and Vercel can serve the supplied per-app SPA rewrites and endpoint.
Two easy options:

### Vercel

**Dashboard:** push this folder to a Git repo, "Add New Project," import it.
Vercel auto-detects Vite (`vercel.json` is already included, so build command
`npm run build` and output `dist` are set). Click **Deploy**.

**CLI:**

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

### Netlify

**Dashboard:** "Add new site" → "Import an existing project," pick the repo.
Settings are read from `netlify.toml` (build `npm run build`, publish `dist`,
plus Gallery, Niwedan, Flower Field, and Mission 143 SPA redirects). Click
**Deploy**.

**CLI:**

```bash
npm i -g netlify-cli
netlify deploy            # draft deploy
netlify deploy --prod     # production deploy
```

> The three apps deploy as static files plus one optional serverless
> notification endpoint. Its only optional setting is `DISCORD_WEBHOOK_URL`
> (see "Get a ping when she answers"); without it, nothing else needs
> configuring for the current implementation.

## 📦 Dependencies added

- **Runtime:** `react`, `react-dom`, `framer-motion`
- **Dev/build:** `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`

Fonts (Cormorant Garamond, Inter, Hind, Tiro Devanagari Hindi) are loaded from
Google Fonts via `<link>` in `index.html`.

## 💖 A note on consent

The whole point of the site is in the final section: **only with permission.**
If the answer is no, the gallery stays empty and that is completely fine — the
compliment is permanent either way. Niwedan itself only sends the optional
Discord confirmation (just *which* choice was made, and only if you set up the
webhook). Mission 143 has a separate, equal-weight opt-in before question one
for sharing raw quiz attempts; private play and all pre-consent activity remain
local, and she can stop future sharing at any time.

---

<sub>Request ID: ART-001 · Filing No. 02 · Drafted with respect.</sub>
