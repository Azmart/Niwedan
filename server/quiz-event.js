const MAX_BODY_SIZE = 3072
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const EVENTS = new Set(['answer_attempt', 'run_failed', 'run_completed'])
const QUESTION_IDS = new Set([
  'person-a', 'special-people', 'nickname', 'nepali-song', 'dessert',
  'favourite-part', 'favourite-photo', 'favourite-meme', 'transport', 'line',
  'birthday', 'shy', 'second-nickname', 'dress', 'gift', 'would-rather',
  'favourite-habit', 'least-habit', 'first-meeting',
])
const FIELDS = new Set([
  'version', 'eventId', 'sessionId', 'event', 'questionId', 'runNumber',
  'attemptNumber', 'answer', 'correct', 'lifeLost', 'livesRemaining', 'streak',
  'replayCount',
])

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
  if (!origin && !fetchSite) return false
  if (!origin) return true
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

function isJsonContentType(value) {
  return /^application\/json(?:\s*;.*)?$/i.test(value?.trim() || '')
}

function isIntegerInRange(value, minimum, maximum) {
  return Number.isInteger(value) && value >= minimum && value <= maximum
}

function isValidPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false
  if (Object.keys(payload).some(key => !FIELDS.has(key))) return false
  if (Object.keys(payload).length !== FIELDS.size) return false
  if (payload.version !== 1 || !UUID.test(payload.eventId) || !UUID.test(payload.sessionId)) return false
  if (!EVENTS.has(payload.event)) return false
  if (!isIntegerInRange(payload.runNumber, 1, 1000) || !isIntegerInRange(payload.attemptNumber, 0, 100)) return false
  if (typeof payload.answer !== 'string' || payload.answer.length > 160) return false
  if (typeof payload.correct !== 'boolean' || typeof payload.lifeLost !== 'boolean') return false
  const validState = isIntegerInRange(payload.livesRemaining, 0, 5)
    && isIntegerInRange(payload.streak, 0, 6)
    && isIntegerInRange(payload.replayCount, 0, 999)
  if (!validState) return false

  const stableQuestion = QUESTION_IDS.has(payload.questionId)
  if (payload.event === 'answer_attempt') return stableQuestion && payload.attemptNumber >= 1
  if (payload.event === 'run_failed') {
    return stableQuestion && payload.attemptNumber >= 1 && !payload.correct
      && payload.lifeLost && payload.livesRemaining === 0
  }
  return (stableQuestion || payload.questionId === 'mission') && payload.attemptNumber >= 1
    && payload.correct && !payload.lifeLost && payload.livesRemaining >= 1
}

// Discord treats @everyone and role tags as active mentions. The quiz may carry
// raw answers only after explicit consent, so make those answers inert here too.
function escapeMentions(value) {
  return String(value).replaceAll('@', '@\u200b')
}

function safeAnswer(value) {
  return escapeMentions(value).replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function discordMessage(payload, now) {
  return [
    '**Mission 143 quiz event**',
    `Event: ${escapeMentions(payload.event)}`,
    `Run: ${payload.runNumber} | replay count: ${payload.replayCount}`,
    `Question: ${escapeMentions(payload.questionId)} | attempt: ${payload.attemptNumber}`,
    `Answer: ${safeAnswer(payload.answer) || '[empty]'}`,
    `Correct: ${payload.correct} | life lost: ${payload.lifeLost}`,
    `Lives: ${payload.livesRemaining} | streak: ${payload.streak}`,
    `At: ${now().toISOString()}`,
  ].join('\n')
}

export function createQuizEventHandler({ env = process.env, fetchImpl = fetch, now = () => new Date() } = {}) {
  return async function quizEvent(request) {
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' })
    if (!isSameSiteRequest(request)) return json(403, { error: 'Request origin is not allowed.' })
    if (!isJsonContentType(request.headers.get('content-type'))) return json(415, { error: 'Expected JSON.' })

    const declaredSize = Number(request.headers.get('content-length'))
    if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_SIZE) return json(413, { error: 'Request is too large.' })

    let payload
    try {
      const text = await request.text()
      if (new TextEncoder().encode(text).byteLength > MAX_BODY_SIZE) return json(413, { error: 'Request is too large.' })
      payload = JSON.parse(text)
    } catch {
      return json(400, { error: 'Invalid request.' })
    }
    if (!isValidPayload(payload)) return json(400, { error: 'Invalid quiz event.' })

    const webhook = validWebhookUrl(env.DISCORD_WEBHOOK_URL)
    if (!webhook) return json(503, { error: 'Sharing is unavailable.' })

    webhook.searchParams.set('wait', 'true')
    try {
      const response = await fetchImpl(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mission-143-Quiz/1.0' },
        body: JSON.stringify({ content: discordMessage(payload, now), allowed_mentions: { parse: [] } }),
      })
      if (response.ok) return new Response(null, { status: 204 })
      if (response.status === 429) return json(503, { error: 'Sharing is busy. Please continue privately.' })
    } catch {
      // Sharing is intentionally best-effort and must not expose webhook details.
    }
    return json(502, { error: 'Sharing could not be sent.' })
  }
}

export { MAX_BODY_SIZE, escapeMentions }
