# AGENTS.md

Guidance for AI agents and contributors working in this repository.
(`CLAUDE.md` mirrors this file for Claude Code.)

## What this project is

**Niwedan** ("निवेदन" = a petition / request) is a single-page, no-backend
micro-site: a charming, bilingual (English + Nepali) "Official Gallery Access
Request" that asks someone for permission to save one photo and to send the HD
original. It is a personal gift, framed as a tongue-in-cheek legal filing.

The bar is: **charming enough to make her smile, polished enough to look
intentional, respectful enough that the consent message is unmistakable.**

## Tone & content rules (read before editing copy)

This is the most important part. The site must always stay:

- **Romantic, playful, witty, lightly "official/dramatic"** — like a legal
  petition written by someone with a crush and a good sense of humor.
- **Respectful and consent-first.** The closing note (`finalNote` in
  `src/data/content.js`) makes clear that "no" is a complete, respected answer.
  Never weaken this. No dark patterns, no guilt-tripping, no fake urgency,
  no countdowns that pressure a decision.
- **Never** creepy, possessive, desperate, sexual, or sad.
- **Bilingual.** Most user-facing strings have an English (`...En`) and a Nepali
  (`...Ne`) variant. Keep both in sync when editing. Nepali is Devanagari script;
  keep the polite/formal register (तपाईं) — it is what makes the "official"
  joke land.

If you change wording, do it in **`src/data/content.js`** — components read all
copy from there.

## Stack & commands

- Vite 6 + React 18 (JSX, no TypeScript), Tailwind CSS 3, Framer Motion 11.
- Background visuals are plain Canvas/DOM — **do not add Three.js / WebGL or
  other heavy deps** without a strong reason. Keep the bundle light.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (must stay green)
npm run preview
```

There is no test suite or linter configured. "Done" means: `npm run build`
succeeds and the page looks/behaves correctly in the browser at mobile and
desktop widths.

## Architecture

- `src/App.jsx` — composition root. Fixed background layers (`ParticleField`,
  `CursorGlow`), a scroll-progress bar, a skip link, then the sections in order:
  Hero → TheCase → Evidence → Petition → ChoicePanel → FinalNote → Footer.
- `src/data/content.js` — **single source of truth for copy** (`meta`, `hero`,
  `theCase`, `evidence`, `petition`, `choice`, `appeal`, `finalNote`, `footer`).
- `src/components/*` — one file per section + small shared primitives
  (`Reveal`, `SectionLabel`, `Modal`, `Seal`, `HeartBurst`, `PhotoFrame`,
  `MusicPlayer`).
- `src/lib/notify.js` — optional Discord webhook ping, gated behind
  `VITE_DISCORD_WEBHOOK_URL`; silent no-op when unset.
- `src/index.css` — Tailwind layers plus reusable component classes
  (`.glass`, `.btn-primary`, `.btn-sky`, `.btn-ghost`, `.text-gradient`,
  `.doc-label`, `.rule`) and the body background gradient.
- `tailwind.config.js` — design tokens: the `romance` / `sky` / `ink` color
  scales, font families (`display`, `body`, `deva`, `devaSerif`, `mono`), and
  keyframes/animations.

## Conventions

- **Styling:** Tailwind utilities first; promote a pattern to a class in
  `index.css` `@layer components` only when it repeats. Use the theme tokens —
  avoid hard-coded hex values in components.
- **Devanagari text:** wrap in `className="ne"` (sans, Hind) or `"ne-serif"`
  (Tiro Devanagari) so the right font applies.
- **Motion:** every animation must degrade under `prefers-reduced-motion`.
  Use the `Reveal` wrapper or `useReducedMotion()` from Framer Motion. The
  canvas field and cursor glow already early-return when motion is reduced.
- **Accessibility:** keep semantic landmarks and headings in order, preserve the
  skip link, keep `:focus-visible` styles, and keep the modal's
  `role="dialog"` / `aria-modal` / Escape-to-close behavior. Maintain strong
  contrast (light text on the dark navy ground).
- **No real private photos** in the repo. The "masterpiece" is an abstract
  placeholder in `PhotoFrame.jsx`; the owner adds a real image themselves.

## Things to be careful about

- Don't break the bilingual pairing or drop the Nepali strings.
- The only thing that ever leaves the browser is the **opt-in Discord ping** in
  `notify.js`, and only when she deliberately picks "granted"/"hd" with a webhook
  configured. Don't add silent tracking, analytics, or pings on page-load /
  scroll / "needs more convincing" — that would betray the consent theme. The
  modal still tells her nothing is sent on her behalf; keep that honest (it's the
  petitioner's own notification of her answer, not background surveillance).
- Keep it a static SPA deployable to Netlify/Vercel with no env vars.
