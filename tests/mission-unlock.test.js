import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from '../api/mission-unlock.js'
import { createMissionUnlockHandler } from '../server/mission-unlock.js'
import netlifyHandler, { config as netlifyConfig } from '../netlify/functions/mission-unlock.mjs'

const SERVICE_KEY = 'sekret-service-role-key-do-not-leak'

const validEnv = () => ({
  MISSION_ALIASES: 'Nick, second-alias',
  MISSION_NAME_A: 'A Name',
  MISSION_NAME_S: 'S Name',
  MISSION_ALIASES_A: 'Alpha, Beta',
  MISSION_ALIASES_S: 'Gamma',
  SUPABASE_URL: 'https://proj.supabase.co',
  SUPABASE_BUCKET: 'mission-143',
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
  MISSION_MEDIA: JSON.stringify({
    photo: [
      { path: 'photo-1.jpg', alt: 'p1' }, { path: 'photo-2.jpg', alt: 'p2' },
      { path: 'photo-3.jpg', alt: 'p3' }, { path: 'photo-4.jpg', alt: 'p4' },
    ],
    meme: [
      { path: 'meme-1.jpg', alt: 'm1' }, { path: 'meme-2.jpg', alt: 'm2' },
      { path: 'meme-3.jpg', alt: 'm3' }, { path: 'meme-4.jpg', alt: 'm4' },
    ],
  }),
})

const fakeSign = paths => paths.map(path => ({ path, signedURL: `/object/sign/mission-143/${path}?token=abc` }))

function request(body, headers = {}) {
  return new Request('https://example.test/api/mission-unlock', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.test', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

test('a correct name unlocks names, aliases, and signed media URLs in order, even from a shuffled response', async () => {
  let sentBody
  const fetchImpl = async (url, options) => {
    sentBody = JSON.parse(options.body)
    assert.equal(url, 'https://proj.supabase.co/storage/v1/object/sign/mission-143')
    return new Response(JSON.stringify(fakeSign(sentBody.paths).reverse()), { status: 200 })
  }
  const handler = createMissionUnlockHandler({ env: validEnv(), fetchImpl })
  const response = await handler(request({ version: 1, name: '  nick  ' }))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const payload = await response.json()
  assert.deepEqual(payload.names, { a: 'A Name', s: 'S Name' })
  assert.deepEqual(payload.aliases, { a: ['Alpha', 'Beta'], s: ['Gamma'] })
  payload.media.photo.forEach((item, index) => {
    assert.equal(item.src, `https://proj.supabase.co/storage/v1/object/sign/mission-143/photo-${index + 1}.jpg?token=abc`)
    assert.equal(item.alt, `p${index + 1}`)
  })
  payload.media.meme.forEach((item, index) => {
    assert.equal(item.src, `https://proj.supabase.co/storage/v1/object/sign/mission-143/meme-${index + 1}.jpg?token=abc`)
    assert.equal(item.alt, `m${index + 1}`)
  })
  assert.equal(sentBody.expiresIn, 28800)
})

test('a wrong name is rejected and Supabase is never called', async () => {
  let calls = 0
  const handler = createMissionUnlockHandler({ env: validEnv(), fetchImpl: async () => { calls += 1; return new Response('[]', { status: 200 }) } })
  assert.equal((await handler(request({ version: 1, name: 'not the nickname' }))).status, 401)
  assert.equal(calls, 0)
})

test('missing alias or name configuration returns 503 without revealing which', async () => {
  const noAliases = createMissionUnlockHandler({ env: { ...validEnv(), MISSION_ALIASES: '' } })
  assert.equal((await noAliases(request({ version: 1, name: 'nick' }))).status, 503)
  const noNames = createMissionUnlockHandler({ env: { ...validEnv(), MISSION_NAME_A: '' } })
  assert.equal((await noNames(request({ version: 1, name: 'nick' }))).status, 503)
})

test('rejects bad methods, cross-site origins, non-JSON, oversized, and malformed bodies', async () => {
  const handler = createMissionUnlockHandler({ env: validEnv() })
  assert.equal((await handler(new Request('https://example.test/api/mission-unlock', { method: 'GET' }))).status, 405)
  assert.equal((await handler(request({ version: 1, name: 'nick' }, { origin: 'https://attacker.test' }))).status, 403)
  const noSignal = new Request('https://example.test/api/mission-unlock', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ version: 1, name: 'nick' }) })
  assert.equal((await handler(noSignal)).status, 403)
  const plain = new Request('https://example.test/api/mission-unlock', { method: 'POST', headers: { origin: 'https://example.test' }, body: '{}' })
  assert.equal((await handler(plain)).status, 415)
  assert.equal((await handler(request(JSON.stringify({ version: 1, name: 'x'.repeat(600) })))).status, 413)
  assert.equal((await handler(request('{'))).status, 400)
  assert.equal((await handler(request({ version: 1, name: 'nick', extra: true }))).status, 400)
  assert.equal((await handler(request({ version: 2, name: 'nick' }))).status, 400)
  assert.equal((await handler(request({ name: 'nick' }))).status, 400)
  assert.equal((await handler(request({ version: 1, name: '' }))).status, 400)
  assert.equal((await handler(request({ version: 1, name: 'x'.repeat(81) }))).status, 400)
  assert.equal((await handler(request({ version: 1, name: 42 }))).status, 400)
})

test('Supabase failures (throw and non-ok status) still return 200 with names and empty media', async () => {
  const throwing = createMissionUnlockHandler({ env: validEnv(), fetchImpl: async () => { throw new Error('offline') } })
  const throwResponse = await throwing(request({ version: 1, name: 'nick' }))
  assert.equal(throwResponse.status, 200)
  const throwPayload = await throwResponse.json()
  assert.deepEqual(throwPayload.names, { a: 'A Name', s: 'S Name' })
  assert.ok(throwPayload.media.photo.every(item => item.src === ''))
  assert.ok(throwPayload.media.meme.every(item => item.src === ''))

  const nonOk = createMissionUnlockHandler({ env: validEnv(), fetchImpl: async () => new Response('server error', { status: 500 }) })
  const nonOkPayload = await (await nonOk(request({ version: 1, name: 'nick' }))).json()
  assert.ok(nonOkPayload.media.photo.every(item => item.src === ''))
  assert.ok(nonOkPayload.media.meme.every(item => item.src === ''))
})

test('malicious media paths are never sent to Supabase or signed', async () => {
  const maliciousMedia = JSON.stringify({
    photo: [
      { path: '../secrets.jpg', alt: 'a' }, { path: '/etc/passwd.jpg', alt: 'b' },
      { path: 'ok-3.jpg', alt: 'c' }, { path: 'ok-4.jpg', alt: 'd' },
    ],
    meme: [
      { path: 'ok-5.jpg', alt: 'e' }, { path: 'ok-6.jpg', alt: 'f' },
      { path: 'ok-7.jpg', alt: 'g' }, { path: 'ok-8.jpg', alt: 'h' },
    ],
  })
  let sentPaths
  const fetchImpl = async (url, options) => {
    sentPaths = JSON.parse(options.body).paths
    return new Response(JSON.stringify(fakeSign(sentPaths)), { status: 200 })
  }
  const handler = createMissionUnlockHandler({ env: { ...validEnv(), MISSION_MEDIA: maliciousMedia }, fetchImpl })
  const payload = await (await handler(request({ version: 1, name: 'nick' }))).json()
  assert.equal(payload.media.photo[0].src, '')
  assert.equal(payload.media.photo[0].alt, 'a')
  assert.equal(payload.media.photo[1].src, '')
  assert.ok(payload.media.photo[2].src)
  assert.ok(payload.media.photo[3].src)
  assert.ok(!sentPaths.includes('../secrets.jpg'))
  assert.ok(!sentPaths.includes('/etc/passwd.jpg'))
})

test('the service role key never appears anywhere in the response body', async () => {
  const fetchImpl = async (url, options) => new Response(JSON.stringify(fakeSign(JSON.parse(options.body).paths)), { status: 200 })
  const handler = createMissionUnlockHandler({ env: validEnv(), fetchImpl })
  const response = await handler(request({ version: 1, name: 'nick' }))
  const text = await response.text()
  assert.doesNotMatch(text, new RegExp(SERVICE_KEY))
})

test('exports Vercel and Netlify-compatible handler shapes with tighter rate limits', async () => {
  assert.equal(typeof POST, 'function')
  assert.equal(typeof netlifyHandler, 'function')
  assert.equal(netlifyConfig.path, '/api/mission-unlock')
  assert.equal(netlifyConfig.rateLimit.windowLimit, 30)
  assert.equal(netlifyConfig.rateLimit.windowSize, 900)
  assert.deepEqual(netlifyConfig.rateLimit.aggregateBy, ['ip', 'domain'])
  assert.equal((await POST(request({ version: 1, name: 'nick' }))).status, 503)
})

test('media type is classified from the configured path so gif, png, jpg and mp4 all render correctly', async () => {
  const env = {
    ...validEnv(),
    MISSION_MEDIA: JSON.stringify({
      photo: [
        { path: 'a.jpg', alt: 'jpg' }, { path: 'b.PNG', alt: 'png upper case' },
        { path: 'nested/c.gif', alt: 'gif in a folder' }, { path: 'd.jpeg', alt: 'jpeg' },
      ],
      meme: [
        { path: 'e.mp4', alt: 'mp4' }, { path: 'f.MOV', alt: 'mov upper case' },
        { path: 'g.webm', alt: 'webm' }, { path: 'h.gif', alt: 'gif' },
      ],
    }),
  }
  const handler = createMissionUnlockHandler({ env, fetchImpl: async (_url, options) => new Response(JSON.stringify(fakeSign(JSON.parse(options.body).paths)), { status: 200 }) })
  const body = await (await handler(request({ version: 1, name: 'Nick' }))).json()

  // gif/png/jpg stay images: <img> animates a gif natively, no <video> needed.
  assert.deepEqual(body.media.photo.map(item => item.type), ['image', 'image', 'image', 'image'])
  assert.deepEqual(body.media.meme.map(item => item.type), ['video', 'video', 'video', 'image'])
  assert.ok(body.media.meme[0].src.includes('e.mp4'))
})

test('unconfigured media still reports a usable type for every slot', async () => {
  const env = { ...validEnv(), MISSION_MEDIA: '' }
  const handler = createMissionUnlockHandler({ env, fetchImpl: async () => { throw new Error('must not be called') } })
  const body = await (await handler(request({ version: 1, name: 'Nick' }))).json()
  for (const item of [...body.media.photo, ...body.media.meme]) {
    assert.equal(item.src, '')
    assert.equal(item.type, 'image')
  }
})
