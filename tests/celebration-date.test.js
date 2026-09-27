import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from '../api/celebration-date.js'
import { createCelebrationDateHandler } from '../server/celebration-date.js'
import netlifyHandler, { config } from '../netlify/functions/celebration-date.mjs'

const webhook = 'https://discord.com/api/webhooks/123/token'
const fixedNow = () => new Date('2026-09-27T20:00:00Z')

function request(body, headers = {}) {
  return new Request('https://example.test/api/celebration-date', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.test', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

test('sends one valid date to the server-side webhook and waits for Discord acceptance', async () => {
  let sent
  const handler = createCelebrationDateHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    now: fixedNow,
    fetchImpl: async (url, options) => {
      sent = { url, options }
      return new Response('{}', { status: 200 })
    },
  })

  const response = await handler(request({ date: '2026-10-17' }))
  assert.equal(response.status, 204)
  assert.equal(sent.url.hostname, 'discord.com')
  assert.equal(sent.url.searchParams.get('wait'), 'true')
  assert.deepEqual(JSON.parse(sent.options.body), {
    content: '📅 Degree Day celebration date suggestion: 2026-10-17',
  })
})

test('accepts today and the two-year boundary, including leap-day validation', async () => {
  const sent = []
  const handler = createCelebrationDateHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    now: fixedNow,
    fetchImpl: async (_url, options) => {
      sent.push(JSON.parse(options.body).content)
      return new Response('{}', { status: 200 })
    },
  })
  assert.equal((await handler(request({ date: '2026-09-27' }))).status, 204)
  assert.equal((await handler(request({ date: '2028-09-27' }))).status, 204)
  assert.equal((await handler(request({ date: '2028-02-29' }))).status, 204)
  assert.equal(sent.length, 3)
})

test('rejects malformed, impossible, past, distant, and unexpected payloads before fetch', async () => {
  let calls = 0
  const handler = createCelebrationDateHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    now: fixedNow,
    fetchImpl: async () => { calls += 1 },
  })
  for (const body of [
    { date: '2026-02-29' }, { date: '2026-09-26' }, { date: '2028-09-28' },
    { date: '2026-13-01' }, { date: '2026-10-1' }, { date: 20261017 },
    { date: '2026-10-17', name: 'someone' }, [], null, '{',
  ]) {
    assert.equal((await handler(request(body))).status, 400, JSON.stringify(body))
  }
  assert.equal(calls, 0)
})

test('rejects cross-origin, non-JSON, and oversized requests before fetch', async () => {
  let calls = 0
  const handler = createCelebrationDateHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    now: fixedNow,
    fetchImpl: async () => { calls += 1 },
  })
  assert.equal((await handler(request({ date: '2026-10-17' }, { origin: 'https://attacker.test' }))).status, 403)
  assert.equal((await handler(request({ date: '2026-10-17' }, { 'sec-fetch-site': 'cross-site' }))).status, 403)
  assert.equal((await handler(request({ date: '2026-10-17' }, { 'content-type': 'text/plain' }))).status, 415)
  assert.equal((await handler(request({ date: '2026-10-17', padding: 'x'.repeat(200) }))).status, 413)
  assert.equal(calls, 0)
})

test('returns unavailable without a valid secret and reports upstream failures generically', async () => {
  let calls = 0
  const fetchImpl = async () => { calls += 1; return new Response('{}', { status: 500 }) }
  const options = { fetchImpl, now: fixedNow }
  assert.equal((await createCelebrationDateHandler({ ...options, env: {} })(request({ date: '2026-10-17' }))).status, 503)
  assert.equal((await createCelebrationDateHandler({ ...options, env: { DISCORD_WEBHOOK_URL: 'https://example.test/hook' } })(request({ date: '2026-10-17' }))).status, 503)
  assert.equal(calls, 0)

  const failure = await createCelebrationDateHandler({ ...options, env: { DISCORD_WEBHOOK_URL: webhook } })(request({ date: '2026-10-17' }))
  assert.equal(failure.status, 502)
  assert.doesNotMatch(await failure.text(), /discord|webhook/i)
  assert.equal(calls, 1)

  const busy = await createCelebrationDateHandler({
    ...options, env: { DISCORD_WEBHOOK_URL: webhook },
    fetchImpl: async () => new Response('{}', { status: 429 }),
  })(request({ date: '2026-10-17' }))
  assert.equal(busy.status, 503)
})

test('exports deployment handlers and Netlify rate limit configuration', async () => {
  assert.equal(typeof POST, 'function')
  assert.equal(typeof netlifyHandler, 'function')
  assert.equal(config.path, '/api/celebration-date')
  assert.equal(config.rateLimit.windowLimit, 4)
})
