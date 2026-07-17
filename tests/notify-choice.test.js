import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from '../api/notify-choice.js'
import { createNotifyHandler } from '../server/notify-choice.js'

const webhook = 'https://discord.com/api/webhooks/123/token'

function request(body, headers = {}) {
  return new Request('https://example.test/api/notify-choice', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.test', ...headers },
    body: JSON.stringify(body),
  })
}

test('sends only an allowed choice to the server-side Discord webhook', async () => {
  let sent
  const handler = createNotifyHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    now: () => new Date('2026-07-17T00:00:00Z'),
    fetchImpl: async (url, options) => {
      sent = { url, options }
      return new Response('{}', { status: 200 })
    },
  })
  const response = await handler(request({ choice: 'granted' }))
  assert.equal(response.status, 204)
  assert.equal(sent.url.hostname, 'discord.com')
  assert.equal(sent.url.searchParams.get('wait'), 'true')
  assert.match(sent.options.body, /Permission GRANTED/)
})

test('rejects invalid choices without calling Discord', async () => {
  let calls = 0
  const handler = createNotifyHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    fetchImpl: async () => { calls += 1 },
  })
  assert.equal((await handler(request({ choice: 'anything-else' }))).status, 400)
  assert.equal(calls, 0)
})

test('does not send when the notification secret is absent or invalid', async () => {
  let calls = 0
  const fetchImpl = async () => { calls += 1 }
  const absent = createNotifyHandler({ env: {}, fetchImpl })
  const invalid = createNotifyHandler({
    env: { DISCORD_WEBHOOK_URL: 'https://example.com/not-a-webhook' },
    fetchImpl,
  })
  assert.equal((await absent(request({ choice: 'hd' }))).status, 503)
  assert.equal((await invalid(request({ choice: 'hd' }))).status, 503)
  assert.equal(calls, 0)
})

test('rejects cross-site, malformed, and oversized requests before calling Discord', async () => {
  let calls = 0
  const handler = createNotifyHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    fetchImpl: async () => { calls += 1 },
  })
  const crossSite = request({ choice: 'hd' }, { origin: 'https://attacker.test' })
  const headers = { 'content-type': 'application/json', origin: 'https://example.test' }
  const malformed = new Request('https://example.test/api/notify-choice', {
    method: 'POST', headers, body: '{',
  })
  const oversized = new Request('https://example.test/api/notify-choice', {
    method: 'POST', headers, body: JSON.stringify({ choice: 'hd', padding: 'x'.repeat(600) }),
  })
  assert.equal((await handler(crossSite)).status, 403)
  assert.equal((await handler(malformed)).status, 400)
  assert.equal((await handler(oversized)).status, 413)
  assert.equal(calls, 0)
})

test('turns a Discord rate limit into a generic retry response', async () => {
  const handler = createNotifyHandler({
    env: { DISCORD_WEBHOOK_URL: webhook },
    fetchImpl: async () => new Response('{}', { status: 429 }),
  })
  const response = await handler(request({ choice: 'hd' }))
  assert.equal(response.status, 503)
  assert.doesNotMatch(await response.text(), /webhook|discord\.com/i)
})

test('exports a Vercel POST handler backed by the shared notification boundary', async () => {
  assert.equal(typeof POST, 'function')
  const response = await POST(request({ choice: 'hd' }))
  assert.equal(response.status, 503)
})
