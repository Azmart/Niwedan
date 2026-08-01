import assert from 'node:assert/strict'
import test from 'node:test'
import gate, { config, isValidToken, mintToken } from '../netlify/edge-functions/site-gate.js'

const PASSWORD = 'a long shared passphrase'

globalThis.Netlify = { env: { get: name => (name === 'SITE_PASSWORD' ? PASSWORD : undefined) } }

const context = (token = undefined) => ({ cookies: { get: () => token } })
const visit = (url = 'https://site.test/apps/mission-143/') => new Request(url)
const submit = (password, url = 'https://site.test/apps/mission-143/') =>
  new Request(url, { method: 'POST', body: new URLSearchParams({ password }) })

test('the gate covers every path', () => {
  assert.equal(config.path, '/*')
})

test('a visit without a cookie is blocked and never reaches the site', async () => {
  const response = await gate(visit(), context())
  assert.equal(response.status, 401)
  assert.match(await response.text(), /Please enter password to access the site/)
})

test('a wrong password is rejected with the error shown', async () => {
  const response = await gate(submit('not the password'), context())
  assert.equal(response.status, 401)
  assert.match(await response.text(), /That password is not right/)
})

test('the right password issues a scoped cookie and returns to the requested path', async () => {
  const response = await gate(submit(PASSWORD), context())
  assert.equal(response.status, 303)
  assert.equal(response.headers.get('Location'), '/apps/mission-143/')
  const cookie = response.headers.get('Set-Cookie')
  for (const flag of ['Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax']) assert.ok(cookie.includes(flag), flag)
  assert.ok(!cookie.includes(PASSWORD))
})

test('a valid cookie passes the request through untouched', async () => {
  const token = await mintToken(PASSWORD, Date.now() + 60_000)
  assert.equal(await gate(visit(), context(token)), undefined)
})

test('expired, forged, and malformed tokens are refused', async () => {
  const now = Date.now()
  assert.equal(await isValidToken(await mintToken(PASSWORD, now - 1), PASSWORD, now), false)
  assert.equal(await isValidToken(await mintToken('another password', now + 60_000), PASSWORD, now), false)
  // Reusing a live signature under a later expiry must not extend the session.
  const live = await mintToken(PASSWORD, now + 60_000)
  assert.equal(await isValidToken(`${now + 600_000}.${live.split('.')[1]}`, PASSWORD, now), false)
  for (const token of ['', undefined, 'garbage', `${now + 60_000}.`]) {
    assert.equal(await isValidToken(token, PASSWORD, now), false)
  }
})

test('an unset password leaves the site open', async () => {
  globalThis.Netlify = { env: { get: () => undefined } }
  assert.equal(await gate(visit(), context()), undefined)
  globalThis.Netlify = { env: { get: () => PASSWORD } }
})
