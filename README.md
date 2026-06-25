# निवेदन · Niwedan

### Official Gallery Access Request

A playful, respectful, slightly-dramatic-in-a-cute-way single-page micro-site that
charmingly asks for permission to save **one** photo to a phone gallery — and
politely requests the HD original in the inbox, because screenshotting a story
"feels both illegal and disrespectful to the quality of the masterpiece."

It is a tiny digital love letter dressed up as an official legal filing.
Bilingual: **English + नेपाली**. No backend. No data collected. It just asks — nicely.

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

> Requires **Node 18+** (Node 20 recommended).

```bash
npm install      # install dependencies
npm run dev      # start the dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## 🗂️ Project structure

```
.
├── index.html                 # entry, fonts, meta
├── src/
│   ├── main.jsx               # React root
│   ├── App.jsx                # layout: background layers + sections
│   ├── index.css              # Tailwind layers + base theme + components
│   ├── data/
│   │   └── content.js         # ← ALL copy (EN + NE) lives here
│   ├── lib/
│   │   └── notify.js          # optional Discord webhook ping
│   └── components/
│       ├── MusicPlayer.jsx    # background music (loops from 1:34)
│       ├── ParticleField.jsx  # canvas embers + hearts
│       ├── CursorGlow.jsx     # pointer-following glow (desktop)
│       ├── PhotoFrame.jsx     # floating placeholder "masterpiece"
│       ├── Hero.jsx
│       ├── TheCase.jsx
│       ├── Evidence.jsx
│       ├── Petition.jsx       # the official document + Exhibit Ø
│       ├── ChoicePanel.jsx    # buttons, modal, appeal reveal
│       ├── FinalNote.jsx      # consent-first closing
│       ├── Footer.jsx
│       ├── Modal.jsx          # accessible dialog
│       ├── HeartBurst.jsx     # celebration hearts
│       ├── Reveal.jsx         # scroll-into-view wrapper
│       ├── SectionLabel.jsx   # document-style labels
│       └── Seal.jsx           # SVG wax seal
├── tailwind.config.js         # colors, fonts, keyframes
├── netlify.toml               # Netlify build + SPA redirect
└── vercel.json                # Vercel build + SPA rewrite
```

## ✏️ Make it yours

Almost everything is editable in one place: **[`src/data/content.js`](src/data/content.js)**.

- **Change the wording / names** — edit the EN and NE strings there. The
  petitioner's name and Request ID live in the `meta` object at the top.
- **Add the real photo** — open
  [`src/components/PhotoFrame.jsx`](src/components/PhotoFrame.jsx) and replace the
  abstract "artwork" `<div>` with an `<img>` (drop the file in `public/` and
  reference it as `/your-photo.jpg`). The frame, tilt, and plaque stay as-is.
  _The repo intentionally ships with a placeholder — no private photos included._
- **Tweak the colors** — adjust the `romance` / `sky` / `ink` palettes in
  [`tailwind.config.js`](tailwind.config.js).

## 🔔 Get a ping when she answers

The site is static, so it can't "remember" a click for you — there's no shared
database. To actually find out, the click has to send a signal somewhere you
can see. The lazy, no-backend way is a **Discord webhook**:

1. Discord → your channel → **Edit Channel → Integrations → Webhooks → New
   Webhook → Copy URL**.
2. Copy `.env.example` to `.env` and paste the URL into `VITE_DISCORD_WEBHOOK_URL`.
3. On Netlify/Vercel, add the same variable in the dashboard's env settings, then
   redeploy.

Now "Permission Granted" and "Send HD Version First" each post a message to your
Discord. Leave it unset and the buttons just show their friendly on-screen
messages — no ping, no error. (Heads up: a client-side webhook URL is visible in
the shipped JavaScript. For a personal page that's fine; if you'd rather hide it,
move the `fetch` in `src/lib/notify.js` behind a Netlify/Vercel serverless
function with the URL as a server-side secret.)

## 🎵 Music

On arrival she picks **Enter with music** or **Enter in silence** (a gate is the
only reliable way to play audio — browsers block autoplay with sound until a
click). The song (`public/music.m4a`) begins at **1:34** the first time it plays
and loops from the start after that. A floating button (bottom-right) is always
there to mute/unmute. Swap the file (keep the name `music.m4a`) or change the
start time via `START_AT` in
[`src/components/MusicPlayer.jsx`](src/components/MusicPlayer.jsx).

## ☁️ Deployment

This is a static SPA — any static host works. Two easy options:

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
plus an SPA redirect). Click **Deploy**.

**CLI:**

```bash
npm i -g netlify-cli
netlify deploy            # draft deploy
netlify deploy --prod     # production deploy
```

> No backend required. The only optional setting is `VITE_DISCORD_WEBHOOK_URL`
> (see "Get a ping when she answers"); without it, nothing needs configuring.

## 📦 Dependencies added

- **Runtime:** `react`, `react-dom`, `framer-motion`
- **Dev/build:** `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`

Fonts (Cormorant Garamond, Inter, Hind, Tiro Devanagari Hindi) are loaded from
Google Fonts via `<link>` in `index.html`.

## 💖 A note on consent

The whole point of the site is in the final section: **only with permission.**
If the answer is no, the gallery stays empty and that is completely fine — the
compliment is permanent either way. No personal information is collected. The
only thing a button can send is the optional Discord confirmation (just *which*
choice was made, and only if you set up the webhook) — never anything about her.

---

<sub>Request ID: ART-001 · Filing No. 02 · Drafted with respect.</sub>
