const MESSAGES = {
  granted: '✅ **Permission GRANTED** — gallery access approved. 💖',
  hd: '✨ **Chose: Send HD version first** — screenshot department shut down.',
}

const MAX_BODY_SIZE = 512

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function validWebhookUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && (url.hostname === 'discord.com' || url.hostname === 'discordapp.com')
      && url.pathname.startsWith('/api/webhooks/')
      ? url
      : null
  } catch {
    return null
  }
}

function isSameSiteRequest(request) {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) return false

  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

export function createNotifyHandler({ env = process.env, fetchImpl = fetch, now = () => new Date() } = {}) {
  return async function notifyChoice(request) {
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' })
    if (!isSameSiteRequest(request)) return json(403, { error: 'Request origin is not allowed.' })
    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return json(415, { error: 'Expected JSON.' })
    }

    const declaredSize = Number(request.headers.get('content-length'))
    if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_SIZE) {
      return json(413, { error: 'Request is too large.' })
    }

    let payload
    try {
      const text = await request.text()
      if (text.length > MAX_BODY_SIZE) return json(413, { error: 'Request is too large.' })
      payload = JSON.parse(text)
    } catch {
      return json(400, { error: 'Invalid request.' })
    }

    if (!Object.hasOwn(MESSAGES, payload?.choice)) return json(400, { error: 'Unknown choice.' })

    // The fallback makes migration from the former local key non-breaking, but
    // neither key is ever referenced by Vite client code.
    const webhook = validWebhookUrl(env.DISCORD_WEBHOOK_URL || env.VITE_DISCORD_WEBHOOK_URL)
    if (!webhook) return json(503, { error: 'Notifications are unavailable.' })

    webhook.searchParams.set('wait', 'true')
    try {
      const discordResponse = await fetchImpl(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Niwedan-Notification/1.0',
        },
        body: JSON.stringify({ content: `${MESSAGES[payload.choice]}\n🕒 ${now().toLocaleString()}` }),
      })

      if (discordResponse.ok) return new Response(null, { status: 204 })
      if (discordResponse.status === 429) return json(503, { error: 'Notifications are busy. Please try again later.' })
    } catch {
      // A notification failure must never leak implementation details or secrets.
    }

    return json(502, { error: 'Notifications could not be sent.' })
  }
}
