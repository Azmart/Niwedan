// Site-wide password gate. Runs before every path (pages, static assets, /api/*),
// so no bundle, image, or endpoint is served until the shared password is entered.
// Unset SITE_PASSWORD leaves the site fully open, which keeps local `vite dev`
// and any preview without the variable working exactly as before.
const COOKIE = 'site-gate'
const MAX_AGE = 60 * 60 * 24 * 30
const encoder = new TextEncoder()

const sha256 = async value => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

// The token is an expiry plus a hash keyed by the password, so the password never
// travels in the cookie and changing it invalidates every token already issued.
// The password sits at the end of the hashed string: a length-extension forgery
// would need it as a prefix.
export const mintToken = async (password, expiresAt) =>
  `${expiresAt}.${await sha256(`${expiresAt}:${password}`)}`

export const isValidToken = async (token, password, now = Date.now()) => {
  const [expiresAt] = String(token || '').split('.')
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= now) return false
  return token === await mintToken(password, expiresAt)
}

// Digests are compared rather than the raw strings so a wrong password cannot be
// narrowed down character by character from response timing.
const matches = async (submitted, password) =>
  typeof submitted === 'string' && await sha256(submitted) === await sha256(password)

// Inline CSS and no external font so the gate itself needs no unguarded asset.
// Radii follow the gallery: pill buttons, 1.25rem card, .75rem input.
const page = failed => new Response(
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Who are you?</title>
<style>
:root { color-scheme: dark }
* { box-sizing: border-box }
body {
  margin: 0; min-height: 100dvh; display: grid; place-items: center; padding: 1.5rem;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #f3e7e4;
  background:
    radial-gradient(circle at 12% 6%, #a4365133, transparent 30rem),
    radial-gradient(circle at 88% 90%, #4c82a624, transparent 28rem),
    #0b111d;
}
main {
  width: 100%; max-width: 26rem; padding: clamp(1.75rem, 6vw, 2.5rem);
  border: 1px solid #ffffff1f; border-radius: 1.25rem; background: #121a2acc;
  box-shadow: 0 1.25rem 3rem #00000066;
}
h1 { margin: 0; font-size: clamp(1.9rem, 6vw, 2.4rem); font-weight: 600; letter-spacing: -.02em; line-height: 1.15 }
.sub { margin: .8rem 0 0; color: #c2cadb; line-height: 1.6 }
.ne {
  margin: .35rem 0 0; color: #9fa9bf; font-size: .95rem; line-height: 1.75;
  font-family: "Noto Sans Devanagari", Mangal, system-ui, sans-serif;
}
form { margin: 1.75rem 0 0; display: grid; gap: .5rem }
label { font-size: .85rem; color: #c2cadb }
input {
  width: 100%; min-height: 2.9rem; padding: 0 .9rem; border: 1px solid #ffffff2e;
  border-radius: .75rem; background: #0b111d; color: #f3e7e4; font: inherit;
}
input:focus-visible, button:focus-visible { outline: 2px solid #e58aa0; outline-offset: 2px }
button {
  margin-top: .75rem; min-height: 2.9rem; padding: 0 1.5rem; border: 0; border-radius: 999px;
  background: #f1d9d7; color: #321722; font: inherit; font-weight: 600; cursor: pointer;
  transition: transform 160ms ease, background 160ms ease;
}
button:hover { background: #fff0ec }
button:active { transform: translateY(1px) }
button[disabled] { opacity: .7; cursor: progress }
.error { margin: .9rem 0 0; color: #ffb4b4; font-size: .92rem; line-height: 1.5 }
@media (prefers-reduced-motion: no-preference) {
  main { animation: rise .5s cubic-bezier(.16, 1, .3, 1) both }
}
@keyframes rise { from { opacity: 0; transform: translateY(14px) } }
</style>
</head>
<body>
<main>
  <h1>Who are you?</h1>
  <p class="sub">Please enter password to access the site.</p>
  <p class="ne" lang="ne">साइटमा प्रवेश गर्न कृपया पासवर्ड हाल्नुहोस्।</p>
  <form method="post">
    <label for="site-password">Password</label>
    <input id="site-password" name="password" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">Enter</button>
  </form>
  ${failed ? '<p class="error" role="alert">That password is not right. Please try again.</p>' : ''}
</main>
<script>
document.querySelector('form').addEventListener('submit', event => {
  const button = event.currentTarget.querySelector('button')
  setTimeout(() => { button.disabled = true; button.textContent = 'Checking...' }, 0)
})
</script>
</body>
</html>`,
  {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
)

export default async (request, context) => {
  const password = Netlify.env.get('SITE_PASSWORD')
  if (!password) return

  if (await isValidToken(context.cookies.get(COOKIE), password)) return

  if (request.method !== 'POST') return page(false)

  const form = await request.formData().catch(() => null)
  // ponytail: no attempt throttling, so the password carries the whole load.
  // Use a long passphrase; add Netlify Blobs backed rate limiting if it is ever
  // shared widely enough to be worth guessing at.
  if (!await matches(form?.get('password'), password)) return page(true)

  const url = new URL(request.url)
  const expiresAt = Date.now() + MAX_AGE * 1000
  return new Response(null, {
    status: 303,
    headers: {
      Location: `${url.pathname}${url.search}`,
      'Cache-Control': 'no-store',
      'Set-Cookie': [
        `${COOKIE}=${await mintToken(password, expiresAt)}`,
        'Path=/',
        `Max-Age=${MAX_AGE}`,
        'HttpOnly',
        'SameSite=Lax',
        ...(url.protocol === 'https:' ? ['Secure'] : []),
      ].join('; '),
    },
  })
}

export const config = { path: '/*' }
