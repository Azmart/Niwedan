// Pings a Discord channel when she makes a choice. No backend: the browser POSTs
// straight to a Discord Incoming Webhook. Set VITE_DISCORD_WEBHOOK_URL in .env
// (and in your Netlify/Vercel env vars) to turn it on; unset = silent no-op.
// ponytail: webhook URL ships in the client bundle — fine for a personal site.
// If you must hide it, move this fetch behind a serverless function.

const MESSAGES = {
  granted: '✅ **Permission GRANTED** — gallery access approved. 💖',
  hd: '✨ **Chose: Send HD version first** — screenshot department shut down.',
}

export function notify(choice) {
  const url = import.meta.env.VITE_DISCORD_WEBHOOK_URL
  if (!url) return
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `${MESSAGES[choice] ?? choice}\n🕒 ${new Date().toLocaleString()}`,
    }),
  }).catch(() => {}) // never let a failed ping break the page
}
