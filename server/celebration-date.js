const MAX_BODY_SIZE = 128

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function webhookUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !['discord.com', 'discordapp.com'].includes(url.hostname)) return null
    if (!/^\/api\/webhooks\/[^/]+\/[^/]+\/?$/.test(url.pathname)) return null
    return url
  } catch {
    return null
  }
}

function isSameSiteRequest(request) {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) return false

  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

function validDate(value, now) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false

  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const latest = new Date(today)
  latest.setUTCFullYear(latest.getUTCFullYear() + 2)
  return date >= today && date <= latest
}

export function createCelebrationDateHandler({ env = process.env, fetchImpl = fetch, now = () => new Date() } = {}) {
  return async function celebrationDate(request) {
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' })
    if (!isSameSiteRequest(request)) return json(403, { error: 'Request origin is not allowed.' })
    if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('content-type') || '')) {
      return json(415, { error: 'Expected JSON.' })
    }

    const declaredSize = Number(request.headers.get('content-length'))
    if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_SIZE) {
      return json(413, { error: 'Request is too large.' })
    }

    let payload
    try {
      const body = await request.text()
      if (new TextEncoder().encode(body).length > MAX_BODY_SIZE) return json(413, { error: 'Request is too large.' })
      payload = JSON.parse(body)
    } catch {
      return json(400, { error: 'Invalid request.' })
    }

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)
      || Object.keys(payload).length !== 1 || !validDate(payload.date, now())) {
      return json(400, { error: 'Invalid celebration date.' })
    }

    // This URL is read only on the server; the legacy key supports existing deployments.
    const webhook = webhookUrl(env.DISCORD_WEBHOOK_URL || env.VITE_DISCORD_WEBHOOK_URL)
    if (!webhook) return json(503, { error: 'Notifications are unavailable.' })

    webhook.searchParams.set('wait', 'true')
    try {
      const response = await fetchImpl(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Niwedan-Notification/1.0',
        },
        body: JSON.stringify({ content: `📅 Degree Day celebration date suggestion: ${payload.date}` }),
      })
      if (response.ok) return new Response(null, { status: 204 })
      if (response.status === 429) return json(503, { error: 'Notifications are busy. Please try again later.' })
    } catch {
      // Do not expose webhook details or upstream errors to the client.
    }

    return json(502, { error: 'Notifications could not be sent.' })
  }
}
