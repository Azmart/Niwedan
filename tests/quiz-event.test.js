import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from '../api/quiz-event.js'
import { createQuizEventHandler } from '../server/quiz-event.js'
import netlifyHandler, { config as netlifyConfig } from '../netlify/functions/quiz-event.mjs'

const webhook = 'https://discord.com/api/webhooks/123/token'
const validPayload = () => ({
  version: 1,
  eventId: '123e4567-e89b-42d3-a456-426614174000',
  sessionId: '123e4567-e89b-42d3-a456-426614174001',
  event: 'answer_attempt',
  questionId: 'person-a',
  runNumber: 1,
  attemptNumber: 1,
  answer: 'PERSON_A',
  correct: true,
  lifeLost: false,
  livesRemaining: 5,
  streak: 1,
  replayCount: 0,
})

function request(body, headers = {}) {
  return new Request('https://example.test/api/quiz-event', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.test', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

test('a valid consented raw event reaches Discord with mentions disabled and one-line answers', async () => {
  let sent
  const handler = createQuizEventHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    now: () => new Date('2026-08-01T00:00:00Z'),
    fetchImpl: async (url, options) => { sent = { url, options }; return new Response('{}', { status: 200 }) },
  })
  const payload = { ...validPayload(), answer: '@everyone\r\nCorrect: forged\t\u0007PERSON_A' }
  assert.equal((await handler(request(payload))).status, 204)
  const sentBody = JSON.parse(sent.options.body)
  assert.match(sentBody.content, /@\u200beveryone/)
  assert.match(sentBody.content, /Answer: @\u200beveryone Correct: forged PERSON_A/)
  assert.doesNotMatch(sentBody.content, /\r|\u0007/)
  assert.equal(sentBody.content.split('\n').filter(line => line.startsWith('Correct:')).length, 1)
  assert.deepEqual(sentBody.allowed_mentions, { parse: [] })
  assert.equal(sent.url.searchParams.get('wait'), 'true')
})

test('invalid/private-shaped events do not call Discord', async () => {
  let calls = 0
  const handler = createQuizEventHandler({ env: { DISCORD_WEBHOOK_URL: webhook }, fetchImpl: async () => { calls += 1; return new Response('{}', { status: 200 }) } })
  assert.equal((await handler(request({ private: true }))).status, 400)
  assert.equal((await handler(request({ ...validPayload(), extra: 'not allowed' }))).status, 400)
  assert.equal((await handler(request({ ...validPayload(), answer: 'x'.repeat(161) }))).status, 400)
  assert.equal((await handler(request({ ...validPayload(), questionId: 'mission' }))).status, 400)
  assert.equal((await handler(request({ ...validPayload(), attemptNumber: 0 }))).status, 400)
  assert.equal((await handler(request({ ...validPayload(), event: 'run_failed', correct: true, lifeLost: false, livesRemaining: 1 }))).status, 400)
  assert.equal((await handler(request({ ...validPayload(), event: 'run_completed', questionId: 'mission', correct: false, lifeLost: true, livesRemaining: 0 }))).status, 400)
  assert.equal(calls, 0)
})

test('requires a same-site signal and exact JSON content type', async () => {
  let calls = 0
  const handler = createQuizEventHandler({ env: { DISCORD_WEBHOOK_URL: webhook }, fetchImpl: async () => { calls += 1; return new Response('{}', { status: 200 }) } })
  assert.equal((await handler(request(validPayload(), { origin: 'https://attacker.test' }))).status, 403)
  assert.equal((await handler(request(validPayload(), { origin: 'http://example.test' }))).status, 403)
  const noSignal = new Request('https://example.test/api/quiz-event', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validPayload()) })
  assert.equal((await handler(noSignal)).status, 403)
  const fetchSignal = new Request('https://example.test/api/quiz-event', { method: 'POST', headers: { 'content-type': 'application/json', 'sec-fetch-site': 'same-origin' }, body: JSON.stringify(validPayload()) })
  assert.equal((await handler(fetchSignal)).status, 204)
  const plain = new Request('https://example.test/api/quiz-event', { method: 'POST', headers: { origin: 'https://example.test' }, body: '{}' })
  assert.equal((await handler(plain)).status, 415)
  assert.equal((await handler(request(validPayload(), { 'content-type': 'text/plain; application/json' }))).status, 415)
  assert.equal((await handler(request(validPayload(), { 'content-type': 'application/json; charset=utf-8' }))).status, 204)
  assert.equal(calls, 2)
})

test('rejects malformed and UTF-8 oversized input before delivery', async () => {
  let calls = 0
  const handler = createQuizEventHandler({ env: { DISCORD_WEBHOOK_URL: webhook }, fetchImpl: async () => { calls += 1 } })
  assert.equal((await handler(request('{'))).status, 400)
  assert.equal((await handler(request(JSON.stringify({ ...validPayload(), padding: 'x'.repeat(3100) })))).status, 413)
  assert.equal((await handler(request(`${JSON.stringify(validPayload())}${'é'.repeat(1600)}`))).status, 413)
  assert.equal(calls, 0)
})

test('missing, rate-limited, and unavailable Discord paths do not leak details', async () => {
  const absent = createQuizEventHandler({ env: {} })
  assert.equal((await absent(request(validPayload()))).status, 503)
  const busy = createQuizEventHandler({ env: { DISCORD_WEBHOOK_URL: webhook }, fetchImpl: async () => new Response('', { status: 429 }) })
  assert.equal((await busy(request(validPayload()))).status, 503)
  const unavailable = createQuizEventHandler({ env: { DISCORD_WEBHOOK_URL: webhook }, fetchImpl: async () => { throw new Error('offline') } })
  const response = await unavailable(request(validPayload()))
  assert.equal(response.status, 502)
  assert.doesNotMatch(await response.text(), /webhook|discord\.com/i)
})

test('exports Vercel and Netlify-compatible handler shape with quiz rate limits', async () => {
  assert.equal(typeof POST, 'function')
  assert.equal(typeof netlifyHandler, 'function')
  assert.deepEqual(netlifyConfig.rateLimit.aggregateBy, ['ip', 'domain'])
  assert.ok(netlifyConfig.rateLimit.windowLimit >= 19)
  assert.equal((await POST(request(validPayload()))).status, 503)
})
